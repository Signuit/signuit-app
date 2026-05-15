# How We Built SignUIT in 3 Weeks with Nexus Framework

**An institutional collateral routing application on Canton Network — type-safe, real-time, production-ready.**

---

Can you build an institutional financial application in 3 weeks?

We did.

We are a small team that built a **collateral routing engine** on Canton Network. Multi-million dollar collateral movements between institutions are computed in seconds and recorded immutably on-ledger.

This is the technical story of that journey — why we made these decisions, what we got wrong, and the single thing that accelerated everything.

---

## The Problem: Two Layers of Pain

### Layer 1: Collateral Management Is Still Running on Excel

70% of financial institutions still rely on manual processes for collateral management.

When a margin call arrives:
- A trader opens Excel
- Manually calculates which assets to send and how much
- Runs a compliance check
- Makes phone calls to the counterparty

**Total time: 30+ minutes.**

Think about that. Institutions receive dozens of margin calls per day. That's dozens of hours of wasted human capacity — every single day.

### Layer 2: Building on Canton Was Hard

We wanted to build SignUIT on [Canton Network](https://www.canton.network/). Why? Because Canton gives us two things simultaneously:

- **Privacy**: Collateral positions are only shared with relevant counterparties, not broadcast to the entire network
- **Audit trail**: Every decision is recorded as an immutable smart contract

But building on Canton was its own challenge.

Manually constructing raw API payloads. Writing JWT token generation from scratch. Managing WebSocket connections. Zero documentation for server-side rendering. Type safety? None.

By the end of the first week, we realized something: we weren't writing the product — we were writing infrastructure. **That's where Nexus Framework was born.**

---

## The Solution: Nexus Framework

We wrote the missing middleware for the Canton ecosystem — while building SignUIT, simultaneously.

Think of Nexus as:
- **Prisma** — but for Daml smart contracts
- **tRPC** — but for Canton ledger operations
- **wagmi/viem** — but for Canton dApp developers

One framework. Three layers.

---

## Architecture Overview

```
React Frontend (SignUIT)
    │
    ├── @nexus-framework/react
    │   ├── useContracts() — type-safe queries
    │   ├── useExerciseChoice() — optimistic mutations
    │   └── streamingPlugin — real-time updates
    │
    ├── @nexus-framework/orpc
    │   ├── Automatic ledger context injection
    │   ├── RBAC middleware
    │   └── Canton error mapping
    │
    └── @nexus-framework/core
        ├── Canton HTTP client
        ├── PQS SQL engine (10x faster reads)
        └── Session management (AES-GCM encrypted cookies)
            │
            ▼
    Canton Network
    └── Daml Smart Contracts
```

---

## Old World vs Nexus: The Concrete Difference

Let's walk through a real example. You want to query the collateral holdings an institution owns in SignUIT.

### Before (raw Canton API):

```typescript
// Manually fetch a token
const token = await fetch('/v2/auth/token', {
  method: 'POST',
  body: JSON.stringify({ userId: '...' })
}).then(r => r.json());

// Manually write the template ID (typos are silent runtime failures)
const response = await fetch('/v2/state/active-contracts', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token.access_token}` },
  body: JSON.stringify({
    filter: {
      filtersByParty: {
        [partyId]: {
          filters: [{
            templateId: 'a1b2c3d4:CollateralRouter:CollateralHolding'
          }]
        }
      }
    }
  })
});

// Manually handle pagination
let contracts = [];
let pageToken = null;
do {
  // ...same fetch, each time with the nextPageToken...
} while (pageToken);

// No type safety. This can blow up at runtime.
const holdings = (await response.json()).activeContracts;
```

**~50 lines. No type safety. Manual pagination. No error handling.**

### With Nexus:

```typescript
const holdings = await nexus.CollateralHolding.findMany({
  where: { active: true },
  limit: 100
});
// ✅ Full TypeScript intellisense
// ✅ Pagination handled automatically
// ✅ Error handling built in
```

**3 lines. Full type safety. Done.**

---

## How We Built SignUIT

### 1. From Daml to TypeScript: Type Generation

This is the part most write-ups skip — but it's where we saved the most time.

Daml is the language used to define smart contracts on Canton. A contract looks like this:

```haskell
-- CollateralRouter.daml
template CollateralHolding
  with
    institution  : Party
    operator     : Party
    assetSymbol  : Text      -- "USDC", "USYC", "UST"
    amount       : Decimal
    yield        : Decimal   -- 0.045 = 4.5%
    haircut      : Decimal   -- 0.02 = 2%
  where
    signatory institution
    observer operator

    choice UpdateYield : ContractId CollateralHolding
      with newYield : Decimal
      controller operator
      do create this with yield = newYield
