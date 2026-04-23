import { CollateralRouter } from "@daml.js/nexus-example-0.0.1";

/**
 * Centralized Daml template types for Nexus.
 * Single source of truth for all Daml templates.
 */
export const nexusTypes = {
	// Onboarding
	JoinRequest: CollateralRouter.JoinRequest,
	ServiceAgreement: CollateralRouter.ServiceAgreement,

	// Policy & Holdings
	CollateralPolicy: CollateralRouter.CollateralPolicy,
	CollateralHolding: CollateralRouter.CollateralHolding,
	CollateralAssetMetadata: CollateralRouter.CollateralAssetMetadata,

	// Routing Flow
	MarginCall: CollateralRouter.MarginCall,
	RoutingSuggestion: CollateralRouter.RoutingSuggestion,
	AllocationRecord: CollateralRouter.AllocationRecord,
} as const;

export type NexusTypes = typeof nexusTypes;
