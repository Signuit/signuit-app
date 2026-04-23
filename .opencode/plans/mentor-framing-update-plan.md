# Mentor Framing Update - Implementation Plan

**Date:** April 23, 2026  
**Goal:** Update SignUIT app messaging to align with mentor's guidance  
**Core Message:** "Recommendation engine with human approval (Day 1), optional auto-execution (Phase 2)"

---

## 📋 Executive Summary

### What We're Changing:
- ❌ Remove: "automate collateral routing" (implies full automation)
- ✅ Add: "recommendation engine" + "human approval required"
- ✅ Add: Explicit Day 1 vs Phase 2 distinction throughout docs
- ✅ Reorder: Speed first, control second (demo messaging)

### Files to Update:
1. **`/README.md`** (7 sections) - **HIGH PRIORITY**
2. **`/sandbox/daml/CollateralRouter.daml`** (comments only) - LOW PRIORITY
3. **`/apps/web/src/lib/collateral-router.ts`** (comments only) - LOW PRIORITY
4. **NEW: `/docs/JURY-PRESENTATION.md`** (create new) - **HIGH PRIORITY**

---

## 🎯 Mentor's Core Guidance (Reference)

> **"Signuit is a policy-based collateral routing recommendation engine. It computes the best eligible collateral on Canton in seconds, records the suggestion on-ledger, and requires human approval for Day 1 execution. Phase 2 enables optional auto-execution."**

**Key Principles:**
1. Don't overclaim automation
2. "Automated decisioning" ✅ NOT "automated routing" ❌
3. Speed first, control second (demo positioning)
4. Explicit Day 1 / Phase 2 split

---

## 📄 FILE 1: `/README.md` (7 Major Changes)

### Change 1.1: Hero Section (Lines 1-5)

**PRIORITY:** 🔴 **HIGH**

**BEFORE:**
```markdown
# SignUIT CollateralRouter

**"Your collateral, always where it needs to be."**

A collateral operating system built on Canton Network that allows institutions to define their collateral policies once and automate eligible collateral routing with an immutable audit trail.
```

**AFTER:**
```markdown
# SignUIT CollateralRouter

**"Your collateral, always where it needs to be."**

A **policy-based collateral routing recommendation engine** built on Canton Network. 

SignUIT computes the optimal eligible collateral in seconds, records recommendations 
on-ledger, and requires human approval for execution (Day 1 MVP). Phase 2 enables 
optional auto-execution with full audit trail.
```

**Reason:** Mentor's exact framing - "recommendation engine" not "operating system"

---

### Change 1.2: Add "At a Glance" Section (NEW - After Line 7)

**PRIORITY:** 🔴 **HIGH**

**INSERT AFTER LINE 7:**
```markdown
---

## At a Glance

**Day 1 MVP:**
- 🧠 **Automated decisioning** — CTD algorithm evaluates holdings in 3 seconds
- 🛡️ **Human approval required** — Ops team reviews before execution
- 📜 **Immutable audit trail** — Every decision recorded on Canton
- 🔒 **Privacy-preserving** — Canton's sub-transaction privacy model

**Phase 2 Roadmap:**
- 🚀 **Optional auto-execution** — Enable with `autoApprove = true`
- 🌙 **Weekend/after-hours automation** — No human intervention needed
- 📊 **Advanced analytics** — AI-powered optimization

---
```

**Reason:** Immediately clarify Day 1 vs Phase 2 (mentor emphasized this)

---

### Change 1.3: Core Concept Table (Lines 40-52)

**PRIORITY:** 🔴 **HIGH**

**BEFORE:**
```markdown
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
```

**AFTER:**
```markdown
### Core Concept

**Day 1 MVP: Recommendation Engine with Human Approval**

```
Traditional (Manual):                  SignUIT CollateralRouter (Day 1):

