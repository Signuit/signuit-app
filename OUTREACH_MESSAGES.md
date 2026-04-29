# SignUIT CollateralRouter - Kullanıma Hazır Mesajlar

**Güncelleme:** 29 Nisan 2026  
**Strateji:** Email cevabı istemek (görüşme değil) → Daha düşük barrier

---

## 🎯 NADINE CHAKAR - EMAIL (PRIORITY #1)

**Kime:** nadine.chakar@dtcc.com  
**Konu:** Question re: DTCC collateral pilot — routing decisions

**Email:**

```
Hi Nadine,

I'm Ali, building a collateral routing engine for Canton Network as part of HackCanton.

I read about DTCC's pilot testing margin call delivery scenarios with tokenized Treasuries on Canton. The pilot successfully demonstrated settlement, but I'm curious about the decision layer:

**When treasury ops receive a margin call, how do they currently decide *which* collateral to deliver?**

I'm building a policy-based routing engine (Cheapest-to-Deliver algorithm) that:
- Reads eligibility rules from on-chain CollateralPolicy contracts
- Computes optimal asset selection in ~3 seconds (minimizing opportunity cost)
- Creates immutable RoutingSuggestion contracts requiring human approval
- Generates AllocationRecord audit trail on Canton after approval

The goal: automate the 30-minute spreadsheet workflow while preserving human oversight.

Would you be open to sharing (via email, no call needed):
1. Do teams use manual spreadsheets, or is there an existing rules engine?
2. What policy constraints matter most? (LTV thresholds, counterparty eligibility, yield preservation?)
3. Is delivery decision latency a real pain point for your pilot participants?

**Also:** If you know someone on your treasury ops team (or at a pilot participant) who handles daily collateral selection, I'd love an intro — I'm trying to validate this with practitioners, not just strategists.

Happy to share a demo link if helpful — it's a working Canton app with multi-party workflows (Institution, Counterparty, Operator).

Best,
Ali Tapan  
HackCanton Participant  
GitHub: github.com/signuit/signuit-app
```

---

## 📨 LİNKEDİN MESAJLARI (Copy-Paste Ready)

### 1️⃣ Horacio Barakat - Broadridge

```
Hi Horacio,

Building a Cheapest-to-Deliver routing engine for Canton Network margin calls (HackCanton).

Since Broadridge DLR handles $350bn+ daily in tokenized UST repo, curious about the operational layer: **how do participants decide *which* collateral to post when margin calls arrive?**

I'm building a policy-based automation layer:
- On-chain CollateralPolicy contracts (LTV, haircut, counterparty rules)
- CTD algorithm minimizing opportunity cost (~3 sec computation)
- Immutable audit trail with AllocationRecord contracts

Demo: github.com/signuit/signuit-app (working Canton app)

If you have 2 min for a quick email response — do teams use spreadsheets, rules engines, or is this decision fully manual today?

Best,
Ali Tapan | HackCanton
```

---

### 2️⃣ Olivier Grimonpont - Euroclear

```
Hi Olivier,

Saw Euroclear's 500+ transaction collateral mobility pilot on Canton — exactly the use case I'm building for (HackCanton).

Question about the operational workflow: **in the pilot, how did participants decide *which* collateral to mobilize when posting margin?**

I'm building a policy-based routing engine on Canton:
- CTD algorithm (Cheapest-to-Deliver) optimizing opportunity cost
- On-chain CollateralPolicy with LTV, haircut, counterparty constraints
- Immutable RoutingSuggestion + AllocationRecord audit trail

Demo: github.com/signuit/signuit-app (live multi-party app)

If you have 2 min — was collateral selection manual (spreadsheets), or is there existing automation I should study?

Best,
Ali | HackCanton
```

---

### 3️⃣ Matthew Longhurst - TreasurySpring

```
Hi Matthew,

Building a collateral routing engine for Canton Network (HackCanton). TreasurySpring's cross-currency intraday repo work is a perfect match.

**Quick validation question:** When your users face margin calls, how do they decide which collateral to deliver? (Manual selection, policy engine, or fully ad-hoc?)

What I'm building:
- Policy-based CTD algorithm (on-chain CollateralPolicy contracts)
- 3-second optimal asset selection minimizing opportunity cost
- Immutable audit trail (RoutingSuggestion + AllocationRecord)
- Multi-party Canton workflow (Institution, Counterparty, Operator)

Demo: github.com/signuit/signuit-app

If you have 2 min for a quick email/LinkedIn reply — is decision latency a pain point, or is manual selection fast enough for intraday scenarios?

Best,
Ali | HackCanton
```
Hi Matthew,

I'm building collateral routing automation for Canton Network margin calls (HackCanton).

TreasurySpring's cross-currency repo work is exactly the use case. Quick question: how do your users decide which collateral to deliver when calls arrive?

Happy to share what I'm building if helpful—just need a sanity check from practitioners.

Best,
Ali
```

---

### 4️⃣ Brian Steele - DTCC

```
Hi Brian,

Working on policy-based collateral routing for Canton Network margin calls (HackCanton).

DTCC's tokenized UST pilot tested margin call delivery scenarios — curious about the ops layer: **how do treasury teams decide which collateral to deliver when calls arrive?**

