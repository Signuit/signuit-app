# SignUIT CollateralRouter - Dashboard Implementation Plan

**Date:** April 23, 2026  
**Goal:** Build professional, polished dashboard for HackCanton demo  
**Strategy:** Adapt existing dashboard, All 6 pages, Professional UI, Live Canton data

---

## 📊 Executive Summary

### What We're Building:

**6 Core Pages** (Priority ordered):
1. **Dashboard (Overview)** - Holdings summary, pending suggestions, stats
2. **Holdings (Collateral Positions)** - $25M USDC, $12M UST, $8.2M USYC management
3. **Generate Suggestion (Demo Flow)** - Margin call input → CTD calculation → Recommendation → Approve ⭐ **CORE DEMO**
4. **Suggestions (Pending List)** - RoutingSuggestion contracts waiting for approval
5. **Policy Management** - Configure CTD rules, priority list, autoApprove
6. **Audit Trail** - AllocationRecord history (immutable records)

### Tech Stack:
- **Frontend:** TanStack Router + React 19 + Tailwind v4
- **Data:** Canton Sandbox API via Nexus Framework + ORPC
- **UI:** Existing shadcn/ui components + Recharts
- **State:** TanStack Query (React Query)

### Time Estimate:
- **Core structure:** 1 hour
- **6 pages implementation:** 3-4 hours
- **Polish + testing:** 1 hour
- **Total:** ~5-6 hours

---

## 🎯 User Choices Summary

| Choice | Selection | Rationale |
|--------|-----------|-----------|
| **Dashboard Strategy** | Adapt existing | Faster, leverages current components |
| **Pages** | All 6 pages | Full-featured demo |
| **UI Complexity** | Professional | Impressive for judges |
| **Data** | Canton Sandbox | Live data, real contracts |

---

## 📋 Phase 1: Core Structure Setup (1 hour)

### Task 1.1: Update Sidebar Navigation (15 min)

**File:** `/apps/web/src/components/app-sidebar.tsx`

**Changes:**
```tsx
// BEFORE (lines 29-58):
const mainNavItems = linkOptions([
  { to: "/dashboard", label: "Dashboard", ... },
  { to: "/dashboard/users", label: "Users", ... },
]);

const secondaryNavItems = linkOptions([
  { to: "/dashboard/components_lib", label: "Components", ... },
  { to: "/dashboard/settings", label: "Settings", ... },
]);

// AFTER:
const mainNavItems = linkOptions([
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    to: "/dashboard/holdings",
    label: "Holdings",
    icon: <WalletIcon />,
  },
  {
    to: "/dashboard/suggestions",
    label: "Suggestions",
    icon: <FileTextIcon />,
  },
  {
    to: "/dashboard/policy",
    label: "Policy",
    icon: <SettingsIcon />,
  },
  {
    to: "/dashboard/audit",
    label: "Audit Trail",
    icon: <HistoryIcon />,
  },
]);

const secondaryNavItems = linkOptions([
  {
    to: "/dashboard/generate",
    label: "⚡ Generate Suggestion",
    icon: <ZapIcon />,
    className: "bg-primary/10 hover:bg-primary/20", // Highlight for demo
  },
]);
```

**Icons to import:**
```tsx
import { 
  LayoutDashboardIcon, 
  WalletIcon, 
  FileTextIcon, 
  SettingsIcon,
  HistoryIcon,
  ZapIcon
} from "lucide-react";
```

---

### Task 1.2: Create Route Files (15 min)

**Create these files:**

```bash
apps/web/src/routes/_app/dashboard/
├── index.tsx                    # Overview (adapt existing)
├── holdings.tsx                 # Collateral positions list
├── suggestions.tsx              # Pending RoutingSuggestions
├── policy.tsx                   # Policy management
├── audit.tsx                    # Audit trail (AllocationRecord)
└── generate.tsx                 # Demo flow (margin call → CTD → approve)
```

