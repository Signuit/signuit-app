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
| **Cheapest-to-Deliver (CTD)** | Preserves yield by sending non-yielding assets first |
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
8. Efficiency report: opportunity cost analysis logged
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
3. **View Suggestion**: See CTD recommendation with opportunity cost analysis
4. **Approve**: Click approve to execute
5. **Audit**: View immutable record in dashboard

---

## Demo Walkthrough

### Scenario: $15M Margin Call

**Context:** VantageCapital receives a $15M margin call from PrimeBank at 3:47 PM ET. Required by 4:00 PM ET.

```
Step 1 — Margin Call Trigger
  Margin call #MC-4821 received
  Amount required: $15.0M USD
  Deadline: 13 minutes
  
Step 2 — CTD Engine Analyzes Holdings
  Available collateral:
    • USDC:  $25.0M (yield: 0%, LTV: 100%, expires: never)
    • UST:   $12.0M (yield: 4.2%, LTV: 95%, expires: 2027-06-15)
    • USYC:  $8.2M (yield: 4.5%, LTV: 98%, expires: 2027-09-20)
    
  Opportunity cost calculation:
    • USDC → $0.00/day (no yield to lose)
    • UST  → $51.70/day (lost yield on $15M equivalent)
    • USYC → $55.48/day (lost yield on $15M equivalent)

Step 3 — CTD Recommendation
  ✓ Selected: $15.0M USDC
  
  Why USDC?
    ✓ Zero opportunity cost (no yield sacrificed)
    ✓ 100% LTV (no over-collateralization needed)
    ✓ Instant settlement, maximum liquidity
    ✓ Preserves $20.2M of yield-bearing assets
    ✓ Keeps USYC + UST earning ~$2,300/day combined
    
  Value delivered:
    • Decision time: 3 seconds (vs 30-minute manual process)
    • Policy compliance: automatic eligibility checking
    • Audit trail: immutable record on Canton
    • Capital efficiency: yield-bearing assets preserved

Step 4 — User Approves
  Ops team reviews suggestion
  Clicks "Approve" at 3:48 PM ET
  Settlement initiated on Canton ledger

Step 5 — Audit Trail Created
  AllocationRecord created on-chain
  Contract ID: #00c4f1e8b3a2...
  Traceable: policy used → assets selected → approver → timestamp
  Immutable: cannot be altered or deleted
```

**What if USDC wasn't available?**

If USDC holdings were insufficient:
```
Scenario: $30M margin call, but only $25M USDC available

CTD Result:
  $25.0M USDC (exhaust non-yielding first)
  + $5.26M UST (next cheapest: 4.2% yield, 95% LTV)
  = $30.0M ✓

This proves the algorithm is intelligent, not just "always USDC."
It falls back to yield-bearing assets only when necessary.
```

### User Journey Screens

| Screen | Purpose |
|--------|----------|
| **Dashboard** | Portfolio overview, today's efficiency, active routes |
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
    estimatedOpportunityCost : Decimal
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
    opportunityCostBps : Decimal
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