What I'm building:
- Daml smart contracts for CollateralPolicy (LTV, haircut, counterparty rules)
- CTD optimization engine (3-second computation)
- Immutable audit trail on Canton (AllocationRecord contracts)

Demo: github.com/signuit/signuit-app

If you have 2 min — is manual spreadsheet selection still the norm, or do institutions have rules engines I should benchmark against?

Best,
Ali Tapan | HackCanton
```

---

### 5️⃣ Graham Rodford - Archax

```
Hi Graham,

Building a collateral routing engine for Canton Network (HackCanton). Archax's work with digital Gilts custody is exactly the use case.

**Quick question:** When clients face margin calls, do they manually choose which collateral to post — or is there automation handling policy/eligibility checks?

What I'm building:
- On-chain CollateralPolicy (counterparty rules, LTV, haircut constraints)
- CTD algorithm optimizing opportunity cost
- Multi-party privacy (Institution, Counterparty, Operator)
- Immutable audit trail on Canton

Demo: github.com/signuit/signuit-app

If you have 2 min — is manual selection a real operational bottleneck for your clients, or fast enough today?

Best,
Ali | HackCanton
```

---

## 🔗 CANTON DISCORD MESAJI (Soft Ask)

**Channel:** #general veya #showcase

```
Hey Canton community 👋

I'm Ali, building **SignUIT CollateralRouter** for HackCanton — a policy-based routing engine for margin call collateral selection.

**The Problem:** Treasury teams still use spreadsheets to manually decide which collateral to deliver when margin calls arrive (30+ min per call, error-prone).

**What I Built:**
- Daml smart contracts (CollateralPolicy, RoutingSuggestion, AllocationRecord)
- CTD optimization engine (Cheapest-to-Deliver) — 3-second computation
- Multi-party privacy (Institution owns decisions, Operator observes)
- Immutable audit trail on Canton

**Demo:** github.com/signuit/signuit-app (working multi-window demo)

**Quick validation question for practitioners:**
When you receive a margin call, how do you currently decide *which* collateral to deliver?
- Manual spreadsheet?
- Policy/rules engine?
- Ad-hoc judgment?

Trying to validate if automated routing actually solves a real pain point. DM open if you have insights! 🚀
```

---

## 📧 EMAIL ALTERNATIF (LinkedIn Bulamadıysan)

**Konu:** Canton Network collateral routing — validation question

```
Hi [Name],

I'm Ali Tapan, building **SignUIT CollateralRouter** on Canton Network as part of HackCanton — a policy-based routing engine for margin call collateral selection.

I saw that [Company] participated in [specific pilot/use case]. Would you be open to sharing a quick insight via email:

**When treasury ops receive a margin call, how do they currently decide *which* collateral to deliver?**

**What I'm building:**
- Daml smart contracts: CollateralPolicy, RoutingSuggestion, AllocationRecord
- CTD optimization algorithm (Cheapest-to-Deliver) — 3-second computation minimizing opportunity cost
- Multi-party privacy model (Institution owns decisions, Operator = infrastructure, Counterparty = caller)
- Immutable audit trail recorded on Canton

The goal: replace the 30-minute Excel workflow with automated, policy-compliant decisioning — while preserving human oversight.

**Demo:** github.com/signuit/signuit-app (working Canton app with multi-window demo)

**Questions I'm trying to answer:**
1. Do teams use manual spreadsheets, or is there an existing rules engine?
2. What policy constraints matter most? (LTV, haircut, counterparty eligibility, yield preservation?)
3. Is decision latency a real operational bottleneck?

Not looking for a call — just a quick email response if you have 2 minutes.

Happy to share more details or arrange a demo if helpful.

Best,
Ali Tapan  
HackCanton Participant  
GitHub: github.com/signuit/signuit-app
```

---

## ✅ GÖNDERME STRATEJİSİ

### Bugün (İlk 2 Saat):
- [ ] Nadine Chakar'a email gönder
- [ ] LinkedIn'de Horacio Barakat'ı bul ve mesaj at
- [ ] LinkedIn'de Olivier Grimonpont'u bul ve mesaj at

### Bugün (Sonraki 2 Saat):
- [ ] Matthew Longhurst'e LinkedIn mesajı
- [ ] Graham Rodford'a LinkedIn mesajı
- [ ] Canton Discord'a katıl ve mesaj at

### Yarın:
- [ ] Kalan 8 kişiye LinkedIn/email
- [ ] Yanıt verenlere follow-up (24 saat içinde)

---

## 💡 ÖNEMLİ NOTLAR

### Mesaj Tonu:
- ✅ "Quick question" / "2 min insight"
- ✅ "Not looking for a call"
- ✅ "Just validating pain point"
- ❌ "Can we schedule 15 min?"
- ❌ "Would love to pick your brain"

### Yanıt Gelmezse:
- 48 saat bekle
- Tek follow-up gönder:
  ```
  Hi [Name], following up on my message—totally understand if you're busy!
  
  One-line question: Is collateral selection for margin calls manual today, or automated?
  
  Cheers,
  Ali
  ```

### İlk Yanıt Gelince:
- Hemen teşekkür et
- Daha derin soru sor:
  - "What policy rules do you check?"
  - "How long does manual selection take?"
  - "Ever deliver wrong collateral?"
- MVP demo link'i paylaş: "Here's what I'm building: [link]"

---

**Next Update:** İlk yanıtlar gelince güncellenecek
