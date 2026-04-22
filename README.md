# SignUIT CollateralRouter

**"Your collateral, always where it needs to be."**

A collateral operating system built on Canton Network that allows institutions to define their collateral policies once and automate eligible collateral routing with an immutable audit trail.

---

## Table of Contents

- [Quick Start](#quick-start-60-seconds)
- [The Problem](#the-problem)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Demo Walkthrough](#demo-walkthrough)
- [Daml Contracts](#dam-contracts)
- [Technical Stack](#technical-stack)
- [Contributing](#contributing)

---

## The Problem

Institutions managing tokenized assets on Canton still rely on significant human coordination to determine which collateral to deploy, when to substitute it, and how to respond to margin or liquidity needs.

> *"70% of firms report delivery challenges. Operational costs can represent the majority of total trade cost."*
> — ValueExchange / Canton Network, Jan 2026

In many institutions:
- Intrday collateral decisions are made using spreadsheets and manual coordination
- Cheapest-to-deliver (CTD) optimization requires expensive proprietary systems
- Collateral remains idle outside business hours, representing unrealized yield

**SignUIT CollateralRouter fills that gap** — the engine that helps assets already on Canton work as efficiently as possible.

---

## How It Works

### Core Concept

```
Traditional Collateral Management:    SignUIT CollateralRouter:

Margin call received              →   Smart contract trigger fires
Treasury team opens Excel         →   Rule engine evaluates policy
Manual asset selection            →   Cheapest-to-deliver computed
Phone call to counterparty        →   Suggestion presented with CTD rationale
Human approval required          →   Human approves (Day 1)
T+1 or T+2 settlement             →   Settlement triggered after approval
       →   Phase 2: fully automated execution
```

### Three Rule Types (MVP)

| Rule | Description |
|------|-------------|
| **Cheapest-to-Deliver (CTD)** | Selects collateral with lowest opportunity cost |
| **Expiry-First** | Prioritizes collateral nearing maturity |
| **Yield Maximizer** | Keeps highest-yielding assets deployed |

### Transaction Lifecycle

```
1. Trigger fires (margin call / schedule / manual)
2. Rule engine reads current policy
3. Holdings queried from Canton ledger
4. CTD algorithm selects optimal collateral
5. RoutingSuggestion created on Canton
6. User approves or rejects
7. AllocationRecord created (immutable audit trail)
8. Savings report: estimated CTD benefit logged
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              SignUIT CollateralRouter                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │  Web UI    │    │ Policy UI   │    │  Dashboard │   │
│  │ (TanStack) │    │  (Config)   │    │  (Audit)   │   │
│  └─────┬──────┘    └──────┬──────┘    └──────┬──────┘   │
│        │                  │                  │             │
│  ┌─────┴──────────────────┴────────────��─────┴─────┐ │
│  │              Nexus Framework (@nexus-framework)       │ │
│  │         Type-safe Canton + TanStack Query           │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────┴───────────────────────────────┐ │
│  │              Canton Ledger                          │ │
│  │   CollateralPolicy • RoutingSuggestion •           │ │
│  │                 AllocationRecord                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start (60 seconds)

> Prerequisites: Bun, Canton Sandbox running on `http://localhost:7575`

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build Daml contracts

```bash
cd sandbox
daml start
```

In another terminal:

```bash
cd sandbox
daml build
daml codegen js -o ./daml.js .daml/dist/*-0.0.1.dar
```

### 3. Start the web app

```bash
cd apps/web
pnpm dev
```

### 4. Demo workflow

Navigate to `http://localhost:3001`:

1. **Configure Policy**: Set priority order (USYC → UST → USDC)
2. **Simulate Margin Call**: Trigger a $15M margin call
3. **View Suggestion**: See CTD recommendation with savings
4. **Approve**: Click approve to execute
5. **Audit**: View immutable record in dashboard

---

## Demo Walkthrough

### Scenario: $15M Margin Call (5 minutes)

```
Step 1 — Trigger Fires
  Margin call #MC-4821 received: $15M required
  
Step 2 — CTD Calculation
  Available holdings:
    USYC:  $8.2M (yield: 4.5%, haircut: 2%)
    UST:  $12.0M (yield: 4.2%, haircut: 5%)
    USDC: $25.0M (yield: 0%, haircut: 0%)
    
  CTD Result:
    $8.2M USYC + $7.3M UST = $15.0M ✓
    Savings vs USDC: $1,849/night

Step 3 — User Approves
  Click "Approve" on suggestion screen
  Settlement executes on Canton

Step 4 — Audit Trail
  AllocationRecord #88341 created
  Chain: policy used → assets chosen → timestamp
```

### User Journey Screens

| Screen | Purpose |
|--------|----------|
| **Dashboard** | Portfolio overview, today's savings, active routes |
| **Policy** | Configure CTD rules, priority order, constraints |
| **Routing** | View pending suggestions, approve/reject |
| **Audit** | Searchable record of all executed routes |

---

## Daml Contracts

### Three Core Templates

**1. CollateralPolicy** — Institution routing rules

```daml
template CollateralPolicy
  with
    operator      : Party
    institution   : Party
    policyId      : Text
    ruleType      : Text
    priorityList  : [Text]
    minLtv        : Decimal
    maxHaircut    : Decimal
    active        : Bool
  where
    signatory operator, institution
```

**2. RoutingSuggestion** — Pending recommendation

```daml
template RoutingSuggestion
  with
    routeId        : Text
    institution    : Party
    marginCallId   : Text
    amountRequired : Decimal
    suggestedAsset : Text
    suggestedAmount: Decimal
    ctdSavings     : Decimal
    status         : Text
  where
    signatory institution
```

**3. AllocationRecord** — Immutable audit trail

```daml
template AllocationRecord
  with
    routeId        : Text
    institution    : Party
    assetSent      : Text
    amountSent     : Decimal
    ruleApplied    : Text
    ctdSavingsBps  : Decimal
    approvedBy     : Party
    status         : Text
  where
    signatory institution
```

---

## Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | TanStack Router, TanStack Query, React 19 |
| **Framework** | Nexus Framework (@nexus-framework) |
| **Ledger** | Canton Network JSON API |
| **Auth** | Better Auth / Canton Sandbox |
| **Styling** | Tailwind CSS v4 |

### Nexus Framework Features Used

- **Typed Namespaces** — `nexus.CollateralPolicy.useContracts()` with full type inference
- **TanStack Query Integration** — Automatic query key factories and cache invalidation
- **Consensus-Aware Mutations** — Wait for transaction finality, not just HTTP 200
- **WebSocket Streaming** — Real-time contract updates
- **Session Management** — Encrypted HttpOnly cookies

---

## Development

### Project Structure

```
signuit-app/
├── apps/web/              # TanStack Router web app
│   ├── src/
│   │   ├── routes/       # Page routes
│   │   ├── lib/         # Nexus client/server
│   │   ├── components/  # UI components
│   │   └── data/        # Mock assets, CTD engine
├── sandbox/
│   └── daml/            # Daml smart contracts
│       └── CollateralRouter.daml
├── framework/            # Nexus Framework packages
│   ├── core/            # CantonClient, auth
│   └── react/           # React hooks, plugins
└── packages/            # Shared packages
    └── api/             # ORPC procedures
```

### Running Locally

```bash
# 1. Start Canton Sandbox
daml sandbox sandbox/.daml/dist/*-0.0.1.dar

# 2. Build Daml (in sandbox dir)
daml build && daml codegen js -o ./daml.js .daml/dist/*-0.0.1.dar

# 3. Start web app
cd apps/web && pnpm dev
```

### Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start web app in development |
| `pnpm build` | Build for production |
| `daml build` | Compile Daml contracts |
| `daml start` | Start Canton Sandbox |

---

## MVP Scope (HackCanton)

### What's Included ✅

- [x] Policy configuration (priority order, LTV, haircut)
- [x] CTD calculation engine
- [x] Routing suggestion workflow
- [x] Approval/rejection UI
- [x] Audit trail dashboard
- [x] Canton testnet deployment

### What's NOT Included 🚫

- [ ] Weekend automation
- [ ] Yield Maximizer rules
- [ ] Cross-border substitution
- [ ] Live Chainlink oracle feeds
- [ ] Multi-counterparty routing
- [ ] Real payment execution

---

## Business Context

**SignUIT CollateralRouter** is being developed for HackCanton Season #1.

**Problem Statement:** 
- 70% of firms report collateral delivery challenges
- Operational costs represent majority of trade cost  
- No Canton-native collateral routing engine exists today

**Solution:**
- Policy suggestion engine with human approval (Day 1)
- Automated execution opt-in (Phase 2)
- Usage-based pricing

---

## License

Apache 2.0 — free to use, fork, and build on.

> "Daml" and "Canton" are registered trademarks of Digital Asset Holdings, LLC. SignUIT is an independent open-source project and is not affiliated with or endorsed by Digital Asset.

---

## References

- [Canton Network](https://www.canton.network/)
- [Nexus Framework](./README.md)
- [ValueExchange / Canton Network Report](https://thevx.io/campaign/treasuries-on-chain-an-industry-case-for-change/)
- [Daml Documentation](https://docs.daml.com/)