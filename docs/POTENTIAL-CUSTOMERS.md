# SignUIT CollateralRouter — Potential Customers

> **Purpose:** Detailed list of potential customers for SignUIT CollateralRouter, categorized by their relationship to the Canton Network ecosystem.

---

## Category A: Canton Ecosystem Partners

Organizations with existing partnerships, integrations, or pilot programs on Canton Network. These are high-priority targets due to their existing commitment to the ecosystem.

### 1. DTCC (Depository Trust & Clearing Corporation)

| Field | Detail |
|-------|--------|
| **Role** | Settlement & custody infrastructure provider |
| **Canton Connection** | Announced partnership with Digital Asset to tokenize DTC-custodied U.S. Treasury securities on Canton Network (targeted for 2026) |
| **Why SignUIT?** | As DTCC moves treasuries on-chain, they need automated collateral management for repo, securities lending, and margin operations. SignUIT provides the missing routing layer. |
| **Use Case** | On-chain collateral optimization for tokenized Treasury repos |
| **Decision Maker** | Head of Digital Assets, Head of Collateral Management |
| **Entry Point** | Canton Network ecosystem events, Digital Asset introductions |
| **Estimated Deal Size** | $500K-1M/year (enterprise protocol fees) |

### 2. Digital Asset (Canton Network Developer)

| Field | Detail |
|-------|--------|
| **Role** | Canton Network developer and enterprise blockchain solutions provider |
| **Canton Connection** | Built and maintains Canton Network; raised $135M to accelerate growth |
| **Why SignUIT?** | Digital Asset needs ecosystem tooling to attract developers. Nexus Framework (the SDK powering SignUIT) addresses the #1 pain point from their own developer survey: "Typed SDKs & language bindings." |
| **Use Case** | Developer tooling, SDK showcase, ecosystem growth |
| **Decision Maker** | Developer Relations, Ecosystem Team, CTO Office |
| **Entry Point** | Daml Forum contributions, Canton developer webinars, hackathons |
| **Estimated Deal Size** | $200K-500K/year (developer tooling partnership) |

### 3. The Tie / Canton Dashboard

| Field | Detail |
|-------|--------|
| **Role** | Network analytics and data provider for Canton Network |
| **Canton Connection** | Powers the official Canton Network real-time dashboard |
| **Why SignUIT?** | The Tie tracks network growth. SignUIT generates collateral flow data that could feed into their analytics, creating a richer view of network activity. |
| **Use Case** | Data partnership, collateral flow analytics integration |
| **Decision Maker** | Product Team, Data Partnerships |
| **Entry Point** | Canton Network dashboard integration discussions |
| **Estimated Deal Size** | $50K-150K/year (data integration partnership) |

### 4. Global Synchronizer Validators

| Field | Detail |
|-------|--------|
| **Role** | Infrastructure providers maintaining Canton Network's decentralized backbone |
| **Canton Connection** | Run validator nodes for the Global Synchronizer |
| **Why SignUIT?** | Validators earn fees from network activity. SignUIT drives transaction volume (margin calls, allocations, policy updates) which increases validator revenue. |
| **Use Case** | Transaction volume driver, ecosystem application |
| **Decision Maker** | Validator Operations, Business Development |
| **Entry Point** | Global Synchronizer Foundation events |
| **Estimated Deal Size** | Indirect — drives network usage |

### 5. Canton Network Pilot Participants (Institutions)

Based on Canton Network pilot reports and news, the following institution types are actively testing Canton:

| Institution Type | Canton Activity | SignUIT Fit |
|------------------|-----------------|-------------|
| **Major Banks** (e.g., BNP Paribas, Goldman Sachs pilots) | Testing repo, securities lending on Canton | Collateral optimization for on-chain repo |
| **Asset Managers** | Tokenized fund management | Daily margin call automation |
| **Stablecoin Issuers** | 24/7 on-chain financing | Liquidity management, collateral backing |
| **Insurance Companies** | Tokenized insurance products | Collateral for policy backing |

