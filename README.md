<div align="center">
  <br>
  <img src="assets/logo_white.png" alt="SignUIT" width="320">
  <br><br>
  <strong>Policy-Based Collateral Routing Engine on Canton Network</strong>
  <br>
  <sub>Compute optimal collateral in 3 seconds. Record on-ledger. Approve with confidence.</sub>
  <br><br>

  [![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
  [![Build](https://img.shields.io/github/actions/workflow/status/signuit/signuit-app/ci.yml?branch=main&label=CI)](https://github.com/signuit/signuit-app/actions)
  [![Canton Network](https://img.shields.io/badge/Canton_Network-Powered-0A0A0A?logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==)](https://www.canton.network/)
  [![Daml](https://img.shields.io/badge/Daml_SDK-3.4.11-00B4D8)](https://docs.daml.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)

  <br>

  [Getting Started](#getting-started) · [Architecture](#architecture) · [API Reference](#api-reference) · [Contributing](#contributing)
</div>

<br>

---

## Overview

**SignUIT CollateralRouter** is a policy-based collateral routing recommendation engine built on the [Canton Network](https://www.canton.network/). It automates the selection of optimal collateral for margin calls using a Cheapest-to-Deliver (CTD) algorithm, records every recommendation as an immutable smart contract on-ledger, and enforces human approval before execution.

The platform replaces manual spreadsheet-based workflows that take 30+ minutes with automated, policy-compliant decisioning in under 3 seconds — while preserving full human oversight and producing a complete audit trail for regulatory reporting.

---

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [CTD Engine](#ctd-engine)
- [API Reference](#api-reference)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## The Problem

Institutions managing tokenized assets on Canton still rely on significant human coordination to determine which collateral to deploy, when to substitute it, and how to respond to margin or liquidity needs.

> *"70% of firms report delivery challenges. Operational costs can represent the majority of total trade cost."*
> — ValueExchange / Canton Network, Jan 2026

**Current state at most institutions:**

| Challenge | Impact |
|-----------|--------|
| Excel-based asset selection | Error-prone, 30+ min per margin call |
| No automated policy compliance | Regulatory risk, manual checking |
| No immutable audit trail | Difficult regulatory reporting |
| After-hours margin calls | Require human coordination around the clock |
| No Canton-native routing engine | Integration gap in the ecosystem |

SignUIT CollateralRouter fills this gap — the engine that helps assets already on Canton work as efficiently as possible.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **CTD Optimization** | Cheapest-to-Deliver algorithm computes optimal collateral selection in 3 seconds, minimizing opportunity cost |
| **On-Ledger Audit Trail** | Every routing decision is recorded as an immutable Daml smart contract on Canton — traceable, tamper-proof |
| **Policy Engine** | Configurable routing rules (CTD, Expiry-First, Yield Maximizer) with LTV, haircut, and counterparty constraints |
| **Multi-Party Privacy** | Canton's sub-transaction privacy ensures sensitive positions are only visible to relevant parties |
| **Human-in-the-Loop** | All routing suggestions require explicit approval before execution — automated decisioning, manual control |
| **Role-Based Access** | Distinct dashboards for Institution (asset owner), Counterparty (margin caller), and Operator (network) |
| **Yield Preservation** | Algorithm prioritizes non-yielding assets first, preserving yield-bearing positions in the portfolio |
| **Real-Time Updates** | WebSocket streaming with TanStack Query integration for live contract state synchronization |

---

## How It Works

### Traditional vs. SignUIT

```
Traditional (Manual)                      SignUIT CollateralRouter
─────────────────────────                 ─────────────────────────
Margin call received                  →   Smart contract trigger
Treasury opens Excel         (30 min) →   CTD engine computes          (3 sec)
Manual asset selection                →   Recommendation on Canton
Compliance check (manual)             →   Policy evaluation (automatic)
Phone call / email                    →   Human reviews and approves
T+1 or T+2 settlement                →   On-ledger execution
```

### Transaction Lifecycle

```
1. TRIGGER        Margin call received (counterparty creates MarginCall contract)
2. EVALUATE       CTD engine reads active CollateralPolicy from Canton
3. COMPUTE        Holdings queried, opportunity cost calculated per asset
4. RECOMMEND      RoutingSuggestion created on-ledger (immutable record)
5. APPROVE        Ops team reviews and approves (or rejects)
6. SETTLE         AllocationRecord created — full audit trail on Canton
```

### Routing Rule Types

| Rule | Strategy | Use Case |
|------|----------|----------|
| **Cheapest-to-Deliver** | Minimize opportunity cost by sending non-yielding assets first | Default — maximizes capital efficiency |
| **Expiry-First** | Prioritize collateral nearing maturity | Treasury management, reducing rollover risk |
| **Yield Maximizer** | Keep highest-yielding assets deployed | Aggressive yield optimization strategies |

---

## Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                      SignUIT CollateralRouter                         │
│                                                                      │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐            │
│  │  Dashboard    │   │  Policy      │   │  Audit       │            │
│  │  (Portfolio)  │   │  (Config)    │   │  (Trail)     │            │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘            │
│         │                  │                   │                     │
│  ┌──────┴──────────────────┴───────────────────┴──────┐             │
│  │            TanStack Router + React 19               │             │
│  │         TanStack Query · oRPC · Zod Schemas         │             │
│  └─────────────────────┬──────────────────────────────┘             │
│                        │                                             │
│  ┌─────────────────────┴──────────────────────────────┐             │
│  │              Nexus Framework                        │             │
│  │     Type-safe Canton client · Session management    │             │
│  │     JWT auth · Party ID resolution · SSR support    │             │
│  └─────────────────────┬──────────────────────────────┘             │
│                        │                                             │
│  ┌─────────────────────┴──────────────────────────────┐             │
│  │        Canton Network (JSON Ledger API)             │             │
│  │                                                     │             │
│  │   CollateralPolicy    RoutingSuggestion             │             │
│  │   CollateralHolding   AllocationRecord              │             │
│  │   MarginCall          ServiceAgreement              │             │
│  └─────────────────────────────────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────┘
```

### Multi-Party Model

SignUIT operates on a strict multi-party ownership model. The core design principle: **"Operator as infrastructure, not gatekeeper."** Institutions own their routing decisions; the operator observes but does not gate approvals.

| Party | Role | Responsibility |
|-------|------|----------------|
| **SignUIT** | Operator | Network orchestration, infrastructure, market data |
| **Institution** | Asset Owner | Collateral management, routing decisions, approvals |
| **Counterparty** | Margin Caller | Issues margin calls, receives collateral |

### Contract Ownership

| Template | Signatory | Observer | Controller |
|----------|-----------|----------|------------|
| `JoinRequest` | Institution | Operator | Operator |
| `ServiceAgreement` | Institution + Operator | — | — |
| `CollateralPolicy` | Institution + Operator | — | Institution |
| `CollateralHolding` | Institution | Operator | Institution |
| `MarginCall` | Counterparty | Institution, Operator | Counterparty |
| `RoutingSuggestion` | Institution | Operator | Institution |
| `AllocationRecord` | Institution | Operator | Institution |

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI framework |
| TanStack Router | 1.x | File-based routing with SSR (TanStack Start) |
| TanStack Query | 5.x | Server state management, cache invalidation |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | — | Component library (59 components, Radix-based) |
| Recharts | — | Data visualization |
| Framer Motion | — | Animations |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Nexus Framework | Custom | Type-safe Canton SDK (auth, sessions, ledger client) |
| oRPC | 1.x | End-to-end type-safe RPC layer |
| Better Auth | 1.x | Authentication (email/password, session management) |
| Drizzle ORM | 0.45.x | Database ORM with migration support |
| libSQL / Turso | — | SQLite database (local + cloud) |
| Zod | 4.x | Runtime schema validation |

### Smart Contracts

| Technology | Version | Purpose |
|------------|---------|---------|
| Daml | SDK 3.4.11 | Smart contract language |
| Canton Network | Sandbox | Privacy-preserving distributed ledger |
| Daml Codegen JS | — | TypeScript binding generation from Daml |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| pnpm | Package management (workspaces) |
| Turborepo | Monorepo build orchestration |
| Biome | Linting and formatting |
| Bun | Runtime (preferred) |
| GitHub Actions | CI/CD pipeline |
| Docker | Canton sandbox containerization |

---

## Getting Started

### Prerequisites

| Requirement | Version |
|-------------|---------|
| [Bun](https://bun.sh/) | Latest |
| [pnpm](https://pnpm.io/) | 10.x+ |
| [Daml SDK](https://docs.daml.com/getting-started/installation.html) | 3.4.x |
| [Docker](https://www.docker.com/) | Latest (for Canton sandbox) |

### 1. Clone and Install

```bash
git clone https://github.com/signuit/signuit-app.git
cd signuit-app
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=file:local.db
BETTER_AUTH_SECRET=<32-character-secret>
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
CANTON_API_URL=http://127.0.0.1:7575
SESSION_SECRET=<32-byte-hex-key>
```

### 3. Start Canton Sandbox

```bash
cd sandbox
daml start
```

In a separate terminal, build and generate TypeScript bindings:

```bash
cd sandbox
daml build
daml codegen js -o ./daml.js .daml/dist/*-0.0.1.dar
```

### 4. Initialize Database

```bash
cd packages/db
pnpm db:push
pnpm db:seed
```

### 5. Start the Platform

```bash
pnpm dev
```

The web application will be available at `http://localhost:3001`.

### Demo Accounts

Three pre-configured accounts are available for testing the multi-party workflow:

| Role | Email | Party |
|------|-------|-------|
| Institution | `demo-vantage@signuit.app` | VantageCapital |
| Counterparty | `demo-primebank@signuit.app` | PrimeBank |
| Operator | `demo-operator@signuit.app` | SignUIT |

> Password for all demo accounts: `password`

---

## Smart Contracts

SignUIT uses 8 Daml templates to model the full collateral routing lifecycle. All contracts are defined in `sandbox/daml/CollateralRouter.daml`.

### Core Templates

**CollateralPolicy** — Institution-defined routing rules

```daml
template CollateralPolicy
  with
    operator       : Party
    institution    : Party
    policyId       : Text
    ruleType       : RuleType          -- CTD | ExpiryFirst | YieldMax
    priorityList   : [Text]
    minLtv         : Decimal
    maxHaircut     : Decimal
    counterpartyRules : [CounterpartyRule]
    autoApprove    : Bool              -- Reserved for Phase 2
    active         : Bool
  where
    signatory operator, institution
```

**RoutingSuggestion** — Pending recommendation awaiting approval

```daml
template RoutingSuggestion
  with
    institution    : Party
    operator       : Party
    routeId        : Text
    marginCallId   : Text
    options        : [RoutingOption]   -- Ranked asset selections
    selectedOption : Int
    status         : RouteStatus       -- Pending | Approved | Rejected
    createdAt      : Text
  where
    signatory institution
    observer operator
```

**AllocationRecord** — Immutable, tamper-proof audit trail

```daml
template AllocationRecord
  with
    institution    : Party
    operator       : Party
    routeId        : Text
    marginCallId   : Text
    assetsUsed     : [Text]
    amountsUsed    : [Decimal]
    totalAmount    : Decimal
    opportunityCostBps : Decimal
    ruleApplied    : Text
    approvedBy     : Party
    approvedAt     : Text
    status         : RouteStatus
  where
    signatory institution
    observer operator
```

### Onboarding Workflow

```
1. JoinRequest         Institution submits application
2. ServiceAgreement    Operator reviews and accepts
3. CollateralHolding   Institution registers collateral positions
4. CollateralPolicy    Institution configures routing rules
5. MarginCall          Counterparty issues margin call
6. RoutingSuggestion   CTD engine generates recommendation
7. AllocationRecord    Institution approves — audit trail created
```

---

## CTD Engine

The Cheapest-to-Deliver engine is the core optimization algorithm. It selects collateral that minimizes opportunity cost — the yield sacrificed by posting an asset as collateral.

### Algorithm

```
For each eligible asset:
    opportunity_cost = (yield × duration_factor) / LTV

Filter by:
    - Eligibility rules
    - Maximum haircut threshold
    - Counterparty-specific acceptance rules

Sort ascending by opportunity_cost

Select greedily until margin requirement is satisfied
```

### Example: $15M Margin Call

VantageCapital receives a $15M margin call from PrimeBank. Available holdings:

| Asset | Amount | Yield | LTV | Opportunity Cost |
|-------|--------|-------|-----|-----------------|
| USDC | $25.0M | 0.00% | 100% | **$0.00/day** |
| UST | $12.0M | 4.20% | 95% | $51.70/day |
| USYC | $8.2M | 4.50% | 98% | $55.48/day |

**Result:** The engine selects $15.0M USDC — zero opportunity cost. The remaining $20.2M in yield-bearing assets (USYC + UST) continues earning ~$2,300/day.

**Fallback scenario** (insufficient USDC): For a $30M call, the engine exhausts $25M USDC first, then adds $5.26M UST (next cheapest). It does not blindly default to a single asset — it optimizes across the full portfolio.

**Source:** [`packages/api/src/engines/ctd-engine.ts`](packages/api/src/engines/ctd-engine.ts)

---

## API Reference

All API endpoints are served via oRPC at `/api/rpc/*` with end-to-end type safety.

### Collateral Operations

| Endpoint | Type | Description |
|----------|------|-------------|
| `collateral.createPolicy` | Mutation | Create a new CollateralPolicy on Canton |
| `collateral.updatePolicy` | Mutation | Exercise UpdateCollateralPolicy choice |
| `collateral.listPolicies` | Query | List all active policies |
| `collateral.createHolding` | Mutation | Register a new CollateralHolding |
| `collateral.listHoldings` | Query | List all holdings |
| `collateral.generateSuggestion` | Mutation | Run CTD algorithm and create RoutingSuggestion |
| `collateral.approveSuggestion` | Mutation | Approve suggestion (creates AllocationRecord) |
| `collateral.rejectSuggestion` | Mutation | Reject suggestion |
| `collateral.listSuggestions` | Query | List all routing suggestions |
| `collateral.listAllocations` | Query | List all allocation records (audit trail) |

### Authentication

| Endpoint | Type | Description |
|----------|------|-------------|
| `auth.getSession` | Query | Get current authenticated session |
| `me` | Query | Get current user profile |
| `healthCheck` | Query | Service health check |

### Auth Flow

SignUIT uses dual authentication:

1. **Better Auth** (`/api/auth/*`) — User registration, login, session management (SQLite-backed)
2. **Nexus Auth** (`/api/nexus-auth/*`) — Canton ledger session management (JWT tokens, party allocation, encrypted HttpOnly cookies)

Both sessions are established on login and maintained via secure cookies.

---

## Project Structure

```
signuit-app/
├── apps/
│   ├── web/                 # Main web application (TanStack Start)
│   │   ├── src/
│   │   │   ├── routes/      # File-based routing
│   │   │   ├── components/  # UI components
│   │   │   ├── hooks/       # React hooks (Canton API, auth)
│   │   │   └── lib/         # Server config, Canton client, procedures
│   │   └── public/          # Static assets
│   ├── docs/                # Documentation site (Fumadocs)
│   ├── native/              # Mobile application (Expo + React Native)
│   └── extension/           # Browser extension (WXT)
│
├── packages/
│   ├── api/                 # oRPC routers, CTD engine, Zod schemas
│   ├── auth/                # Better Auth configuration
│   ├── db/                  # Drizzle ORM, SQLite schema, seeds
│   ├── env/                 # Type-safe environment variables (t3-env)
│   ├── ui/                  # Shared UI components (59 shadcn/Radix components)
│   └── config/              # Shared TypeScript configuration
│
├── framework/
│   ├── core/                # Nexus Framework — Canton client, auth, sessions
│   ├── react/               # React hooks, TanStack Query integration
│   ├── orpc/                # oRPC middleware layer
│   ├── pqs/                 # Participant Query Store client
│   └── cli/                 # create-nexus-app CLI scaffolder
│
├── sandbox/
│   ├── daml/                # Daml smart contracts
│   │   ├── CollateralRouter.daml
│   │   ├── SeedData.daml
│   │   └── CollateralRouterTest.daml
│   ├── daml.js/             # Generated TypeScript bindings
│   └── docker-compose.yml   # Canton sandbox containerization
│
├── turbo.json               # Turborepo pipeline configuration
├── biome.json               # Linter and formatter configuration
├── pnpm-workspace.yaml      # Workspace definition
└── package.json
```

### Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all applications in development mode |
| `pnpm build` | Build all packages and applications |
| `pnpm check` | Run typecheck + lint across the monorepo |
| `pnpm test` | Run test suites |
| `daml build` | Compile Daml smart contracts |
| `daml start` | Start Canton sandbox |
| `daml codegen js -o ./daml.js .daml/dist/*-0.0.1.dar` | Generate TypeScript bindings |

---

## Roadmap

### Current Release

- [x] Cheapest-to-Deliver optimization engine (3-second recommendations)
- [x] Policy configuration (rule type, priority order, LTV, haircut, counterparty rules)
- [x] Routing recommendation workflow with mandatory human approval
- [x] Immutable audit trail on Canton (AllocationRecord contracts)
- [x] Multi-party role-based dashboards (Institution, Counterparty, Operator)
- [x] Dual authentication (Better Auth + Canton session management)
- [x] Counterparty eligibility filtering
- [x] Opportunity cost analysis with yield preservation
- [x] Real-time contract state synchronization via WebSocket

### Planned

- [ ] Optional auto-execution (`autoApprove = true` in CollateralPolicy)
- [ ] Configurable auto-approve rules (e.g., USDC-only calls under $10M)
- [ ] After-hours / weekend automation for low-risk scenarios
- [ ] Expiry-First and Yield Maximizer rule implementations
- [ ] Cross-border collateral substitution
- [ ] Live oracle price feeds (Chainlink integration)
- [ ] Multi-counterparty simultaneous routing
- [ ] Payment execution integration
- [ ] Advanced analytics and reporting dashboard

### Out of Scope

- Fully autonomous operation (always requires initial policy setup)
- Predictive margin call forecasting
- Collateral borrowing/lending marketplace
- Legacy settlement system integration

---

## Contributing

Contributions are welcome. Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run checks: `pnpm check`
5. Commit with a descriptive message
6. Open a Pull Request

### Development Setup

```bash
pnpm install          # Install all dependencies
pnpm dev              # Start development servers
pnpm check            # Run typecheck + lint
pnpm test             # Run tests
```

### Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Configuration is in `biome.json`. Key rules: tabs for indentation, double quotes, semicolons always, 100-character line width.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

---

<div align="center">
  <br>
  <img src="assets/logo_black.png" alt="SignUIT" width="120">
  <br><br>
  <strong>SignUIT</strong>
  <br>
  <sub>Built by Team SignUIT</sub>
  <br><br>
  <sub>"Daml" and "Canton" are registered trademarks of Digital Asset Holdings, LLC. SignUIT is an independent project and is not affiliated with or endorsed by Digital Asset.</sub>
</div>