```

From this Daml file, TypeScript types are generated automatically via `daml codegen ts`:

```bash
daml codegen ts .daml/dist/nexus-example-0.0.1.dar -o daml.js/nexus-example-0.0.1
```

The output: a TypeScript module for every contract — containing the payload type, decoder, encoder, and choice definitions. All we had to do was register these with Nexus **once**:

```typescript
// apps/web/src/lib/nexus-types.ts
import * as DamlPackage from "@daml.js/nexus-example-0.0.1";

const { CollateralRouter } = DamlPackage;

export const nexusTypes = {
  // Onboarding
  JoinRequest:        CollateralRouter.JoinRequest,
  ServiceAgreement:   CollateralRouter.ServiceAgreement,

  // Policy & Holdings
  CollateralPolicy:   CollateralRouter.CollateralPolicy,
  CollateralHolding:  CollateralRouter.CollateralHolding,

  // Routing Flow
  MarginCall:         CollateralRouter.MarginCall,
  RoutingSuggestion:  CollateralRouter.RoutingSuggestion,
  AllocationRecord:   CollateralRouter.AllocationRecord,
} as const;
```

This single file propagates type safety across the entire application automatically. From here:

- `nexus.CollateralHolding.findMany()` → payload type `{ institution, assetSymbol, amount, yield, haircut }` is fully known
- `nexus.RoutingSuggestion.exercise("ApproveSuggestion", contractId, { approvedBy })` → choice arguments are checked at compile time
- If a field name changes in the Daml contract → TypeScript throws a compilation error, not a runtime crash

**Writing a wrong template ID is no longer possible. Writing a wrong payload field name is no longer possible. You have to actively work to make a mistake.**

---

### 2. Contract Design

The core principle behind every design decision was: **the institution owns everything — we (the operator) are purely infrastructure.** Six core contracts:

| Contract | Created by | Purpose |
|----------|-----------|---------|
| `CollateralHolding` | Institution | Assets the institution owns |
| `CollateralPolicy` | Institution | Rules for which asset to use when |
| `MarginCall` | Counterparty | Collateral demand |
| `RoutingSuggestion` | System | Computed routing recommendation |
| `AllocationRecord` | Institution | Approved and executed decision |
| `ServiceAgreement` | Institution + Operator | Network membership |

The moment all of these were registered in `nexusTypes`, they became available everywhere in the application with full type guarantees.

### 3. The Hard Part of Contract Design: Who Sees What

In Daml, everything comes down to one question: who is the signatory, and who is the observer? Answer it wrong and you've built the wrong trust model — and this mistake doesn't surface in production, it has to be caught at design time.

This is where we spent the most time.

**The problem:** When a `RoutingSuggestion` contract is created:
- The institution needs to see it (they will approve it)
- The operator needs to see it (to display it on the dashboard)
- The counterparty *optionally* needs to see it (because not every scenario involves a counterparty)

In Daml, we solved this as follows:

```haskell
template RoutingSuggestion
  with
    institution  : Party
    operator     : Party
    counterparty : Optional Party   -- not always present
    ...
    status       : RouteStatus
  where
    signatory institution            -- the institution creates the contract
    observer  operator,
              optional [] (\x -> [x]) counterparty  -- counterparty sees it only if present

    -- Approval authority belongs solely to the institution
    choice ApproveSuggestion : ContractId AllocationRecord
      with approvedBy : Party
      controller institution
      do
        create AllocationRecord with
          assetsSent         = suggestedAssets
          amountsSent        = suggestedAmounts
          opportunityCostBps = (estimatedOpportunityCost / amountRequired) * 10000.0
          approvedBy         = approvedBy
          executedAt         = now
          status             = RouteExecuted