Margin call received               →   Smart contract trigger fires
Treasury team opens Excel (30min)  →   CTD engine computes optimal (3 sec) ⚡
Manual asset selection             →   Recommendation recorded on Canton 📜
Compliance checking (manual)       →   Policy evaluation (automatic) ✓
Human approval required            →   Human reviews and approves 🛡️
Phone call / email confirmation    →   Settlement triggered after approval
T+1 or T+2 settlement              →   On-ledger execution

                                       Phase 2 (Roadmap):
                                   →   Optional auto-execution (autoApprove=true)
                                   →   Weekend/after-hours automation
```
```

**Reason:** 
- Show speed advantage (⚡ icons for emphasis)
- Explicit "Day 1" label
- Separate Phase 2 as future roadmap

---

### Change 1.4: Transaction Lifecycle (Lines 62-73)

**PRIORITY:** 🔴 **HIGH**

**BEFORE:**
```markdown
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
```

**AFTER:**
```markdown
### Transaction Lifecycle

**Day 1 MVP Flow:**

```
1. Trigger fires (margin call / schedule / manual)
2. Rule engine reads current policy from Canton
3. Holdings queried from Canton ledger
4. CTD algorithm computes optimal collateral (3 seconds) ⚡
5. **RoutingSuggestion** created on Canton (recommendation recorded)
6. 🚨 **HUMAN REVIEWS AND APPROVES** (or rejects) 🛡️
7. **AllocationRecord** created (immutable audit trail)
8. Opportunity cost analysis logged on-chain

**Phase 2 Enhancement:**
Step 6 becomes optional when `autoApprove = true` in CollateralPolicy
```
```

**Reason:**
- Visual emphasis on human approval step (🚨 🛡️)
- Explicit "Day 1 MVP" vs "Phase 2" labels
- Shows autoApprove as future feature

---

### Change 1.5: Demo Walkthrough Value Order (Lines 180-184)

**PRIORITY:** 🟡 **MEDIUM**

**BEFORE:**
```markdown
  Value delivered:
    • Decision time: 3 seconds (vs 30-minute manual process)
    • Policy compliance: automatic eligibility checking
    • Audit trail: immutable record on Canton
    • Capital efficiency: yield-bearing assets preserved
```

**AFTER:**
```markdown
  Value delivered:
    • ⚡ Decision speed: 3 seconds vs 30-minute manual (600x faster)
    • 🛡️ Human oversight: Ops team reviews before execution (risk management)
    • ✓ Policy compliance: Automatic eligibility checking (regulatory comfort)
    • 📜 Audit trail: Immutable record on Canton (cannot be altered)
    • 💰 Capital efficiency: Yield-bearing assets preserved (~$2,300/day)
```

**Reason:** 
- Mentor: "Speed first, control second"
- Reordered with icons for visual hierarchy
- Added parenthetical benefits

---

### Change 1.6: MVP Scope Section (Lines 308-327)

**PRIORITY:** 🔴 **HIGH**

**BEFORE:**
```markdown
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
```

**AFTER:**
```markdown
## MVP Scope (HackCanton)

### ✅ Day 1 MVP (Included)

**Core Functionality:**
- [x] Policy configuration (priority order, LTV, haircut, counterparty rules)
- [x] CTD calculation engine (3-second recommendations)
- [x] **Routing recommendation workflow with human approval**
- [x] Approval/rejection UI (ops team reviews suggestions)
- [x] Immutable audit trail dashboard
- [x] Canton testnet deployment
- [x] `autoApprove: Bool` field in Daml (prepared for Phase 2)

**Technical Stack:**
- [x] Daml smart contracts on Canton
- [x] Nexus Framework (type-safe ledger integration)
- [x] TanStack Router + React 19
- [x] Counterparty eligibility filtering
- [x] Opportunity cost calculation (yield preservation)

### 🚀 Phase 2 Roadmap (Not in MVP)

**Automation Enhancements:**
- [ ] **Optional auto-execution** (autoApprove = true)
- [ ] Weekend/after-hours automation without human oversight
- [ ] Configurable auto-approve rules (e.g., "auto-approve if USDC-only")

**Advanced Features:**
- [ ] Yield Maximizer rules
- [ ] Expiry-First optimization
- [ ] Cross-border collateral substitution
- [ ] Live Chainlink oracle feeds
- [ ] Multi-counterparty routing
- [ ] Real payment execution integration

### 🚫 Explicitly Out of Scope

- [ ] Fully autonomous operation (always requires policy setup)
- [ ] Predictive margin call forecasting
- [ ] Collateral borrowing/lending marketplace
- [ ] Integration with legacy settlement systems
```