---

## Category B: Independent Financial Institutions

Organizations not yet on Canton but managing significant collateral operations. These represent the broader market expansion opportunity.

### 1. Large Asset Managers (AUM >$10B)

| Field | Detail |
|-------|--------|
| **Profile** | BlackRock, Vanguard, Fidelity, State Street, or regional equivalents |
| **Daily Margin Calls** | 50-100+ |
| **Pain Points** | Excel fatigue, after-hours coordination, manual policy checking |
| **Why SignUIT?** | Automates the 30-minute manual process into 3 seconds. Preserves yield-bearing assets. Creates immutable audit trail for regulators. |
| **Use Case** | Daily collateral optimization across multiple counterparties |
| **Decision Maker** | Head of Treasury, COO, Head of Operations |
| **Entry Point** | Treasury management conferences, SIFMA events, warm introductions |
| **Estimated Deal Size** | $200K-500K/year (institution membership + usage fees) |
| **Pilot Path** | Start with 1-2 counterparties, expand to full portfolio |

### 2. Prime Brokers

| Field | Detail |
|-------|--------|
| **Profile** | Goldman Sachs Prime Services, Morgan Stanley, JPMorgan, or regional prime brokers |
| **Daily Margin Calls** | 100-200+ (across all clients) |
| **Pain Points** | Counterparty-specific eligibility rules, high operational cost, client reporting |
| **Why SignUIT?** | Counterparty-specific rule enforcement is built into the CollateralPolicy template. Each client can define their own rules. |
| **Use Case** | Client collateral management, automated eligibility checking |
| **Decision Maker** | Head of Prime Services, Head of Collateral Management |
| **Entry Point** | Prime brokerage conferences, existing client relationships |
| **Estimated Deal Size** | $300K-800K/year (multi-tenant deployment) |
| **Pilot Path** | White-label deployment for top 3 clients |

### 3. Hedge Funds (High-Frequency / Derivative-Focused)

| Field | Detail |
|-------|--------|
| **Profile** | Citadel, Millennium, Point72, or mid-size systematic funds |
| **Daily Margin Calls** | 30-50+ (highly volatile) |
| **Pain Points** | Speed requirement (seconds matter), regulatory pressure, operational risk |
| **Why SignUIT?** | 3-second computation vs. 30-minute manual process. Human approval provides regulatory comfort while automation handles the math. |
| **Use Case** | Rapid margin call response, yield preservation during volatile periods |
| **Decision Maker** | CFO, Head of Operations, Risk Manager |
| **Entry Point** | HF conferences (G AIM, Context Summits), prime broker referrals |
| **Estimated Deal Size** | $100K-300K/year |
| **Pilot Path** | 30-day trial during high-volatility period |

### 4. Clearinghouses & Central Counterparties (CCPs)

| Field | Detail |
|-------|--------|
| **Profile** | LCH, Eurex Clearing, OCC, or regional CCPs |
| **Daily Margin Calls** | 500+ (system-wide) |
| **Pain Points** | Automated policy compliance, immutable audit for regulators, systemic risk management |
| **Why SignUIT?** | Immutable audit trail on Canton is perfect for regulatory reporting. Policy-based automation ensures compliance. |
| **Use Case** | Member collateral management, default fund optimization |
| **Decision Maker** | Chief Risk Officer, Head of Clearing Operations, Regulatory Affairs |
| **Entry Point** | ISDA conferences, regulatory roundtables, Digital Asset introductions |
| **Estimated Deal Size** | $1M-3M/year (enterprise deployment) |
| **Pilot Path** | Proof of concept for 1 asset class (e.g., interest rate swaps) |

### 5. CBDC Operators & Central Banks

