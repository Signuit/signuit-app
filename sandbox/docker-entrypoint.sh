#!/bin/bash
set -e

# daml CLI is installed by the Dockerfile at /root/.daml/bin/daml
DAML=/root/.daml/bin/daml
DAR="/workspace/.daml/dist/nexus-example-0.0.1.dar"

# Start Canton sandbox in background
echo "[entrypoint] Starting Canton sandbox..."
JAVA_TOOL_OPTIONS="-Duser.language=en -Duser.country=US" \
  $DAML sandbox --config /workspace/canton.conf &
SANDBOX_PID=$!

# Wait for ledger API (port 6865)
echo "[entrypoint] Waiting for ledger API..."
for i in $(seq 1 60); do
  if nc -z localhost 6865 2>/dev/null; then
    echo "[entrypoint] Ledger API ready (${i}s)"
    break
  fi
  if ! kill -0 $SANDBOX_PID 2>/dev/null; then
    echo "[entrypoint] Canton crashed."
    exit 1
  fi
  sleep 1
done

# Wait for JSON API (port 7575)
echo "[entrypoint] Waiting for JSON API..."
for i in $(seq 1 30); do
  if curl -sf --max-time 2 http://localhost:7575/v2/packages > /dev/null 2>&1; then
    echo "[entrypoint] JSON API ready (${i}s)"
    break
  fi
  sleep 1
done
sleep 3

# Upload DAR with retry — skip if already uploaded (KNOWN_PACKAGE_VERSION is OK)
echo "[entrypoint] Uploading DAR..."
for attempt in 1 2 3 4 5; do
  OUT=$($DAML ledger upload-dar --host localhost --port 6865 "$DAR" 2>&1 \
    | grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable" || true)
  if echo "$OUT" | grep -q "succeeded"; then
    echo "[entrypoint] DAR uploaded successfully (attempt $attempt)"
    break
  elif echo "$OUT" | grep -q "KNOWN_PACKAGE_VERSION"; then
    echo "[entrypoint] DAR already uploaded, skipping."
    break
  else
    echo "[entrypoint] Upload attempt $attempt failed, retrying in 3s..."
    sleep 3
  fi
done

echo "[entrypoint] Canton sandbox ready."

# Copy DAR to shared volume so the web container can also access it
mkdir -p /dar
cp "$DAR" /dar/nexus-example-0.0.1.dar
echo "[entrypoint] DAR copied to /dar for web container."

# Keep sandbox in foreground
wait $SANDBOX_PID