**Reason:**
- Very clear Day 1 / Phase 2 separation (mentor emphasized)
- Shows autoApprove field exists (prepared for future)
- Removes ambiguity about what MVP includes

---

### Change 1.7: Business Context Section (Lines 329-342)

**PRIORITY:** 🟡 **MEDIUM**

**BEFORE:**
```markdown
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
```

**AFTER:**
```markdown
## Business Context

**SignUIT CollateralRouter** is being developed for HackCanton Season #1.

### Problem Statement

**Current State:** 
- 70% of firms report collateral delivery challenges
- Manual decisioning takes 30+ minutes per margin call
- Operational costs represent majority of trade cost  
- No Canton-native collateral routing engine exists today

**Pain Points:**
- Excel-based asset selection prone to errors
- No automated policy compliance checking
- Lack of immutable audit trail for regulatory reporting
- After-hours margin calls require human coordination

### Solution Architecture

**Day 1 MVP: Recommendation Engine**
- **Automated decisioning:** CTD algorithm computes optimal collateral (3 seconds)
- **Human approval required:** Ops team reviews before execution (regulatory comfort)
- **Immutable audit trail:** Every decision recorded on Canton (compliance-ready)
- **Privacy-preserving:** Sub-transaction privacy via Canton Network

**Value Proposition (Day 1):**
- 600x faster decision speed (3 sec vs 30 min)
- Zero errors in policy compliance checking
- Complete audit trail for regulators
- Yield preservation via intelligent asset selection

**Phase 2 Roadmap: Optional Automation**
- **Opt-in auto-execution:** Institutions enable `autoApprove = true` when comfortable
- **Selective automation:** e.g., "auto-approve USDC-only calls under $10M"
- **Weekend/after-hours:** No human intervention for low-risk scenarios
- **Full audit trail maintained:** Regardless of automation mode

### Business Model

**Pricing:**
- Usage-based: Fee per routing recommendation generated
- Enterprise tier: Auto-execution + advanced analytics
- Volume discounts for high-frequency users

**Target Customers:**
- Large asset managers with daily margin calls
- Prime brokers managing multi-counterparty relationships
- Clearinghouses coordinating cross-institutional settlements

**Go-to-Market:**
- Launch: HackCanton demo (manual approval MVP)
- Q3 2026: Phase 2 auto-execution beta
- Q4 2026: General availability on Canton mainnet
```

**Reason:**
- Much clearer problem → solution → roadmap structure
- Explicit "automated decisioning" vs "automated execution" distinction
- Shows business thinking (GTM, pricing, target customers)

---

## 📄 FILE 2: `/sandbox/daml/CollateralRouter.daml` (Comment Updates)

### Change 2.1: CollateralPolicy autoApprove Comment (Line 90)

**PRIORITY:** 🟢 **LOW** (informational only)

**BEFORE:**
```daml
    autoApprove       : Bool         -- Enable auto-approval
```

**AFTER:**
```daml
    autoApprove       : Bool         -- Enable auto-approval (Phase 2 feature, False for Day 1 MVP)
```

**Reason:** Clarify this is a future feature

---

### Change 2.2: RoutingSuggestion Template Comment (Line 134)

**PRIORITY:** 🟢 **LOW**

**BEFORE:**
```daml
-- ─────────────────────────────────────────────────────────────────────────────
-- RoutingSuggestion - Pending routing recommendation
-- ─────────────────────────────────────────────────────────────────────────────
```