| Field | Detail |
|-------|--------|
| **Profile** | Central banks exploring or deploying CBDCs (e.g., BIS, ECB pilots, Project Helvetia) |
| **Daily Margin Calls** | N/A (different model) |
| **Pain Points** | Cross-border collateral substitution, settlement finality, privacy |
| **Why SignUIT?** | Canton's sub-transaction privacy and atomic settlement are ideal for CBDC collateral management. SignUIT's policy engine can enforce sovereign-level rules. |
| **Use Case** | Cross-border repo, CBDC-backed lending, sovereign collateral optimization |
| **Decision Maker** | CBDC Project Lead, Head of Market Infrastructure |
| **Entry Point** | BIS Innovation Hub, central bank fintech conferences |
| **Estimated Deal Size** | $500K-2M/year (government contract) |
| **Pilot Path** | Sandbox deployment for cross-border repo simulation |

### 6. Tokenized Real-World Asset (RWA) Platforms

| Field | Detail |
|-------|--------|
| **Profile** | Platforms tokenizing real estate, commodities, private equity on blockchain |
| **Daily Margin Calls** | Varies (emerging market) |
| **Pain Points** | Collateral backing for tokenized assets, liquidity management |
| **Why SignUIT?** | As RWAs grow, platforms need automated collateral management to back tokenized assets. SignUIT integrates natively with Canton, the leading institutional RWA chain. |
| **Use Case** | Collateral backing for tokenized securities, automated rebalancing |
| **Decision Maker** | CTO, Head of Product |
| **Entry Point** | RWA conferences, Canton ecosystem events |
| **Estimated Deal Size** | $50K-200K/year |
| **Pilot Path** | Integration with 1 tokenized asset class |

---

## Category C: Developer & Infrastructure Partners

Organizations that could integrate or resell Nexus Framework (the SDK powering SignUIT).

### 1. Enterprise Blockchain Consultancies

| Field | Detail |
|-------|--------|
| **Examples** | Accenture Blockchain, Deloitte Digital, IBM Blockchain Services |
| **Why Nexus?** | These firms build Canton solutions for clients. Nexus Framework reduces development time by 50%+ through type-safe code generation. |
| **Use Case** | SDK licensing, white-label solutions |
| **Estimated Deal Size** | $100K-500K/year (per consultancy partnership) |

### 2. Fintech Infrastructure Providers

| Field | Detail |
|-------|--------|
| **Examples** | Plaid (for tradfi), Fireblocks (custody), Chainlink (oracles) |
| **Why SignUIT?** | Integration opportunities: Fireblocks for custody, Chainlink for price feeds, Plaid for bank connectivity. |
| **Use Case** | API integrations, co-marketing |
| **Estimated Deal Size** | Partnership value (revenue share or co-selling) |

---

## Summary Table: All Potential Customers

| Category | Organization | Priority | Est. Deal Size | Timeline |
|----------|-------------|----------|----------------|----------|
| Canton Partner | DTCC | Critical | $500K-1M/year | Q4 2026 |
| Canton Partner | Digital Asset | High | $200K-500K/year | Q3 2026 |
| Independent | Large Asset Manager | High | $200K-500K/year | Q3 2026 |
| Independent | Prime Broker | High | $300K-800K/year | Q4 2026 |
| Independent | Clearinghouse | High | $1M-3M/year | 2027 |
| Independent | Hedge Fund | Medium | $100K-300K/year | Q4 2026 |
| Independent | CBDC Operator | Medium | $500K-2M/year | 2027 |
| Developer | Enterprise Consultancy | Medium | $100K-500K/year | Q4 2026 |
| Independent | RWA Platform | Medium | $50K-200K/year | Q4 2026 |
| Canton Partner | Canton Validators | Low | Indirect | Ongoing |

---

**Notes**

- Priority is based on deal size, strategic value, and likelihood of closure.
- Canton Partners are prioritized because they already understand the value proposition and have budgets allocated for Canton ecosystem tools.
- Independent institutions require more education but represent a larger total addressable market (TAM).
- All deal sizes are estimates based on comparable fintech infrastructure pricing and should be refined during sales conversations.
