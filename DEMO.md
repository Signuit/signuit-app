# CollateralRouter Multi-Window Demo Guide

> **3-Party Demonstration**: Institution, Counterparty, and Operator

This guide walks through a full end-to-end demo of the CollateralRouter application using 3 browser windows to simulate different parties in the network.

---

## Architecture Overview

### Multi-Party Model

| Party                | Role          | Description                                    |
| -------------------- | ------------- | ---------------------------------------------- |
| **VantageCapital**   | Institution   | Asset owner, routing decision-maker            |
| **PrimeBank**        | Counterparty  | Issues margin calls                            |
| **SignUIT**          | Operator      | Network orchestrator, infrastructure provider  |

### Core Principle

> **"Operator as infrastructure, not gatekeeper"**

- Institution owns their routing decisions
- Counterparty initiates margin calls
- Operator observes but does NOT gate approvals

---

## Prerequisites

### 1. Environment Setup

Ensure your `.env` files have the following configuration:

```bash
# apps/web/.env
DATABASE_URL=file:/absolute/path/to/signuit-app/local.db
BETTER_AUTH_SECRET=your_32_character_secret_here
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development

# Canton / Nexus
CANTON_API_URL=http://127.0.0.1:7575
PQS_URL=postgres://postgres:postgres@localhost:5432/postgres
SESSION_SECRET=generate_a_32_byte_hex_key_here
SANDBOX_USER_ID=alice
SANDBOX_SECRET=secret

# Session Configuration (24h for development, auto-refresh 5min before expiry)
NEXUS_SESSION_TTL_HOURS=24
```

### 2. Dependencies

```bash
# Install dependencies
pnpm install

# Ensure Daml SDK 3.4.11 is installed
daml version  # Should output 3.4.11
```

---

## Demo Setup (15 minutes)

### Step 1: Start Canton Sandbox

```bash
cd sandbox
./start.sh
```

**Expected output:**
```
Building DAML...
Starting Canton sandbox...
Waiting for port 6865...
Uploading .daml/dist/nexus-example-0.0.1.dar...
Canton sandbox ready (PID: xxxxx)
```

**Verification:**
- Sandbox should be running on port `6865` (Ledger API)
- JSON API should be running on port `7575`

### Step 2: Run Seed Data Script

In a **new terminal**:

```bash
cd sandbox
daml script --dar .daml/dist/nexus-example-0.0.1.dar --script-name SeedData:seed_demo_scenario --ledger-host localhost --ledger-port 6865
```

**Expected output:**
```
=== SignUIT CollateralRouter Multi-Party Demo ===
Flow: Institution applies → Operator accepts → Routing executes
Parties: SignUIT (operator), VantageCapital (institution), PrimeBank (counterparty)
VantageCapital submitted JoinRequest
SignUIT accepted → ServiceAgreement created
Asset metadata created by SignUIT
Collateral holdings created by VantageCapital (institution-only)
PrimeBank created MarginCall → VantageCapital sees it
RoutingSuggestion created by VantageCapital
VantageCapital approved → AllocationRecord created
=== Demo seed complete ===
```

**What was created:**
- ✅ 3 parties provisioned: `SignUIT`, `VantageCapital`, `PrimeBank`
- ✅ ServiceAgreement between VantageCapital and SignUIT
- ✅ CollateralPolicy for VantageCapital
- ✅ 3 CollateralHoldings: USYC ($8.2M), UST ($12M), USDC ($25M)
- ✅ 1 MarginCall from PrimeBank ($15M required)
- ✅ 1 RoutingSuggestion (USYC + UST = $15M)
- ✅ 1 AllocationRecord (approved)

### Step 3: Start Web Application

In a **new terminal**:

```bash
# Start the web app
pnpm dev

# Or if you need to build first:
pnpm build && pnpm dev
```

**Expected output:**
```
> @nexus/app@0.0.0 dev
> vite

  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
```

**Verification:**
- Open `http://localhost:3001` in your browser
- You should see the login page

---

## 3-Window Demo Flow

### Window Setup

Open 3 **separate browser windows** (NOT tabs - use different windows or use incognito/profiles):

| Window | Role           | Email                      | Password         |
| ------ | -------------- | -------------------------- | ---------------- |
| 🏦 #1  | Institution    | demo-vantage@signuit.app   | demo-password-123 |
| 🏛️ #2  | Counterparty   | demo-primebank@signuit.app | demo-password-123 |
| ⚙️ #3  | Operator       | demo-operator@signuit.app  | demo-password-123 |

**Tips:**
- Use Chrome Profiles (click your avatar → "Add another account")
- Use different browsers (Chrome, Firefox, Safari)
- Use incognito windows

---

## Demo Walkthrough

### Act 1: Login All Parties (2 minutes)