**AFTER:**
```daml
-- ─────────────────────────────────────────────────────────────────────────────
-- RoutingSuggestion - Pending routing recommendation (requires human approval)
-- ─────────────────────────────────────────────────────────────────────────────

-- Day 1 MVP: This contract represents a RECOMMENDATION that must be approved
-- by a human before execution. The ops team reviews and exercises either
-- ApproveSuggestion or RejectSuggestion choice.
--
-- Phase 2: When autoApprove=True in policy, this step can be automatic.
```

**Reason:** Code comments should reflect Day 1 reality

---

## 📄 FILE 3: `/apps/web/src/lib/collateral-router.ts` (Comment Updates)

### Change 3.1: generateSuggestion Handler Comment (Line 86)

**PRIORITY:** 🟢 **LOW**

**BEFORE:**
```typescript
	/**
	 * Generate CTD routing suggestion.
	 * Calls off-chain CTD engine and persists result on-chain.
	 */
```

**AFTER:**
```typescript
	/**
	 * Generate CTD routing recommendation.
	 * 
	 * Day 1 MVP: Creates a RoutingSuggestion that requires human approval.
	 * The ops team must review and click "Approve" before execution.
	 * 
	 * Flow:
	 * 1. Fetch policy and holdings from Canton
	 * 2. Run off-chain CTD algorithm (3-second calculation)
	 * 3. Create RoutingSuggestion contract on Canton (recommendation)
	 * 4. Wait for human to approve/reject
	 * 
	 * Phase 2: When policy.autoApprove = true, approval can be automatic.
	 */
```

**Reason:** Developer reading code should understand human approval is required

---

## 📄 FILE 4: `/docs/JURY-PRESENTATION.md` (NEW FILE - CREATE)

**PRIORITY:** 🔴 **HIGH**

**CREATE NEW FILE:** `/docs/JURY-PRESENTATION.md`