**Template for each (except index):**
```tsx
import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@nexus/ui/components/card";

export const Route = createFileRoute("/_app/dashboard/[PAGE_NAME]")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">[Page Title]</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>[Section Title]</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Content here */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### Task 1.3: Setup API Hooks (30 min)

**File:** `/apps/web/src/hooks/use-collateral-api.ts` (NEW)

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/nexus-client"; // ORPC client

/**
 * Custom hooks for SignUIT CollateralRouter API
 * Uses TanStack Query for caching and optimistic updates
 */

// ─── Holdings ───────────────────────────────────────────────────

export function useHoldings() {
  return useQuery({
    queryKey: ["holdings"],
    queryFn: () => api.collateral.listHoldings({ limit: 100 }),
    staleTime: 30000, // 30 seconds
  });
}

export function useCreateHolding() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      holdingId: string;
      asset: string;
      amount: number;
      yield: number;
      haircut: number;
    }) => api.collateral.createHolding(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["holdings"] });
    },
  });
}

// ─── Policies ───────────────────────────────────────────────────

export function usePolicies() {
  return useQuery({
    queryKey: ["policies"],
    queryFn: () => api.collateral.listPolicies({ limit: 100 }),
  });
}

export function useCreatePolicy() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      policyId: string;
      ruleType: "CTD" | "ExpiryFirst" | "YieldMax";
      priorityList: string[];
      minLtv: number;
      maxHaircut: number;
      autoApprove: boolean;
      counterpartyRules?: [string, string[]][];
    }) => api.collateral.createPolicy(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policies"] });
    },
  });
}

// ─── Suggestions (Routing Recommendations) ──────────────────────

export function useSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: () => api.collateral.listSuggestions({ limit: 100 }),
    refetchInterval: 5000, // Poll every 5 seconds for pending approvals
  });
}

export function useGenerateSuggestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      marginCallId: string;
      amountRequired: number;
      policyId: string;
      durationDays?: number;
      counterpartyName?: string;
    }) => api.collateral.generateSuggestion(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function useApproveSuggestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (suggestionCid: string) => 
      api.collateral.approveSuggestion({ suggestionCid }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
      queryClient.invalidateQueries({ queryKey: ["audit"] });
    },
  });
}

export function useRejectSuggestion() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (suggestionCid: string) => 
      api.collateral.rejectSuggestion({ suggestionCid }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

// ─── Audit Trail ────────────────────────────────────────────────

export function useAuditTrail() {
  return useQuery({
    queryKey: ["audit"],
    queryFn: () => api.collateral.listAllocations({ limit: 100 }),
  });
}

// ─── Utility Hooks ──────────────────────────────────────────────

export function useStats() {
  const { data: holdings } = useHoldings();
  const { data: suggestions } = useSuggestions();
  const { data: audit } = useAuditTrail();
  
  return {
    totalHoldingsValue: holdings?.reduce((sum, h) => 
      sum + parseFloat(h.payload.amount), 0
    ) || 0,
    
    pendingSuggestions: suggestions?.filter(s => 
      s.payload.status === "Pending"
    ).length || 0,
    
    totalAllocations: audit?.length || 0,
    
    // Add more computed stats as needed
  };
}
```

**Note:** Need to create `listSuggestions` endpoint in collateral-router.ts (currently missing)

---

## 📄 Phase 2: Page-by-Page Implementation (4 hours)

### Priority Order:
1. Holdings (easiest, foundational) - 30 min
2. Dashboard Overview (leverage existing) - 45 min
3. Generate Suggestion (CORE DEMO) - 1.5 hours ⭐
4. Suggestions List (pending approvals) - 45 min
5. Audit Trail (immutable records) - 30 min
6. Policy Management - 30 min

---

### Page 1: Holdings (Collateral Positions) - 30 min

**File:** `/apps/web/src/routes/_app/dashboard/holdings.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Holdings                                    [+ Add New] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Total Portfolio Value: $45.2M                          │
│  ├─ USDC: $25.0M (55.3%)                               │
│  ├─ UST:  $12.0M (26.5%)                               │
│  └─ USYC: $8.2M (18.1%)                                │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Holdings Table:                                        │
│  ┌────┬────────┬───────────┬───────┬─────────┬────────┐│
│  │ ID │ Asset  │ Amount    │ Yield │ Haircut │ Action ││
│  ├────┼────────┼───────────┼───────┼─────────┼────────┤│
│  │ 1  │ USDC   │ $25.0M    │ 0%    │ 0%      │ [Edit] ││
│  │ 2  │ UST    │ $12.0M    │ 4.2%  │ 5%      │ [Edit] ││
│  │ 3  │ USYC   │ $8.2M     │ 4.5%  │ 2%      │ [Edit] ││
│  └────┴────────┴───────────┴───────┴─────────┴────────┘│
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Components:**
- Summary card with pie chart (recharts)
- Holdings table with sortable columns
- "Add Holding" dialog with form
- Edit holding inline

**API Integration:**
```tsx
const { data: holdings, isLoading } = useHoldings();
const createHolding = useCreateHolding();

