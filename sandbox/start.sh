#!/bin/bash
set -e

# Check if daml is in PATH, otherwise fallback to default location
if command -v daml &> /dev/null; then
  DAML=daml
else
  DAML=~/.daml/bin/daml
fi
DAR=".daml/dist/nexus-example-0.0.1.dar"

# Kill any lingering sandbox on startup
pkill -f "daml sandbox" 2>/dev/null || true
pkill -f "CantonCommunityApp" 2>/dev/null || true
sleep 2

# Build if DAR doesn't exist
if [ ! -f "$DAR" ]; then
  echo "Building DAML..."
  $DAML build
fi

# Start sandbox
SANDBOX_LOG="/tmp/canton-sandbox.log"
echo "Starting Canton sandbox..."
JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US" \
  $DAML sandbox --json-api-port 7575 > "$SANDBOX_LOG" 2>&1 &
SANDBOX_PID=$!

# Tail the log in background
tail -f "$SANDBOX_LOG" &
TAIL_PID=$!

# Wait for ledger API (port 6865) to be ready
echo "Waiting for ledger API (port 6865)..."
for i in $(seq 1 60); do
  if nc -z localhost 6865 2>/dev/null; then
    echo "Port 6865 ready (${i}s)"
    break
  fi
  if ! kill -0 $SANDBOX_PID 2>/dev/null; then
    kill $TAIL_PID 2>/dev/null
    echo "Sandbox crashed. Check $SANDBOX_LOG"
    exit 1
  fi
  sleep 1
done

# Wait for JSON API (port 7575) to be ready — fully initialized indicator
echo "Waiting for JSON API (port 7575)..."
for i in $(seq 1 30); do
  if curl -sf --max-time 2 http://localhost:7575/v2/packages > /dev/null 2>&1; then
    echo "JSON API ready (${i}s)"
    break
  fi
  sleep 1
done
sleep 3

# Upload DAR with retry (up to 5 attempts)
echo "Uploading $DAR..."
UPLOAD_OK=false
for attempt in 1 2 3 4 5; do
  UPLOAD_OUT=$($DAML ledger upload-dar --host localhost --port 6865 "$DAR" 2>&1 \
    | grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable" || true)
  if echo "$UPLOAD_OUT" | grep -q "succeeded"; then
    echo "DAR upload succeeded (attempt $attempt)"
    UPLOAD_OK=true
    break
  else
    echo "Upload attempt $attempt failed, retrying in 3s..."
    sleep 3
  fi
done

if [ "$UPLOAD_OK" = false ]; then
  echo "WARNING: DAR upload failed after 5 attempts. Web app will auto-retry on startup."
fi

echo "Canton sandbox ready (PID: $SANDBOX_PID)"

# Keep sandbox in foreground
wait $SANDBOX_PID
kill $TAIL_PID 2>/dev/null