**CONTENT:**
```markdown
# SignUIT CollateralRouter - Jury Presentation Guide

**HackCanton Season #1**  
**Date:** April 2026  
**Team:** [Your Team Name]

---

## 🎯 Core Value Proposition (30 seconds)

> **"SignUIT is a policy-based collateral routing recommendation engine built on Canton Network.**
>
> **We compute the optimal collateral in 3 seconds, record the recommendation on-ledger, and the ops team reviews and approves.**
>
> **Phase 2 enables optional auto-execution.**
>
> **Value: 600x faster decisioning + human oversight + immutable audit trail."**

---

## 🎤 Opening Statement (60 seconds)

"Good [morning/afternoon]. We're SignUIT CollateralRouter.

**The Problem:** 70% of financial institutions report collateral delivery challenges. Manual decisioning takes 30+ minutes per margin call, using Excel spreadsheets and phone calls. There's no Canton-native solution for intelligent collateral routing.

**Our Solution:** We're a recommendation engine that computes the optimal collateral in 3 seconds using a Cheapest-to-Deliver algorithm, records the suggestion on Canton, and the ops team approves. 

**Day 1 MVP:** Human approval required for execution.  
**Phase 2 Roadmap:** Optional auto-execution when institutions are comfortable.

**Value:** 600x faster decisions, immutable audit trail, and yield preservation.

Let me show you how it works."

---

## 🎬 Demo Script (3-4 minutes)

### Setup (15 seconds)
"We have VantageCapital with three collateral holdings:
- $25M USDC (0% yield)
- $12M UST (4.2% yield)
- $8.2M USYC (4.5% yield)

Their policy: Use Cheapest-to-Deliver rule, preserve yield where possible."

### Trigger (15 seconds)
"A $15M margin call arrives from PrimeBank. Deadline: 13 minutes.

In the traditional world, the treasury team would:
- Open Excel
- Manually calculate which assets to use
- Check compliance
- Make phone calls
- **Total time: 30+ minutes**"

### SignUIT In Action (90 seconds)

**Step 1: Instant Calculation (emphasize SPEED)**
"SignUIT's CTD engine analyzes all holdings in **3 seconds**.

It calculates opportunity cost for each asset:
- USDC: $0/day (no yield to lose)
- UST: $52/day
- USYC: $55/day

The system recommends: **$15M USDC** ✓"

**Step 2: On-Ledger Recommendation**
"The recommendation is immediately recorded as a RoutingSuggestion contract on Canton.

This creates an immutable record:
- What was recommended
- Why it was chosen
- Who needs to approve
- When it was created"

**Step 3: Human Review (emphasize CONTROL)**
"Now the ops team reviews the suggestion.

They see:
- ✓ USDC has zero opportunity cost
- ✓ Preserves $20.2M of yield-bearing assets
- ✓ Those assets continue earning ~$2,300/day
- ✓ Policy compliance: automatic

The ops team clicks **'Approve'** ✓"

**Step 4: Execution & Audit Trail**
"Once approved, an AllocationRecord is created on Canton.

This immutable record shows:
- Which assets were sent
- Who approved it
- Opportunity cost incurred
- Timestamp

Cannot be altered. Cannot be deleted. Perfect for regulators."

### Fallback Intelligence (30 seconds)
"What if USDC wasn't enough?

For a $30M margin call:
- System exhausts $25M USDC first
- Then adds $5.26M UST (next cheapest)
- Intelligently preserves highest-yield assets

This proves it's not just 'always pick USDC' — it's a smart optimization engine."

---

## ❓ Expected Questions & Answers

### Q1: "Is this fully automated?"

**ANSWER:**
> "Day 1 MVP: SignUIT **automates the decisioning** — policy evaluation, CTD calculation, eligibility checking — but execution requires human approval. This gives institutions regulatory comfort and risk oversight.
>
> Phase 2: We're adding **optional auto-execution**. Institutions can enable `autoApprove = true` in their policy for specific scenarios — like low-risk USDC-only calls under $10M, or weekend operations.
>
> The goal is: **human-in-the-loop by default, automation where trusted.**"

---

### Q2: "Why do you select USDC instead of higher-yielding assets?"

**ANSWER:**
> "This is actually the **yield optimization strategy**! 
>
> USDC has 0% yield, so sending it costs us **nothing** in lost opportunity. Meanwhile, we preserve $20.2M of USYC and UST in the portfolio, which continue earning ~$2,300/day.
>
> If we sent USYC or UST, we'd lose their yield while they're posted as collateral. By sending USDC first, we **maximize capital efficiency** by keeping high-yield assets deployed.
>
> Our algorithm calculates: (yield × duration) / LTV for each asset, then selects the lowest cost. USDC = $0 cost, so it wins."

---

### Q3: "Why Canton Network?"

**ANSWER:**
> "Three critical reasons:
>
> 1. **Immutable Audit Trail**: Every routing decision is a smart contract that cannot be altered. When regulators ask 'who decided what and when,' we have the answer on-ledger.
>
> 2. **Privacy-Preserving**: Canton's sub-transaction privacy means sensitive collateral positions are only shared with relevant counterparties, not broadcast to the entire network.
>
> 3. **Cross-Institutional Coordination**: Phase 2 will enable multi-party routing optimization — like substitution agreements between institutions — all with atomic settlement guarantees.
>
> Canton is the only platform that gives us institutional-grade privacy AND auditability."

---

### Q4: "How do you make money?"

**ANSWER:**
> "Usage-based pricing:
>
> - **Day 1**: Fee per routing recommendation generated (e.g., $50 per margin call analyzed)
> - **Phase 2**: Enterprise tier with auto-execution + advanced analytics ($500/month base + per-transaction fees)
> - **Target**: Large asset managers processing 20-50 margin calls per day
>
> Even at conservative pricing, a single institution could generate $25K-50K ARR. Our beachhead: 10 prime brokers on Canton who already manage tokenized treasuries."

---

### Q5: "What's your Phase 2 timeline?"

**ANSWER:**
> "Clear roadmap:
>
> - **Today (HackCanton)**: Day 1 MVP with human approval
> - **Q3 2026**: Phase 2 beta with opt-in auto-execution
> - **Q4 2026**: General availability on Canton mainnet
>
> We're not trying to launch full automation on Day 1. Institutions need time to trust the system. Our rollout mirrors how they adopt any critical financial infrastructure: **prove it works, build trust, then automate.**"

---

### Q6: "How does this compare to existing collateral management systems?"

**ANSWER:**
> "Existing systems fall into two categories:
>
> **1. Legacy systems (Bloomberg AIM, Calypso):**
> - Not Canton-native
> - Expensive ($100K+ licenses)
> - No real-time optimization
> - Poor audit trails
>
> **2. Manual processes (Excel + email):**
> - 30+ minutes per decision
> - Error-prone
> - No policy enforcement
> - Zero auditability
>
> SignUIT is the **only Canton-native collateral routing engine**. We combine:
> - Speed (3 seconds)
> - Canton's privacy + auditability
> - Policy-based intelligence
> - Hackathon-friendly pricing
>
> We're not competing with Bloomberg. We're replacing Excel for institutions already on Canton."

---

## 🎯 Value Messaging (Use These Exact Phrases)

### ✅ DO SAY:
- "Recommendation engine"
- "Automated decisioning with human approval"
- "Policy-based collateral optimization"
- "600x faster decisions"
- "Human oversight maintained"
- "Optional auto-execution (Phase 2)"
- "Yield preservation via intelligent asset selection"

### ❌ DON'T SAY:
- "Fully automated routing" (not true for Day 1)
- "We always pick USYC/UST" (contradicts algorithm)
- "Eliminates human involvement" (not Day 1 goal)
- "$1,849 savings vs USDC" (old, incorrect narrative)

---

## 📊 Key Metrics to Emphasize

| Metric | Value | Impact |
|--------|-------|--------|
| **Decision Speed** | 3 seconds vs 30 minutes | 600x faster |
| **Yield Preserved** | ~$2,300/day on $20M | Real economic value |
| **Audit Trail** | Immutable on Canton | Regulatory compliance |
| **Opportunity Cost** | $0 for USDC selection | Capital efficiency |
| **Human Oversight** | Required (Day 1) | Risk management |

---

## 🎨 Visual Demo Tips

### Screen Highlights:
1. **Holdings Table**: Show all three assets with yields
2. **Margin Call Notification**: "$15M required by 4:00 PM"
3. **CTD Calculation**: Real-time (3-second animation)
4. **Recommendation Card**: Clear "USDC $15M" with rationale
5. **Approve Button**: Big, obvious (emphasize human action)
6. **Audit Trail**: Show AllocationRecord contract ID

### Body Language:
- Point at screen when showing 3-second calculation (SPEED)
- Pause and gesture at "Approve" button (CONTROL)
- Smile when showing audit trail (TRUST)

---

## ⏱️ Timing Breakdown

| Section | Duration |
|---------|----------|
| Opening statement | 60 sec |
| Demo setup | 15 sec |
| CTD calculation (speed) | 30 sec |
| Recommendation on Canton | 30 sec |
| Human approval (control) | 30 sec |
| Audit trail | 20 sec |
| Fallback scenario | 30 sec |
| **Total Demo** | **~3.5 minutes** |
| Q&A buffer | 1-2 minutes |
| **Total Presentation** | **5 minutes** |

---

## 🚨 Common Pitfalls to Avoid

1. **Don't oversell automation**: Judges will ask "so a human still approves?" — answer confidently "Yes, for Day 1. That's intentional."

2. **Don't ignore Canton value**: Some judges may think "why not just use Postgres?" — emphasize immutable audit trail + privacy.

3. **Don't get defensive about yield**: If asked why USDC beats USYC, explain the **opportunity cost logic** clearly.

4. **Don't skip the fallback scenario**: It proves intelligence, not just "always USDC."

---

## 🎤 Closing Statement (30 seconds)

"To summarize:

SignUIT is a **recommendation engine** that helps institutions make **600x faster collateral decisions** with full **human oversight** and an **immutable audit trail on Canton**.

Day 1: Human approval required.  
Phase 2: Optional automation.

We're not replacing humans. We're giving them **superpowers**.

Thank you. Happy to take questions."

---

## 📎 Demo Checklist

Before presentation:
- [ ] Canton sandbox running
- [ ] Seed data loaded ($25M USDC, $12M UST, $8.2M USYC)
- [ ] Policy created (CTD rule)
- [ ] Browser open to dashboard
- [ ] Margin call test ready ($15M)
- [ ] Backup: Screenshots if live demo fails
- [ ] Practiced timing (3-5 minutes)

---

**END OF JURY PRESENTATION GUIDE**
```

