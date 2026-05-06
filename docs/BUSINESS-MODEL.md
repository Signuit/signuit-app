# SignUIT CollateralRouter — Business Model: Protocol / Network Fee

> **Model:** Protocol / Network Fee (Canton-Native)  
> **Status:** Selected as primary business model for hackathon submission  

---

## Overview

SignUIT CollateralRouter uses a **protocol-native revenue model** that aligns incentives with the Canton Network ecosystem. Instead of traditional SaaS subscriptions that create vendor lock-in, SignUIT operates as a **public good within Canton** — institutions pay only when value is created, fees are transparent and on-chain, and revenue is shared with network validators.

---

## Fee Structure

### 1. Allocation Fee (Primary Revenue)

| Detail | Value |
|--------|-------|
| **Fee** | 0.01% - 0.05% of executed allocation value |
| **Trigger** | When an AllocationRecord is created on Canton (i.e., a routing suggestion is approved and executed) |
| **Payer** | Institution (the party sending collateral) |
| **Example** | $15M allocation × 0.03% = $4,500 fee |
| **Rationale** | Institutions pay only when value is created. The fee is negligible compared to the operational cost savings (30 minutes of trader time ≈ $500-1,000 per call). |

### 2. Counterparty Call Fee

| Detail | Value |
|--------|-------|
| **Fee** | $10 - $25 per MarginCall issued |
| **Trigger** | When a counterparty creates a MarginCall contract on Canton |
| **Payer** | Counterparty (the party requesting collateral) |
| **Example** | PrimeBank issues 50 margin calls/day × $20 = $1,000/day |
| **Rationale** | Low fixed cost encourages counterparties to use the network. Covers infrastructure costs for call processing and notification. |

### 3. Institution Membership Fee

| Detail | Value |
|--------|-------|
| **Fee** | $500 - $2,000/month base fee |
| **Trigger** | Monthly recurring for active institutions |
| **Payer** | Institution |
| **Includes** | Network access, unlimited routing suggestions, policy management, audit trail access |
| **Tiers** | Basic ($500), Professional ($1,200), Enterprise ($2,000+) |
| **Rationale** | Predictable base revenue while keeping marginal costs low. Enterprise tier includes advanced features (auto-execution rules, multi-counterparty, API access). |

### 4. Operator Revenue Share (SignUIT)

| Detail | Value |
|--------|-------|
| **Share** | 20% - 30% of total protocol fees |
| **Purpose** | Infrastructure maintenance, development, support |
| **Example** | Monthly protocol fees = $50,000 → SignUIT receives $12,500 |
| **Rationale** | Sustainable revenue for ongoing development while keeping the majority of fees in the ecosystem. |

### 5. Validator / Staker Rewards

| Detail | Value |
|--------|-------|
| **Share** | 40% - 50% of total protocol fees |
| **Purpose** | Incentivize Canton Network validators to process SignUIT transactions |
| **Distribution** | Proportional to transaction volume processed by each validator |
| **Rationale** | Aligns SignUIT's success with network security. More transactions = more validator rewards = stronger network. |

### 6. Ecosystem Treasury (Remaining 20-30%)

| Detail | Value |
|--------|-------|
| **Share** | 20% - 30% of total protocol fees |
| **Purpose** | Grants for developers, bug bounties, community incentives, protocol upgrades |
| **Governance** | Managed by SignUIT DAO or multi-sig (Phase 3) |
| **Rationale** | Ensures long-term sustainability and community ownership. |

---

## Fee Flow Diagram

```
Institution approves $15M allocation
         |
         v
+-----------------------------+
|  Allocation Fee: 0.03%      |
|  = $4,500                   |
+-----------------------------+
         |
    +----+----+----+----+
    |         |         |
    v         v         v
SignUIT  Validators  Ecosystem
  25%       45%        30%
 $1,125    $2,025     $1,350
```

---

## Why Protocol Fees?

### Advantages

| Advantage | Explanation |
|-----------|-------------|
| **Usage-based** | Institutions pay only when value is created (allocation executed) |
| **Transparent** | All fees are on-chain, auditable, and immutable |
| **Aligned incentives** | Revenue grows with ecosystem adoption, not vendor lock-in |
| **Scalable** | No sales friction for new institutions — just connect and use |
| **Network effects** | More institutions = more transactions = more validator rewards = stronger network |
| **Regulatory comfort** | Fees are visible on-ledger, perfect for compliance reporting |

### Comparison with Alternative Models

| Model | Pros | Cons | Why Not Selected |
|-------|------|------|------------------|
| **SaaS Subscription** | Predictable MRR | Vendor lock-in, high sales friction, misaligned incentives | Creates barriers to adoption |
| **Usage-Based (per call)** | Simple, predictable | Doesn't scale with value created | Less aligned than protocol fees |
| **Enterprise License** | High deal value | Long sales cycles, custom dev | Not suitable for hackathon stage |
| **Protocol Fee (Selected)** | Transparent, scalable, aligned | Requires critical mass for profitability | Best fit for Canton ecosystem |