#### Window 1️⃣: Institution (VantageCapital)
1. Navigate to `http://localhost:3001/login`
2. Enter credentials:
   - Email: `demo-vantage@signuit.app`
   - Password: `demo-password-123`
3. Click **Sign In**
4. ✅ You should see: "Institution Dashboard"
5. ✅ Sidebar shows: **INSTITUTION** role badge
6. ✅ Navigation: Dashboard, Holdings, Suggestions, Policy, Audit Trail

#### Window 2️⃣: Counterparty (PrimeBank)
1. Navigate to `http://localhost:3001/login`
2. Enter credentials:
   - Email: `demo-primebank@signuit.app`
   - Password: `demo-password-123`
3. Click **Sign In**
4. ✅ You should see: "Counterparty Terminal"
5. ✅ Sidebar shows: **COUNTERPARTY** role badge
6. ✅ Navigation: Dashboard, Margin Calls, Audit Trail

#### Window 3️⃣: Operator (SignUIT)
1. Navigate to `http://localhost:3001/login`
2. Enter credentials:
   - Email: `demo-operator@signuit.app`
   - Password: `demo-password-123`
3. Click **Sign In**
4. ✅ You should see: "Network Control Center"
5. ✅ Sidebar shows: **OPERATOR** role badge
6. ✅ Navigation: Dashboard, Network Holdings, All Suggestions, All Policies, Network Audit

---

### Act 2: Explore Dashboard (5 minutes)

#### 🏦 Window 1 (Institution) - Dashboard Overview

**What you should see:**
- **Available Collateral:** $45.2M (sum of all holdings)
- **Actionable Routes:** 0 (already approved in seed data)
- **Deployed Value:** 1 (one allocation completed)

**Collateral Holdings Card:**
- USYC: $8.2M (4.50% yield, 98% LTV)
- UST: $12.0M (4.20% yield, 95% LTV)
- USDC: $25.0M (0.00% yield, 100% LTV)

**Pending Approvals Card:**
- Should be empty (seed data already approved)

**Recent Allocations Table:**
- Route #001: USYC, UST
- Amount: $15.0M
- Saving: 10.0bps
- Status: RouteApproved (green badge)

#### 🏛️ Window 2 (Counterparty) - Margin Call View

**What you should see:**
- **Network Exposure:** $15.0M (margin call amount)
- **Active Margin Calls:** 0 (fulfilled)
- **Cumulative Fulfillments:** 1

**Active Margin Calls Card:**
- Should show "No pending calls" (seed data margin call was fulfilled)

**Recent Allocations:**
- Same allocation as Institution sees

#### ⚙️ Window 3 (Operator) - Network Oversight

**What you should see:**
- **Network Assets:** $45.2M (all institution holdings combined)
- **Global Suggestion Queue:** 0 (silent)
- **Executed Routes:** 1

**Network Holdings Card:**
- See all holdings across the network (currently only VantageCapital)

**Recent Allocations:**
- Observer view of all network activity

---

### Act 3: Holdings Deep Dive (3 minutes)

#### 🏦 Window 1 (Institution) - View Holdings

1. Click **"Holdings"** in sidebar
2. ✅ You should see a table with 3 assets:

| Asset | Amount    | Yield | Haircut | LTV  | Expiry |
| ----- | --------- | ----- | ------- | ---- | ------ |
| USYC  | $8.2M     | 4.50% | 2.00%   | 98%  | None   |
| UST   | $12.0M    | 4.20% | 5.00%   | 95%  | None   |
| USDC  | $25.0M    | 0.00% | 0.00%   | 100% | None   |

**Key observations:**
- USYC has highest yield but also highest haircut
- USDC is cash-equivalent (no yield, no haircut)
- UST is middle-ground (good yield, moderate haircut)

#### ⚙️ Window 3 (Operator) - Network Holdings View

1. Click **"Network Holdings"** in sidebar
2. ✅ Should see same holdings but with **Institution** column showing "VantageCapital"
3. Operator can observe but NOT modify holdings

---

### Act 4: Policy Configuration (2 minutes)

#### 🏦 Window 1 (Institution) - View Policy

1. Click **"Policy"** in sidebar
2. ✅ You should see:

**Policy Details:**
- Policy ID: `POLICY-001`
- Rule Type: **CTD** (Cheapest To Deliver)
- Priority List: `["USYC", "UST", "USDC"]`
- Min LTV: 95%
- Max Haircut: 10%
- Auto-Approve: **False** (manual approval required)

**Counterparty Rules:**
- PrimeBank → Allowed: USYC, UST, USDC

**Key insight:**
- CTD routing prioritizes lowest opportunity cost
- Auto-approve is OFF (institution controls all decisions)
- Institution defines which assets are acceptable per counterparty

---

### Act 5: Audit Trail (3 minutes)

#### 🏦 Window 1 (Institution) - Audit Trail

1. Click **"Audit Trail"** in sidebar
2. ✅ Should see all allocation records:

| Route | Assets      | Amounts        | Opportunity Cost | Status        | Created At |
| ----- | ----------- | -------------- | ---------------- | ------------- | ---------- |
| #001  | USYC, UST   | $8M, $7M       | 10.0bps          | RouteApproved | Apr 22 15:50 |

**Details to note:**
- Total amount: $15M (matches margin call)
- Assets selected: USYC + UST (following CTD policy)
- Opportunity cost: 10bps (saving vs using USDC)

#### 🏛️ Window 2 (Counterparty) - Audit View

1. Click **"Audit Trail"** in sidebar
2. ✅ Should see same allocation from counterparty perspective
3. Shows fulfillment of margin call MC-4821

#### ⚙️ Window 3 (Operator) - Network Audit

1. Click **"Network Audit"** in sidebar
2. ✅ Should see network-wide view
3. Shows institution name, counterparty name, and full routing details

---

## Demo Flow Summary

### What We Demonstrated

✅ **Role-Based Access Control**
- Each party sees only relevant navigation items
- Each role has appropriate permissions (observer vs. controller)

✅ **Multi-Party Workflow**
- Institution owns collateral decisions
- Counterparty initiates margin calls
- Operator observes without gatekeeping

✅ **Session Management**
- 24-hour session TTL in development
- Auto-refresh 5 minutes before expiry
- Better Auth + Nexus session coordination

✅ **Smart Contract Integration**
- Daml templates properly provisioned
- Seed data creates realistic scenario
- Real-time data from Canton ledger

✅ **UI/UX Consistency**
- Role badges in sidebar
- Role-specific welcome messages
- Consistent navigation patterns

---

## Testing New Scenarios

### Create a New Margin Call (Advanced)

Coming soon - requires Daml script or manual contract creation via Canton console.

### Test Session Refresh

1. Login as any user
2. Wait 23 hours and 55 minutes (or lower TTL in env)
3. ✅ Session should auto-refresh
4. ✅ No logout or interruption
5. Check browser DevTools → Network tab for `/api/nexus-auth/refresh` calls

---

## Troubleshooting

### Canton Sandbox Won't Start

```bash
# Kill lingering processes
pkill -f "daml sandbox" || true
pkill -f "CantonCommunityApp" || true

# Check ports
lsof -i :6865  # Ledger API
lsof -i :7575  # JSON API

# Restart
cd sandbox && ./start.sh
```

### Seed Data Script Fails

**Common Issue: Package Vetting**

If you see `PACKAGE_SELECTION_FAILED` or `consistently vetted` errors:

```bash
# 1. Kill existing sandbox
pkill -f "daml sandbox" || true
sleep 2

# 2. Restart Canton sandbox with clean state
cd sandbox
./start.sh &
sleep 10

# 3. Upload DAR
daml ledger upload-dar --host localhost --port 6865 .daml/dist/nexus-example-0.0.1.dar

# 4. Wait for vetting (important!)
sleep 5

# 5. Run seed script
daml script --dar .daml/dist/nexus-example-0.0.1.dar --script-name SeedData:seed_demo_scenario --ledger-host localhost --ledger-port 6865
```

**Alternative: Use Script via Sandbox**

If the script times out or hangs, try running it during sandbox startup:

```bash
# Edit sandbox/start.sh to add after DAR upload:
echo "Running seed script..."
$DAML script --dar "$DAR" --script-name SeedData:seed_demo_scenario --ledger-host localhost --ledger-port 6865
```

**Rebuild from scratch:**

```bash
# Complete reset
cd sandbox
rm -rf .daml/dist
daml build
# Then follow steps above
```

### Login Fails / Session Issues

```bash
# Clear Better Auth database
rm -f local.db

# Restart web app
pnpm dev
```

### Role Badge Not Showing

- Clear browser cache
- Ensure NavUser component was updated (check `packages/ui/src/components/nav-user.tsx`)
- Verify role is being passed from auth session

---

## Demo Script (Quick Reference)

```
1. Start Canton: cd sandbox && ./start.sh
2. Run seed data: daml script --dar .daml/dist/nexus-example-0.0.1.dar --script-name SeedData:seed_demo_scenario
3. Start app: pnpm dev
4. Open 3 windows:
   - Window 1: demo-vantage@signuit.app (Institution)
   - Window 2: demo-primebank@signuit.app (Counterparty)
   - Window 3: demo-operator@signuit.app (Operator)
5. Explore:
   - Dashboard stats
   - Holdings comparison
   - Policy configuration
   - Audit trail
```

---

## Next Steps

- [ ] Test session auto-refresh by lowering TTL temporarily
- [ ] Create new margin call scenario
- [ ] Test policy updates
- [ ] Test new collateral holding creation
- [ ] Measure E2E performance

---

**Questions?** Check `CLAUDE.md` for architecture details or `sandbox/daml/SeedData.daml` for seed data logic.