**Reason:** 
- Comprehensive reference for demo day
- Mentor-approved messaging throughout
- Handles all likely questions
- Timing guidance
- Avoids pitfalls

---

## ✅ VERIFICATION CHECKLIST

After implementing all changes, verify:

### Documentation Consistency:
- [ ] No instances of "automate collateral routing" without "recommendations" qualifier
- [ ] Every "automation" mention clarifies Day 1 vs Phase 2
- [ ] "Recommendation engine" used as primary descriptor
- [ ] Human approval explicitly stated in workflow diagrams

### Messaging Alignment:
- [ ] Speed emphasized before control (mentor guidance)
- [ ] "Automated decisioning" ✓ not "automated routing" ❌
- [ ] Phase 2 clearly labeled as future roadmap
- [ ] autoApprove field mentioned as prepared but not active

### Code Comments:
- [ ] generateSuggestion handler explains human approval requirement
- [ ] RoutingSuggestion Daml comments clarify Day 1 behavior
- [ ] autoApprove field comments say "Phase 2 feature"

### Demo Materials:
- [ ] Jury presentation guide uses mentor-approved phrases
- [ ] Q&A answers match new framing
- [ ] Timing emphasizes speed (3 sec) then control (human review)

---

## 📊 PRIORITY SUMMARY