// Render holdings from Canton
{holdings?.map(h => (
  <TableRow key={h.contractId}>
    <TableCell>{h.payload.asset}</TableCell>
    <TableCell>${parseFloat(h.payload.amount).toLocaleString()}</TableCell>
    <TableCell>{(parseFloat(h.payload.yield) * 100).toFixed(1)}%</TableCell>
    <TableCell>{(parseFloat(h.payload.haircut) * 100).toFixed(1)}%</TableCell>
  </TableRow>
))}
```

---

### Page 2: Dashboard Overview - 45 min

**File:** `/apps/web/src/routes/_app/dashboard/index.tsx` (ADAPT EXISTING)

**Changes to existing dashboard:**

1. **Replace stat cards (lines 756-778):**
```tsx
// BEFORE: Total Balance, Income, Expenses (generic)

// AFTER: SignUIT-specific stats
<StatCardItem
  title="Total Collateral"
  value={`$${(totalHoldingsValue / 1_000_000).toFixed(1)}M`}
  icon={WalletIcon}
  trend="up"
  trendValue="+2.5%"
/>
<StatCardItem
  title="Pending Approvals"
  value={pendingSuggestions}
  icon={FileTextIcon}
  trend={pendingSuggestions > 0 ? null : "down"}
  trendValue={pendingSuggestions > 0 ? "Requires action" : "All clear"}
/>
<StatCardItem
  title="Routes Executed"
  value={totalAllocations}
  icon={TrendingUpIcon}
  trend="up"
  trendValue="+12 this month"
