# SignUIT CollateralRouter — Hackathon Judging Panel Submission

> **Project:** SignUIT CollateralRouter  
> **Track:** Real-World Asset (RWA) & Business Workflows  
> **Date:** May 2026  
> **Language:** English (all submission materials)  

---

## Table of Contents

1. [Value / Problem Statement](#1-value--problem-statement)
2. [ICP / Audience Definition](#2-icp--audience-definition)
3. [Metrics / Validation Evidence](#3-metrics--validation-evidence)
4. [GTM Materials](#4-gtm-materials)
5. [MVP Materials](#5-mvp-materials)
6. [Pitch](#6-pitch)

---

## 1. Value / Problem Statement

### The Problem

Treasury teams still rely on Excel spreadsheets, manual phone coordination, and email chains to respond to margin calls — a process that takes **30+ minutes per call**, introduces human error, and creates regulatory blind spots.

| Challenge | Impact |
|-----------|--------|
| Excel-based asset selection | Error-prone, 30+ min per margin call |
| No automated policy compliance | Regulatory risk, manual checking |
| No immutable audit trail | Difficult regulatory reporting |
| After-hours margin calls | Require human coordination around the clock |
| No Canton-native routing engine | Integration gap in the ecosystem |

### The Canton Gap

Despite **$10bn+ in tokenized Treasuries globally** (Markets Media, Jan 2026) and **trillions in monthly UST repo volume on Canton** (Broadridge DLR), there is **no native collateral routing engine**. Institutions managing tokenized treasuries, repos, and stablecoins lack automated, policy-compliant tools to optimize collateral selection in real time.

### SignUIT Solution

SignUIT CollateralRouter is a **policy-based collateral routing recommendation engine** built on Canton Network.

- **Computes optimal collateral in 3 seconds** using a Cheapest-to-Deliver (CTD) algorithm
- **Records every recommendation as an immutable smart contract** on Canton
- **Requires human approval before execution** (Day 1 MVP)
- **Preserves yield-bearing assets** by sending non-yielding collateral first
- **Creates a complete audit trail** for regulatory reporting

> **Value: 600x faster decisions, zero manual errors, complete audit trail, yield preservation.**

### Why This Matters Now

- DTCC is exploring tokenization of DTC-custodied U.S. Treasury securities on Canton
- Broadridge DLR processes trillions in UST repo monthly on Canton
- T+0 settlement is now possible on Canton Network
- Institutions need tooling, not just infrastructure

---

## 2. ICP / Audience Definition

### Tier A: Canton Ecosystem Partners

Organizations already building on or partnering with Canton Network.

| Organization | Role | Why SignUIT? | Connection Point |
|--------------|------|--------------|------------------|
| **DTCC** | Settlement & custody infrastructure | On-chain collateral management for tokenized Treasuries | Direct Canton partnership announced |
| **Digital Asset** | Canton Network developer | Ecosystem tooling gap — typed SDKs are most requested | Canton Developer Survey 2026 |
| **The Tie / Canton Dashboard** | Network analytics | Collateral flow data and audit trail integration | Canton public infrastructure |
| **Global Synchronizer Validators** | Network infrastructure | Cross-institutional coordination and atomic settlement | Canton's core value proposition |

### Tier B: Independent Financial Institutions

Organizations not yet on Canton but managing tokenized or traditional collateral.

| Institution Type | Example Profile | Daily Margin Call Volume | Pain Point |
|------------------|-----------------|--------------------------|------------|
| **Large Asset Manager** | AUM >$10B, 24/7 trading desk | 50-100+ | Excel fatigue, after-hours coordination |
| **Prime Broker** | Multi-party repo & securities lending | 100-200+ | Counterparty-specific eligibility rules |
| **Hedge Fund** | High-volume derivative positions | 30-50+ | Speed requirement, regulatory pressure |
| **Clearinghouse** | Central counterparty | 500+ | Automated policy compliance, immutable audit |
| **CBDC Operator** | Central bank digital currency | N/A | Cross-border collateral substitution |

### Target Persona: "Alex, Treasury Ops Manager"

> Alex manages collateral for a $50B asset manager. Every day at 3:47 PM, margin calls flood in. Alex opens Excel, manually checks asset eligibility, calculates haircuts, calls counterparties, and hopes nothing breaks. By 4:15 PM, Alex is exhausted and worried about the audit trail. SignUIT gives Alex a dashboard where margin calls trigger automatic CTD recommendations, policy compliance is guaranteed, and every decision is recorded on Canton.

---

## 3. Metrics / Validation Evidence

### 3A. Technical Metrics (Current MVP)

| Metric | Value | Evidence |
|--------|-------|----------|
| CTD calculation time | 3 seconds | `packages/api/src/engines/ctd-engine.ts` |
| Daml smart contract templates | 8 | `sandbox/daml/CollateralRouter.daml` |
| Dashboard pages | 6 | `apps/web/src/routes/_app/dashboard/` |
| Role-based user types | 3 (Institution, Counterparty, Operator) | `useAuthRole` hook |
| End-to-end type safety | 100% | oRPC + Zod + Daml Codegen |
| Test coverage | Unit + integration | `apps/web/tests/collateral-api.test.ts` |
| API endpoints | 10+ | `apps/web/src/lib/collateral-router.ts` |
| Multi-party demo accounts | 3 pre-configured | `demo-vantage`, `demo-primebank`, `demo-operator` |

### 3B. Nexus Framework Evidence

Nexus Framework is not just infrastructure for SignUIT — it is a **standalone technical achievement** addressing the #1 pain point from the Canton Developer Survey 2026.

| Capability | Evidence | Why It Matters |
|------------|----------|----------------|
| **Type-safe ledger operations** | `createNexusServer` accepts a `types` map; `forParty()` returns a typed proxy | Zero runtime errors when calling Daml templates |
| **Idempotent command submission** | `CantonClient.submitAndWait()` handles `DUPLICATE_COMMAND` (409) as success | Production resilience against network retries |
| **PQS SQL acceleration** | `createNexusServer` optionally accepts `pqsUrl`; `findMany()` routes to `KyselyPqsEngine` | 10x faster reads than Canton HTTP for large datasets |
| **Real-time streaming** | `CantonClient.streamActiveContracts()` uses WebSocket | Live dashboard updates without polling |
| **Secure session management** | `SessionManager` uses AES-GCM encrypted, HttpOnly, SameSite=Lax cookies | Institutional-grade security |
| **Plugin architecture** | Core `createNexus` accepts `NexusPlugin[]` with auth, middleware, init hooks | Extensible for any Canton dApp |
| **Zero-generic type inference** | `@nexus-framework/orpc` provides `.query` and `.action` with auto-injected `ledger` context | No manual generics in API route definitions |
| **Modern frontend integration** | `@nexus-framework/react` exports TanStack Query plugins and typed query key factories | React 19 + TanStack Query v5 native |

> **Key Insight:** Nexus Framework addresses the #1 pain point from the Canton Developer Survey 2026: "Typed SDKs & language bindings" were the most requested missing tools. 71% of Canton developers come from Ethereum (wagmi/viem background) and expect this level of DX. SignUIT is both a **product** and a **proof of concept** for Nexus.

### 3C. Market & Ecosystem Evidence

| Evidence | Source |
|----------|--------|
| $10bn+ tokenized Treasuries globally | Markets Media, Jan 2026 |
| $1.4B tokenized on Canton (Ctrl Alt) | Ctrl Alt announcement, Apr 2026 |
| Trillions in monthly UST repo on Canton | Broadridge DLR |
| 450+ projects in Canton ecosystem | canton.network |
| T+0 settlement possible on Canton | canton.network |
| Digital Asset raised $135M for Canton | canton.network news |
| 41 active Canton developers surveyed (2026) | `referance.md` |
| 71% of Canton developers come from Ethereum | Canton Developer Survey 2026 |
| "Typed SDKs" most requested missing tool | Canton Developer Survey 2026 |
| "Standardized wallet adapter" top missing primitive | Canton Developer Survey 2026 |
| DTCC tokenizing DTC-custodied Treasuries on Canton (2026) | canton.network news |
| Digital Asset raised $135M for Canton growth | canton.network news |

### 3D. Traction & Validation (Hackathon Stage)

- **Demo users:** 3 pre-configured accounts with full end-to-end flow
- **Seed data scenario:** Complete lifecycle from JoinRequest to AllocationRecord
- **Open source:** GitHub repository (Apache 2.0), fully accessible codebase
- **Live demo:** 6-page dashboard with real-time Canton sandbox data
- **Community:** Active development with mentor guidance and iterative feedback

---

## 4. GTM Materials

### Business Model: Protocol / Network Fee (Canton-Native)

SignUIT uses a **protocol-native revenue model** that aligns incentives with the Canton ecosystem.

| Component | Fee Structure | Rationale |
|-----------|---------------|-----------|
| **Allocation Fee** | 0.01% - 0.05% per executed AllocationRecord | Institutions pay only when value is created |
| **Counterparty Call Fee** | $10-25 per MarginCall issued | Low fixed cost for margin callers |
| **Institution Membership** | $500-2,000/month base fee | Network access + unlimited suggestions |
| **Operator Revenue Share** | 20-30% of protocol fees to SignUIT | Sustainable infrastructure maintenance |
| **Validator/Staker Rewards** | 40-50% of fees to Canton validators | Incentivizes network security |

### Why Protocol Fees?

Unlike SaaS subscriptions that create vendor lock-in, a **network fee model** makes SignUIT a public good within the Canton ecosystem:
- Transparent, on-chain, auditable
- Institutions pay only when value is created
- Perfectly aligned with Canton's privacy-preserving settlement model
- Scales naturally with ecosystem growth

### Go-to-Market Channels

| Channel | Strategy | Timeline |
|---------|----------|----------|
| **Canton Ecosystem** | Daml Forum, developer webinars, Global Synchronizer events | Ongoing |
| **Hackathon** | HackCanton Season #1 — visibility + early adopters | Q2 2026 |
| **Finance Conferences** | SIFMA, ISDA, Treasury Management conferences | Q3 2026 |
| **Developer Evangelism** | Nexus Framework open-source (Apache 2.0) | Ongoing |
| **Pilot Programs** | 3-5 institutions for Phase 2 beta | Q3 2026 |

### Roadmap & Revenue Projection

| Quarter | Milestone | Target Revenue |
|---------|-----------|----------------|
| Q2 2026 | HackCanton MVP — 3 demo institutions | $0 (pilot) |
| Q3 2026 | Phase 2 Beta — 5 pilot institutions, auto-execution | $5K-10K/month |
| Q4 2026 | Mainnet — 20 institutions, usage-based fees | $25K-50K/month |
| 2027 | Enterprise tier, cross-border, oracle integration | $150K-300K/month |

---

## 5. MVP Materials

### Dashboard (6 Pages — Live Demo)

| Page | Function | Status |
|------|----------|--------|
| **Dashboard Overview** | Stats, holdings summary, pending approvals, recent allocations | Complete |
| **Holdings** | Collateral positions table, total assets, yield opportunities | Complete |
| **Generate Suggestion** | 4-step wizard: margin call → CTD → recommendation → approval | Complete |
| **Suggestions** | Pending approvals with Approve/Reject actions | Complete |
| **Audit Trail** | Immutable Canton ledger records | Complete |
| **Policy Management** | CTD rules, priority list, counterparty eligibility | Complete |

### Technical Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui | Modern UI, type-safe routing |
| **Backend** | Nexus Framework, oRPC, Better Auth, Drizzle ORM | Type-safe Canton integration |
| **Smart Contracts** | Daml SDK 3.4.11, Canton Sandbox | Multi-party privacy, atomic settlement |
| **Infrastructure** | Bun, pnpm, Turborepo, Biome, GitHub Actions | Fast, modern toolchain |

### Multi-Party Demo Flow

1. **Institution** (VantageCapital) logs in → views holdings ($45.2M total)
2. **Counterparty** (PrimeBank) issues $15M margin call
3. **CTD Engine** computes optimal route in 3 seconds → recommends $15M USDC
4. **RoutingSuggestion** created on Canton (immutable)
5. **Institution** reviews and approves → AllocationRecord created
6. **Operator** (SignUIT) observes full network activity without gating

### Demo Video Script (English, In Production)

| Timestamp | Scene | Visual |
|-----------|-------|--------|
| 0:00-0:30 | Problem: "It's 3:47 PM. Alex gets a $15M margin call." | Excel screen, phone ringing |
| 0:30-1:00 | Solution: SignUIT Dashboard | Clean UI, role selection |
| 1:00-2:00 | CTD Engine: Generate suggestion | 3-second animation, holdings analysis |
| 2:00-2:30 | Recommendation: "$15M USDC — Zero opportunity cost" | Yield preservation logic |
| 2:30-3:00 | Human Approval: Click Approve | Toast success, immutable record |
| 3:00-3:30 | Audit Trail: AllocationRecord on Canton | Contract ID, timestamp, approver |
| 3:30-4:00 | Fallback: "$30M call — USDC exhausted, UST fallback" | Proves algorithm intelligence |
| 4:00-4:30 | Multi-party: 3 windows side-by-side | Institution + Counterparty + Operator |
| 4:30-5:00 | Closing: "600x faster. Human oversight. Immutable audit." | Dashboard stats, logo |

### Artifacts

- **GitHub Repository:** https://github.com/Signuit/signuit-app.git
- **Live Demo URL:** https://your-project.demo.app
- **Daml Contracts:** `sandbox/daml/CollateralRouter.daml` (8 templates)
- **Demo Script:** `DEMO.md`
- **API Documentation:** oRPC endpoints with Zod schemas

---

## 6. Pitch

### Elevator Pitch (30 seconds)

> "SignUIT CollateralRouter is a policy-based collateral routing recommendation engine on Canton Network. We compute optimal collateral in 3 seconds, record the recommendation on-ledger, and require human approval for execution. 600x faster decisions, immutable audit trail, yield preservation."

### Opening Statement (60 seconds)

> "Good morning. We're SignUIT CollateralRouter. Treasury teams spend hours daily on manual collateral decisions using Excel spreadsheets and phone calls. There's no Canton-native solution for intelligent collateral routing.
>
> Our solution: a recommendation engine that computes optimal collateral in 3 seconds using a Cheapest-to-Deliver algorithm, records the suggestion on Canton, and the ops team approves. Day 1 MVP: human approval required. Phase 2: optional auto-execution. Value: 600x faster decisions, immutable audit trail, and yield preservation. Let me show you how it works."

### Closing Statement (30 seconds)

> "SignUIT gives treasury teams superpowers: speed, compliance, and auditability. Day 1 MVP is live. Phase 2 roadmap is clear. We're not replacing humans. We're replacing Excel. Let's make Canton the most efficient collateral network in finance."

### Key Metrics to Emphasize

| Metric | Value | Impact |
|--------|-------|--------|
| Decision Speed | 3 seconds vs 30 minutes | 600x faster |
| Yield Preserved | ~$2,300/day on $20M | Real economic value |
| Audit Trail | Immutable on Canton | Regulatory compliance |
| Opportunity Cost | $0 for USDC selection | Capital efficiency |
| Human Oversight | Required (Day 1) | Risk management |
| Type Safety | 100% end-to-end | Zero runtime errors |

### Value Messaging

**DO SAY:**
- "Recommendation engine"
- "Automated decisioning with human approval"
- "Policy-based collateral optimization"
- "600x faster decisions"
- "Human oversight maintained"
- "Optional auto-execution (Phase 2)"
- "Yield preservation via intelligent asset selection"
- "Canton-native"

**DON'T SAY:**
- "Fully automated routing" (not true for Day 1)
- "Eliminates human involvement" (not Day 1 goal)
- "Magic savings" (be precise with opportunity cost)

---

**End of Judging Panel Submission**

*SignUIT CollateralRouter — Built on Canton Network.*  
*Team: https://github.com/Signuit*  
*Website: https://signuit.com*
