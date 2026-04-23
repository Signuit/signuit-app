import { z } from "zod";

export const CreatePolicySchema = z.object({
	policyId: z.string().min(1),
	ruleType: z.enum(["CTD", "ExpiryFirst", "YieldMax"]),
	priorityList: z.array(z.string()),
	minLtv: z.number().min(0).max(1),
	maxHaircut: z.number().min(0).max(1),
	counterpartyRules: z.array(z.tuple([z.string(), z.array(z.string())])).optional(),
	autoApprove: z.boolean().default(false),
	notificationEmail: z.string().email().optional(),
});

export const UpdatePolicySchema = CreatePolicySchema.extend({
	contractId: z.string().min(1),
	active: z.boolean(),
});

export const CreateHoldingSchema = z.object({
	holdingId: z.string().min(1),
	asset: z.string().min(1),
	amount: z.number().positive(),
	yield: z.number().min(0),
	haircut: z.number().min(0).max(1),
	expiry: z.string().datetime().optional(),
});

export const GenerateSuggestionSchema = z.object({
	marginCallId: z.string().min(1),
	amountRequired: z.number().positive(),
	policyId: z.string().min(1),
	durationDays: z.number().int().positive().optional(),
	counterpartyName: z.string().optional(), // For counterparty-specific eligibility
});

export const ApproveSuggestionSchema = z.object({
	suggestionCid: z.string().min(1),
});

export const RejectSuggestionSchema = ApproveSuggestionSchema;

export const CollateralQuerySchema = z.object({
	limit: z.number().int().positive().optional().default(100),
});