/>
```

2. **Replace crypto assets card (lines 499-538) with Holdings Summary:**
```tsx
function HoldingsSummaryCard() {
  const { data: holdings } = useHoldings();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collateral Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {holdings?.map(h => (
          <div key={h.contractId} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="font-bold">{h.payload.asset}</span>
              </div>
              <div>
                <p className="font-medium">{h.payload.asset}</p>
                <p className="text-xs text-muted-foreground">
                  {(parseFloat(h.payload.yield) * 100).toFixed(1)}% yield
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                ${(parseFloat(h.payload.amount) / 1_000_000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground">
                LTV: {((1 - parseFloat(h.payload.haircut)) * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

3. **Replace pending documents card (lines 389-445) with Pending Suggestions:**
```tsx
function PendingSuggestionsCard() {
  const { data: suggestions } = useSuggestions();
  const pending = suggestions?.filter(s => s.payload.status === "Pending");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        {pending?.length === 0 ? (
          <p className="text-muted-foreground">No pending suggestions</p>
        ) : (
          pending?.map(s => (
            <div key={s.contractId}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Route #{s.payload.routeId}</p>
                  <p className="text-sm text-muted-foreground">
                    Margin Call: {s.payload.marginCallId}
                  </p>
                  <p className="text-sm">
                    Suggested: {s.payload.suggestedAssets.join(" + ")}
                  </p>
                </div>
                <Button size="sm">Review</Button>
              </div>
              <Separator className="my-3" />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
```

4. **Update recent activity table (lines 540-645) with Audit Trail:**
```tsx
function RecentAllocationsCard() {
  const { data: audit } = useAuditTrail();
  const recent = audit?.slice(0, 5); // Latest 5
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Allocations</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route ID</TableHead>
              <TableHead>Assets Sent</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Cost (bps)</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent?.map(a => (
              <TableRow key={a.contractId}>
                <TableCell>{a.payload.routeId}</TableCell>
                <TableCell>{a.payload.assetsSent.join(", ")}</TableCell>
                <TableCell>
                  ${a.payload.amountsSent.reduce((sum, amt) => 
                    sum + parseFloat(amt), 0
                  ).toLocaleString()}
                </TableCell>
                <TableCell>
                  {parseFloat(a.payload.opportunityCostBps).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant="default">
                    {a.payload.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

### Page 3: Generate Suggestion (DEMO FLOW) ⭐ - 1.5 hours

**File:** `/apps/web/src/routes/_app/dashboard/generate.tsx`

**This is the CORE demo page** - needs to be polished!

**Layout (Multi-step wizard):**
```
┌─────────────────────────────────────────────────────────┐
│ Generate Routing Suggestion                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Step 1: Margin Call Details                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Margin Call ID: [MC-4821____________]           │   │
│  │ Amount Required: [$15,000,000_______] USD       │   │
│  │ Duration: [30___] days                          │   │
│  │ Counterparty: [PrimeBank___________]            │   │
│  │                                                 │   │
│  │                    [Next Step →]                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Step 2: CTD Calculation (3 seconds) ⚡                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Analyzing holdings...                           │   │
│  │                                                 │   │
│  │ ✓ USDC: $25M available (0% cost)               │   │
│  │ ✓ UST:  $12M available (4.2% yield, 95% LTV)   │   │
│  │ ✓ USYC: $8.2M available (4.5% yield, 98% LTV)  │   │
│  │                                                 │   │
│  │ Computing optimal collateral...                  │   │
│  │ [████████████████████████░░] 95%                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Step 3: Recommendation                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💡 CTD Recommendation                           │   │
│  │                                                 │   │
│  │ Selected: $15.0M USDC                           │   │
│  │                                                 │   │
│  │ Why USDC?                                       │   │
│  │ ✓ Zero opportunity cost (0% yield)              │   │
│  │ ✓ 100% LTV (no over-collateralization)         │   │
│  │ ✓ Preserves $20.2M yield-bearing assets         │   │
│  │ ✓ Keeps USYC+UST earning ~$2,300/day           │   │
│  │                                                 │   │
│  │ Opportunity Cost: $0.00 over 30 days            │   │
│  │                                                 │   │
│  │ [← Back]  [Create Suggestion on Canton]         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Step 4: Review & Approve                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🚨 Human Approval Required                       │   │
│  │                                                 │   │
│  │ RoutingSuggestion Contract:                      │   │
│  │ Contract ID: #00c4f1e8b3a2...                    │   │
│  │ Created: 2026-04-23 17:48:32                     │   │
│  │                                                 │   │
│  │ Assets: USDC                                    │   │
│  │ Amount: $15,000,000.00                          │   │
│  │ Policy: CTD-POLICY-001                          │   │
│  │                                                 │   │
│  │ [✓ Approve]  [✗ Reject]                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Implementation Details:**

**Step 1: Form Input**
```tsx
const [step, setStep] = useState(1);
const [marginCallId, setMarginCallId] = useState("MC-4821");
const [amountRequired, setAmountRequired] = useState(15000000);
const [durationDays, setDurationDays] = useState(30);
const [counterpartyName, setCounterpartyName] = useState("PrimeBank");
```

**Step 2: CTD Calculation with Loading Animation**
```tsx
const generateSuggestion = useGenerateSuggestion();

const handleGenerate = async () => {
  setStep(2);
  
  // Simulate 3-second CTD calculation (show loading)
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Call API
  const result = await generateSuggestion.mutateAsync({
    marginCallId,
    amountRequired,
    policyId: "CTD-POLICY-001", // Get from policy select
    durationDays,
    counterpartyName,
  });
  
  setSuggestionResult(result);
  setStep(3);
};
```

**Step 3: Display Recommendation**
```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <LightbulbIcon className="text-yellow-500" />
      CTD Recommendation
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <div className="text-2xl font-bold">
        Selected: {suggestionResult.suggestedAssets.join(" + ")}
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="font-medium mb-2">Why {suggestionResult.suggestedAssets[0]}?</p>
        <ul className="space-y-1 text-sm">
          <li className="flex items-center gap-2">
            <CheckIcon className="text-green-500 size-4" />
            Zero opportunity cost (0% yield)
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="text-green-500 size-4" />
            100% LTV (no over-collateralization)
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="text-green-500 size-4" />
            Preserves ${(20.2).toFixed(1)}M yield-bearing assets
          </li>
        </ul>
      </div>
      
      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-muted-foreground">Opportunity Cost:</span>
        <span className="text-2xl font-bold">
          ${suggestionResult.totalOpportunityCost.toFixed(2)}
        </span>
      </div>
      
      <Button 
        size="lg" 
        className="w-full"
        onClick={() => setStep(4)}
      >
        Create Suggestion on Canton
      </Button>
    </div>
  </CardContent>
</Card>
```

**Step 4: Approve/Reject**
```tsx
const approveSuggestion = useApproveSuggestion();

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <ShieldAlertIcon className="text-red-500" />
      Human Approval Required
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <Alert>
        <InfoIcon className="size-4" />
        <AlertTitle>Day 1 MVP: Human-in-the-loop</AlertTitle>
        <AlertDescription>
          This suggestion requires ops team approval before execution.
        </AlertDescription>
      </Alert>
      
      <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
        <p><span className="text-muted-foreground">Contract ID:</span> {suggestionContractId}</p>
        <p><span className="text-muted-foreground">Created:</span> {new Date().toISOString()}</p>
        <p><span className="text-muted-foreground">Status:</span> Pending</p>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="default"
          size="lg"
          className="flex-1"
          onClick={() => handleApprove()}
        >
          <CheckCircleIcon className="mr-2" />
          Approve
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="flex-1"
          onClick={() => handleReject()}
        >
          <XCircleIcon className="mr-2" />
          Reject
        </Button>
      </div>
    </div>
  </CardContent>
</Card>
```

---

### Page 4: Suggestions (Pending List) - 45 min

**File:** `/apps/web/src/routes/_app/dashboard/suggestions.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Routing Suggestions                    [Filter: All ▼] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Table:                                                 │
│  ┌────────┬────────────┬──────────┬───────┬──────────┐ │
│  │ Route  │ Margin Call│ Suggested│ Cost  │ Action   │ │
│  │ ID     │            │ Assets   │ (bps) │          │ │
│  ├────────┼────────────┼──────────┼───────┼──────────┤ │
│  │ RT-001 │ MC-4821    │ USDC     │ 0.00  │ [Review] │ │
│  │        │ $15M       │ $15M     │       │          │ │
│  ├────────┼────────────┼──────────┼───────┼──────────┤ │
│  │ RT-002 │ MC-4822    │ USDC+UST │ 12.50 │ [Review] │ │
│  │        │ $30M       │ $25M+$5M │       │          │ │
│  └────────┴────────────┴──────────┴───────┴──────────┘ │
│                                                         │
│  [Click "Review" opens detail modal]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Real-time polling (refetchInterval: 5000ms)
- Status badges (Pending, Approved, Rejected)
- Approve/Reject inline
- Detail modal with full suggestion data

---

### Page 5: Audit Trail - 30 min

**File:** `/apps/web/src/routes/_app/dashboard/audit.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Audit Trail                     [Export CSV] [Filter]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Immutable records on Canton Network                    │
│                                                         │
│  Table:                                                 │
│  ┌────────┬──────────┬──────────┬───────┬────────────┐ │
│  │ Date   │ Route ID │ Assets   │ Cost  │ Approved   │ │
│  │        │          │ Sent     │ (bps) │ By         │ │
│  ├────────┼──────────┼──────────┼───────┼────────────┤ │
│  │ Apr 23 │ RT-001   │ USDC     │ 0.00  │ Institution│ │
│  │ 17:48  │          │ $15M     │       │            │ │
│  ├────────┼──────────┼──────────┼───────┼────────────┤ │
│  │ Apr 23 │ RT-002   │ USDC,UST │ 12.50 │ Institution│ │
│  │ 15:32  │          │ $25M,$5M │       │            │ │
│  └────────┴──────────┴──────────┴───────┴────────────┘ │
│                                                         │
│  [Click row shows Canton contract details]             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Read-only view (immutable records)
- Canton contract ID visible
- Link to Canton explorer (if available)
- Export to CSV for regulatory reporting
- Time-series chart of costs over time

---

### Page 6: Policy Management - 30 min

**File:** `/apps/web/src/routes/_app/dashboard/policy.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Policy Management                      [+ Create Policy]│
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Active Policy: CTD-POLICY-001                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Rule Type: Cheapest-to-Deliver (CTD)           │   │
│  │                                                 │   │
│  │ Priority List:                                  │   │
│  │  1. USYC  ↑                                     │   │
│  │  2. UST   ↑                                     │   │
│  │  3. USDC  ↑                                     │   │
│  │                                                 │   │
│  │ Min LTV: 95%   Max Haircut: 10%                │   │
│  │                                                 │   │
│  │ Auto-Approve: ❌ (Phase 2 feature)              │   │
│  │                                                 │   │
│  │ Counterparty Rules:                             │   │
│  │  • PrimeBank: USYC, UST, USDC                  │   │
│  │                                                 │   │
│  │ [Edit Policy]  [Deactivate]                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Policy History:                                        │
│  └─ CTD-POLICY-001 (Active)                            │
│  └─ CTD-POLICY-000 (Archived)                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features:**
- Create/edit policy form
- Drag-and-drop priority list reordering
- Toggle autoApprove (disabled for Day 1, show "Phase 2" badge)
- Counterparty rules table
- Policy version history

---

## 📊 Phase 3: Polish & Testing (1 hour)

### Task 3.1: Visual Polish (30 min)

**Add these enhancements:**

1. **Loading States**
   - Skeleton loaders for all data fetching
   - Spinner for mutations
   - Progress bars for CTD calculation

2. **Empty States**
   - "No holdings yet" with "Add First Holding" CTA
   - "No pending suggestions" with happy checkmark
   - "No audit records" for new users

3. **Animations**
   - Framer Motion for page transitions
   - Number count-up animations for stats
   - Fade-in for data tables
   - Success/error toasts (sonner)

4. **Responsive Design**
   - Mobile-friendly layouts
   - Responsive tables (horizontal scroll)
   - Stacked cards on small screens

---

### Task 3.2: Error Handling (15 min)

**Add error boundaries and fallbacks:**

```tsx
// Wrapper for each page
function PageWithErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircleIcon className="size-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-4">
              Unable to load data from Canton. Please check your sandbox connection.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </CardContent>
        </Card>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
```

**Add query error handling:**
```tsx
const { data, error, isLoading } = useHoldings();

if (error) {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Error loading holdings</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
```

---

### Task 3.3: Testing Checklist (15 min)

**Manual Testing:**

- [ ] All 6 pages load without errors
- [ ] Sidebar navigation works
- [ ] Holdings table displays Canton data
- [ ] Generate suggestion creates RoutingSuggestion contract
- [ ] Approve button creates AllocationRecord
- [ ] Audit trail shows approved allocations
- [ ] Policy page displays active policy
- [ ] Loading states work
- [ ] Error states work
- [ ] Responsive on mobile

**Demo Flow Testing:**
1. Start on Dashboard → See stats
2. Click "Holdings" → See $45.2M total
3. Click "Generate Suggestion" → Fill form
4. Wait 3 seconds → See USDC recommendation
5. Click "Approve" → See success toast
6. Click "Audit Trail" → See new record

---

## 🚀 Phase 4: Demo Preparation (Optional - 30 min)

### Task 4.1: Seed Canton with Demo Data

**Run SeedData.daml script:**
```bash
cd sandbox
daml script \
  --dar .daml/dist/nexus-example-0.0.1.dar \
  --script-name SeedData:seed_demo_scenario \
  --ledger-host localhost \
  --ledger-port 6865
```

**Verify data exists:**
- 1 Policy (CTD-POLICY-001)
- 3 Holdings (USDC, UST, USYC)
- 1 Margin Call (MC-4821)
- 0 Suggestions (will be created in demo)
- 0 Allocations (will be created after approval)

---

### Task 4.2: Pre-Demo Checklist

**Before showing to judges:**
- [ ] Canton Sandbox running
- [ ] Seed data loaded
- [ ] Web app running (`pnpm dev`)
- [ ] Browser open to `/dashboard`
- [ ] Clear any test suggestions/allocations
- [ ] Practice flow 2-3 times
- [ ] Backup: Screenshots if live demo fails

---

## 📁 File Structure Summary

```
apps/web/src/
├── routes/
│   └── _app/
│       └── dashboard/
│           ├── index.tsx          # Dashboard overview (adapted)
│           ├── holdings.tsx       # NEW - Collateral positions
│           ├── generate.tsx       # NEW - Demo flow ⭐
│           ├── suggestions.tsx    # NEW - Pending approvals
│           ├── audit.tsx          # NEW - Audit trail
│           └── policy.tsx         # NEW - Policy management
│
├── hooks/
│   └── use-collateral-api.ts     # NEW - API hooks
│
├── components/
│   ├── app-sidebar.tsx           # UPDATED - SignUIT nav
│   └── dashboard/
│       ├── stat-card.tsx         # Existing
│       ├── holdings-chart.tsx    # NEW - Optional
│       └── suggestion-card.tsx   # NEW - Optional
│
└── lib/
    ├── api.ts                    # Existing - collateralRouter
    └── nexus-client.ts           # Existing - ORPC client
```

---

## ⏱️ Time Estimates (Total: ~6 hours)

| Phase | Tasks | Time |
|-------|-------|------|
| **Phase 1** | Sidebar, routes, API hooks | 1 hour |
| **Phase 2** | 6 pages implementation | 4 hours |
| **Phase 3** | Polish, errors, testing | 1 hour |
| **Phase 4** | Demo prep (optional) | 30 min |
| **Total** | End-to-end | **~6 hours** |

**Realistic with breaks:** 7-8 hours (1 full workday)

---

## 🎯 Success Criteria

### Functional:
- [ ] All 6 pages render without errors
- [ ] Live Canton data displayed
- [ ] Generate suggestion creates contract
- [ ] Approve creates allocation record
- [ ] Sidebar navigation works
- [ ] API error handling graceful

### Visual:
- [ ] Professional UI (polished like existing dashboard)
- [ ] Loading states smooth
- [ ] Responsive on desktop + mobile
- [ ] Animations subtle but present
- [ ] Color scheme consistent

### Demo-Ready:
- [ ] Generate flow takes ~30 seconds total
- [ ] Clear visual emphasis on USDC selection
- [ ] Human approval step obvious (🚨 icons)
- [ ] Audit trail shows immutable record
- [ ] Can repeat demo multiple times

---

## 🚨 Critical Dependencies

### Must Have Before Starting:
1. ✅ Canton Sandbox running (`daml start`)
2. ✅ Seed data loaded (SeedData script)
3. ✅ Web app starts (`pnpm dev`)
4. ✅ ORPC client connected to sandbox
5. ❌ **NEED:** `listSuggestions` endpoint in collateral-router.ts (add this!)

### Add Missing Endpoint:

**File:** `/apps/web/src/lib/collateral-router.ts`

**Add after listHoldings:**
```tsx
listSuggestions: ledgerProcedure
  .input(CollateralQuerySchema)
  .handler(({ input, context }) => {
    return context.ledger.RoutingSuggestion.findMany({
      limit: input.limit,
    });
  }),
```

---

## 🎤 Demo Script (5 minutes)

**With Dashboard:**

1. **Dashboard Overview (30 sec)**
   - "Here's our SignUIT dashboard showing $45.2M in collateral holdings"
   - "We have 0 pending approvals right now"
   - Point out holdings summary

2. **Holdings (15 sec)**
   - Click sidebar → Holdings
   - "These are our collateral positions: $25M USDC, $12M UST, $8.2M USYC"

3. **Generate Suggestion (2 min)** ⭐
   - Click sidebar → Generate Suggestion
   - "Let's simulate a $15M margin call from PrimeBank"
   - Fill form, click "Generate"
   - Wait 3 seconds (emphasize speed)
   - "CTD engine analyzed all holdings and recommends USDC"
   - "Why? Zero opportunity cost, preserves yield-bearing assets"
   - Click "Create on Canton"
   - "Now a human must approve" (emphasize Day 1)
   - Click "Approve"
   - Show success toast

4. **Audit Trail (30 sec)**
   - Click sidebar → Audit Trail
   - "Here's the immutable record on Canton"
   - "Cannot be altered or deleted - perfect for regulators"

5. **Wrap up (1 min)**
   - "That's SignUIT: 3-second recommendations, human oversight, immutable audit trail"

---

## 📝 Next Steps After Plan Approval

1. **Confirm plan with user**
2. **Start implementation** (Phase 1 → Phase 2 → Phase 3)
3. **Test thoroughly**
4. **Practice demo**
5. **Ship it!** 🚀

---

**END OF IMPLEMENTATION PLAN**