---

## Revenue Projections

### Conservative Scenario

| Quarter | Institutions | Monthly Allocations | Avg Allocation | Allocation Fee (0.02%) | Membership Fees | Total Monthly |
|---------|-------------|---------------------|----------------|------------------------|-----------------|---------------|
| Q2 2026 | 3 (pilot) | 0 | $0 | $0 | $0 | $0 |
| Q3 2026 | 5 | 100 | $10M | $200,000 | $5,000 | $205,000 |
| Q4 2026 | 20 | 500 | $10M | $1,000,000 | $20,000 | $1,020,000 |
| Q1 2027 | 50 | 1,500 | $12M | $3,600,000 | $50,000 | $3,650,000 |

### Aggressive Scenario

| Quarter | Institutions | Monthly Allocations | Avg Allocation | Allocation Fee (0.03%) | Membership Fees | Total Monthly |
|---------|-------------|---------------------|----------------|------------------------|-----------------|---------------|
| Q2 2026 | 3 (pilot) | 0 | $0 | $0 | $0 | $0 |
| Q3 2026 | 10 | 300 | $15M | $1,350,000 | $12,000 | $1,362,000 |
| Q4 2026 | 50 | 2,000 | $15M | $9,000,000 | $60,000 | $9,060,000 |
| Q1 2027 | 150 | 8,000 | $20M | $48,000,000 | $180,000 | $48,180,000 |

### SignUIT Revenue Share (25% of protocol fees)

| Scenario | Q3 2026 | Q4 2026 | Q1 2027 |
|----------|---------|---------|---------|
| Conservative | $51K/month | $255K/month | $912K/month |
| Aggressive | $340K/month | $2.26M/month | $12M/month |

---

## Pricing Tiers

### Institution Membership Tiers

| Tier | Monthly Fee | Included | Additional Fees |
|------|-------------|----------|-----------------|
| **Basic** | $500 | 50 suggestions/month, 1 policy, email support | $15 per extra suggestion |
| **Professional** | $1,200 | 200 suggestions/month, 5 policies, priority support, API access | $10 per extra suggestion |
| **Enterprise** | $2,000+ | Unlimited suggestions, unlimited policies, SLA, dedicated support, custom integration | Custom pricing |

### Counterparty Tiers

| Tier | Monthly Fee | Included | Additional Fees |
|------|-------------|----------|-----------------|
| **Standard** | $0 | 50 margin calls/month | $20 per extra call |
| **Premium** | $500 | 500 margin calls/month, analytics dashboard | $15 per extra call |

---

## Go-to-Market Strategy

### Phase 1: Ecosystem First (Q2-Q3 2026)

1. **HackCanton Season #1** — Visibility, early adopters, feedback
2. **Daml Forum & Canton Developer Community** — Nexus Framework open-source release
3. **Digital Asset Partnership** — Co-marketing, developer tooling showcase
4. **Pilot Programs** — 3-5 institutions, zero fees for 90 days

### Phase 2: Market Expansion (Q4 2026)

1. **Prime Broker Outreach** — Target top 10 prime brokers
2. **Asset Manager Conferences** — SIFMA, treasury management events
3. **Integration Partnerships** — Fireblocks, Chainlink, Plaid
4. **Case Studies** — Publish pilot results (anonymized)

### Phase 3: Scale (2027+)

1. **Enterprise Sales** — Clearinghouses, CBDC operators
2. **Geographic Expansion** — EU (MiCA compliance), APAC
3. **Protocol Upgrades** — DAO governance, community treasury
4. **Cross-Chain** — Explore other privacy-preserving L1s

---

## Key Assumptions

| Assumption | Basis |
|------------|-------|
| Average allocation size | $10-20M (based on prime brokerage industry norms) |
| Allocation fee rate | 0.01%-0.05% (competitive with tradfi collateral management fees) |
| Institution growth | 5→20→50→150 (based on Canton ecosystem growth rate) |
| Churn rate | <5% annually (high switching costs once integrated) |
| Sales cycle | 3-6 months for institutions, 1-2 months for counterparties |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Low adoption if Canton ecosystem grows slowly | Focus on Nexus Framework as standalone developer tooling |
| Competitors entering the space | First-mover advantage, open-source community, deep Canton integration |
| Regulatory uncertainty | Immutable audit trail is regulatory-friendly; compliance-first design |
| Validator fee disputes | Transparent on-chain fee distribution; DAO governance (Phase 3) |

---

**End of Business Model Document**

*SignUIT CollateralRouter — Protocol-Native Revenue on Canton Network.*
