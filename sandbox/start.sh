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

# Always rebuild DAR and regenerate JS codegen so package ID stays in sync
echo "Building DAML..."
$DAML build

echo "Regenerating JS codegen..."
$DAML codegen js "$DAR" -o daml.js 2>&1 | grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable\|Skipping\|Generating"

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
  echo "WARNING: DAR upload failed after 5 attempts."
fi

# Seed flag is tied to the sandbox PID — guarantees re-seed on every fresh start.
# Old flags from previous runs are cleaned up automatically.
rm -f /tmp/canton-seeded-* 2>/dev/null || true
SEED_FLAG="/tmp/canton-seeded-${SANDBOX_PID}"

echo "Running seed script..."

# Resolve party IDs from Canton HTTP API (parties may already exist from prior runs)
# Build a minimal JWT for the admin query
ADMIN_TOKEN=$(node -e "
const secret = process.env.SANDBOX_SECRET || 'secret';
const crypto = require('crypto');
const enc = s => Buffer.from(s).toString('base64url');
const header = enc(JSON.stringify({alg:'HS256',typ:'JWT'}));
const now = Math.floor(Date.now()/1000);
const payload = enc(JSON.stringify({sub:'admin',scope:'daml_ledger_api',iat:now,exp:now+3600}));
const sig = crypto.createHmac('sha256', secret).update(header+'.'+payload).digest('base64url');
console.log(header+'.'+payload+'.'+sig);
" 2>/dev/null || echo "")

PARTIES_JSON=$(curl -sf http://localhost:7575/v2/parties \
  -H "Authorization: Bearer $ADMIN_TOKEN" 2>/dev/null || echo '{"partyDetails":[]}')

get_party() {
  echo "$PARTIES_JSON" | python3 -c "
import json,sys
hint='$1'
data=json.load(sys.stdin)
parties=data.get('partyDetails',[])
match=next((p['party'] for p in parties if p['party'].split('::')[0].startswith(hint)),None)
print(match or '')
" 2>/dev/null
}

OPERATOR_PARTY=$(get_party "SignUIT")
INSTITUTION_PARTY=$(get_party "VantageCapital")
COUNTERPARTY_PARTY=$(get_party "PrimeBank")

if [ -n "$OPERATOR_PARTY" ] && [ -n "$INSTITUTION_PARTY" ] && [ -n "$COUNTERPARTY_PARTY" ]; then
  echo "Found existing parties — seeding with pre-resolved IDs"
  # Write input JSON for seed_with_parties script
  INPUT_FILE="/tmp/seed-input-${SANDBOX_PID}.json"
  python3 -c "
import json
print(json.dumps({
  'operatorId':     '$OPERATOR_PARTY',
  'institutionId':  '$INSTITUTION_PARTY',
  'counterpartyId': '$COUNTERPARTY_PARTY'
}))
" > "$INPUT_FILE"

  SEED_OUT=$($DAML script \
    --dar "$DAR" \
    --script-name SeedData:seed_with_parties \
    --input-file "$INPUT_FILE" \
    --ledger-host localhost \
    --ledger-port 6865 2>&1 \
    | grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable" || true)
  rm -f "$INPUT_FILE"
else
  echo "No existing parties — allocating fresh parties via seed_demo_scenario"
  SEED_OUT=$($DAML script \
    --dar "$DAR" \
    --script-name SeedData:seed_demo_scenario \
    --ledger-host localhost \
    --ledger-port 6865 2>&1 \
    | grep -v "WARNING\|deprecated\|DPM\|dpm.html\|removed in\|disable" || true)
fi

# Check for real failures (ignore expected non-fatal errors)
REAL_ERROR=$(echo "$SEED_OUT" | grep -i "error\|failed\|exception" \
  | grep -iv "party.*already\|already.*allocated\|ALREADY_EXISTS\|ExitFailure\|NotFound(Package\|ConverterException\|FailedCmd" || true)

if [ -n "$REAL_ERROR" ]; then
  echo "WARNING: Seed script may have partially failed:"
  echo "$SEED_OUT" | grep -i "debug\|created\|exists\|complete" | tail -10
else
  echo "Seed script completed (core data ready)."
  touch "$SEED_FLAG"
fi

echo "Canton sandbox ready (PID: $SANDBOX_PID)"

# Keep sandbox in foreground
wait $SANDBOX_PID
kill $TAIL_PID 2>/dev/null
