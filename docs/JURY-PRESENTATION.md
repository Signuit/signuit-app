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