### 🔴 HIGH PRIORITY (Do First - 20 minutes):
1. README Hero section
2. README "At a Glance" (new section)
3. README Transaction Lifecycle
4. README MVP Scope split
5. Create JURY-PRESENTATION.md

### 🟡 MEDIUM PRIORITY (Do Next - 10 minutes):
6. README Core Concept table
7. README Demo value order
8. README Business Context

### 🟢 LOW PRIORITY (Optional - 5 minutes):
9. Daml comment updates
10. API TypeScript comment updates

**Total Implementation Time: ~35 minutes**

---

## 🎯 FINAL VALIDATION

Run these checks after implementation:

```bash
# Check for problematic phrases
grep -r "automate.*routing" README.md
# Should return ONLY: "routing recommendations" or "routing decisioning"

# Check for "fully automated" claims
grep -ri "fully.automat" README.md docs/
# Should return ZERO matches

# Check Day 1 vs Phase 2 clarity
grep -c "Day 1" README.md
# Should return 5+ matches

grep -c "Phase 2" README.md  
# Should return 5+ matches

# Verify "recommendation engine" present
grep -c "recommendation engine" README.md
# Should return 3+ matches
```

---

## 📝 NOTES

- All changes preserve existing code functionality
- Only documentation/comments updated
- No breaking changes to API or contracts
- Tests remain unchanged (they already pass)
- TypeScript bindings already regenerated

---

**END OF IMPLEMENTATION PLAN**

Next steps:
1. Review this plan
2. Implement changes file by file
3. Run verification checklist
4. Practice jury presentation with new messaging
5. Ship it! 🚀