```

When the `ApproveSuggestion` choice executes, two things happen atomically:
1. The `RoutingSuggestion` contract is **archived** — it can never be modified again
2. A new `AllocationRecord` is created in its place — the immutable record of what was approved, by whom, and when

This atomic transformation is a guarantee provided by Canton. Nexus surfaces this choice like so:

```typescript
// When the ops team clicks "Approve":
const result = await nexus.RoutingSuggestion.exercise(
  "ApproveSuggestion",
  suggestion.contractId,
  { approvedBy: partyId }
);
// result.contractId → the ID of the newly created AllocationRecord
// Type system: wrong choice name or payload shape → compilation error
```

**The operator cannot trigger this choice.** `controller institution` is not an `if` statement in application code — it is enforced at the ledger level and will be rejected before it ever reaches our backend.

This design gave us a system that is secure by default. And because Nexus's type generation carries these choice definitions into TypeScript, the frontend cannot even *attempt* to call a choice that doesn't exist.

### 4. Multi-Party Auth

Canton's real power shows up in multi-party workflows. SignUIT has three distinct parties:

- **VantageCapital** (Institution) — the party that owns the collateral
- **PrimeBank** (Counterparty) — the party issuing margin calls
- **SignUIT** (Operator) — network infrastructure, not a decision-maker

Each party has a different dashboard. Each sees different contracts. Nexus's session management resolves this with a single config line:

```typescript
// Every HTTP request automatically gets the correct party's ledger context
const ctx = await nexus.forRequest(req);
// ctx.CollateralHolding → only this institution's assets are visible
```

### 5. Real-Time Dashboard

We wanted the dashboard to update the moment a margin call arrived. No polling, no page refresh.

```typescript
// On VantageCapital's dashboard:
const { contracts: marginCalls, isLive } = nexus.MarginCall.useStreamContracts({
  parties: [partyId]
});

// The moment PrimeBank creates a new margin call,
// VantageCapital's screen updates automatically.
```

WebSocket lifecycle, token refresh on reconnect, connection drop handling, cleanup on unmount — all managed by Nexus.

---

## Sandbox-First Developer Experience

Setting up a Canton development environment traditionally took hours.

With Nexus:

```bash
docker-compose up  # Canton sandbox is running
bun dev            # Application is running
```

On the first request, Nexus automatically:
1. Allocates a Canton party
2. Creates a ledger user account
3. Generates a signed JWT token
4. Writes an encrypted, HttpOnly session cookie

A fully working development environment without writing a single line of provisioning code.

---

## Why 3 Weeks Was Enough

To be direct: finishing in this timeframe would not have been possible without Nexus. We were writing Nexus and SignUIT at the same time — both took shape in parallel.

Without Nexus, we would have spent the majority of our time on:

| Problem | Traditional approach | With Nexus |
|---------|---------------------|------------|
| JWT generation and refresh | ~3 days | One config line |
| ACS pagination | ~1 day | Automatic |
| WebSocket management | ~2 days | `useStreamContracts()` |
| SSR hydration | ~2 days | `prefetchNexusQuery()` |
| Cache invalidation | ~1 day | Automatic by template ID |
| Multi-user auth | ~3 days | `sandboxAuth()` plugin |
| Error handling (409, 425) | ~1 day | Built-in retry logic |

**~13 days saved. That's why 3 weeks was enough.**

---

## What We Learned

**1. The Canton "integration tax" is real**

Working directly with Canton's APIs means rewriting the same infrastructure boilerplate on every project. We felt this on day one. It's slowing the ecosystem down.

**2. Type safety isn't just comfort — it's speed**

Once we connected Daml codegen output to TypeScript, we started catching contract payload errors at compile time instead of runtime. This saved us significant debugging time on every iteration.

**3. Sandbox DX determines production quality**

The easier the development environment is to set up, the more iterations you ship. Nexus's auto-provisioning meant every member of our team could be working in a production-like environment within minutes of cloning the repo.

**4. "Operator as infrastructure, not gatekeeper"**

Getting the multi-party model right was critical. We are not an intermediary. Institutions own their decisions. We compute the recommendation and record the outcome — nothing more. Encoding this in the Daml contract design, not in application-layer business logic, is what makes it trustworthy.

---

## Conclusion

SignUIT compresses institutional collateral decisioning from 30 minutes to seconds. Every decision is recorded as an immutable Canton contract that cannot be altered or deleted.

We built this in 3 weeks — because we built Nexus first.

**Nexus was the missing layer in the Canton ecosystem. We're releasing it as open source because we don't want the next team to spend the time we spent.**

If you're building on Canton, take a look:

- Documentation: [docs.signuit.com](https://docs.signuit.com)
- SignUIT: [signuit.com](https://signuit.com)

---

*SignUIT CollateralRouter was built at HackCanton Season #1.*  
*Nexus Framework — Apache-2.0 licensed, open source for the Canton ecosystem.*
