// Generated from CollateralRouter.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';

import * as pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 from 'daml.js/daml-prim-DA-Types-1.0.0';
import * as pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 from 'daml.js/ghc-stdlib-DA-Internal-Template-1.0.0';

export declare type UpdateHolding = {
  newAmount: damlTypes.Numeric;
};

export declare const UpdateHolding:
  damlTypes.Serializable<UpdateHolding> & {
  }
;


export declare type CollateralHolding = {
  holdingId: string;
  institution: damlTypes.Party;
  asset: string;
  amount: damlTypes.Numeric;
  yield: damlTypes.Numeric;
  haircut: damlTypes.Numeric;
  expiry: damlTypes.Optional<damlTypes.Time>;
};

export declare interface CollateralHoldingInterface {
  Archive: damlTypes.Choice<CollateralHolding, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralHolding, undefined>>;
  UpdateHolding: damlTypes.Choice<CollateralHolding, UpdateHolding, damlTypes.ContractId<CollateralHolding>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralHolding, undefined>>;
}
export declare const CollateralHolding:
  damlTypes.Template<CollateralHolding, undefined, '#nexus-example:CollateralRouter:CollateralHolding'> &
  damlTypes.ToInterface<CollateralHolding, never> &
  CollateralHoldingInterface;

export declare namespace CollateralHolding {
}



export declare type SatisfyMarginCall = {
};

export declare const SatisfyMarginCall:
  damlTypes.Serializable<SatisfyMarginCall> & {
  }
;


export declare type MarginCall = {
  callId: string;
  institution: damlTypes.Party;
  counterparty: damlTypes.Party;
  amountRequired: damlTypes.Numeric;
  currency: string;
  dueBy: damlTypes.Time;
  status: RouteStatus;
  createdAt: damlTypes.Time;
};

export declare interface MarginCallInterface {
  SatisfyMarginCall: damlTypes.Choice<MarginCall, SatisfyMarginCall, damlTypes.ContractId<MarginCall>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCall, undefined>>;
  Archive: damlTypes.Choice<MarginCall, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<MarginCall, undefined>>;
}
export declare const MarginCall:
  damlTypes.Template<MarginCall, undefined, '#nexus-example:CollateralRouter:MarginCall'> &
  damlTypes.ToInterface<MarginCall, never> &
  MarginCallInterface;

export declare namespace MarginCall {
}



export declare type MarkFailed = {
};

export declare const MarkFailed:
  damlTypes.Serializable<MarkFailed> & {
  }
;


export declare type AllocationRecord = {
  routeId: string;
  institution: damlTypes.Party;
  marginCallId: string;
  assetsSent: string[];
  amountsSent: damlTypes.Numeric[];
  ruleApplied: string;
  ctdSavingsBps: damlTypes.Numeric;
  approvedBy: damlTypes.Party;
  executedAt: damlTypes.Time;
  status: RouteStatus;
};

export declare interface AllocationRecordInterface {
  MarkFailed: damlTypes.Choice<AllocationRecord, MarkFailed, damlTypes.ContractId<AllocationRecord>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationRecord, undefined>>;
  Archive: damlTypes.Choice<AllocationRecord, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AllocationRecord, undefined>>;
}
export declare const AllocationRecord:
  damlTypes.Template<AllocationRecord, undefined, '#nexus-example:CollateralRouter:AllocationRecord'> &
  damlTypes.ToInterface<AllocationRecord, never> &
  AllocationRecordInterface;

export declare namespace AllocationRecord {
}



export declare type RejectSuggestion = {
};

export declare const RejectSuggestion:
  damlTypes.Serializable<RejectSuggestion> & {
  }
;


export declare type ApproveSuggestion = {
};

export declare const ApproveSuggestion:
  damlTypes.Serializable<ApproveSuggestion> & {
  }
;


export declare type RoutingSuggestion = {
  routeId: string;
  institution: damlTypes.Party;
  marginCallId: string;
  amountRequired: damlTypes.Numeric;
  suggestedAssets: string[];
  suggestedAmounts: damlTypes.Numeric[];
  ctdSavings: damlTypes.Numeric;
  opportunityCostBps: damlTypes.Numeric;
  alternativeOptions: RoutingOption[];
  expiryWarnings: string[];
  explanation: string;
  status: RouteStatus;
  createdAt: damlTypes.Time;
};

export declare interface RoutingSuggestionInterface {
  ApproveSuggestion: damlTypes.Choice<RoutingSuggestion, ApproveSuggestion, damlTypes.ContractId<AllocationRecord>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RoutingSuggestion, undefined>>;
  RejectSuggestion: damlTypes.Choice<RoutingSuggestion, RejectSuggestion, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RoutingSuggestion, undefined>>;
  Archive: damlTypes.Choice<RoutingSuggestion, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<RoutingSuggestion, undefined>>;
}
export declare const RoutingSuggestion:
  damlTypes.Template<RoutingSuggestion, undefined, '#nexus-example:CollateralRouter:RoutingSuggestion'> &
  damlTypes.ToInterface<RoutingSuggestion, never> &
  RoutingSuggestionInterface;

export declare namespace RoutingSuggestion {
}



export declare type ArchivePolicy = {
};

export declare const ArchivePolicy:
  damlTypes.Serializable<ArchivePolicy> & {
  }
;


export declare type UpdatePolicy = {
  newRuleType: RuleType;
  newPriorityList: string[];
  newMinLtv: damlTypes.Numeric;
  newMaxHaircut: damlTypes.Numeric;
  newCounterpartyRules: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, string[]>[];
  newAutoApprove: boolean;
  newNotificationEmail: damlTypes.Optional<string>;
  newActive: boolean;
};

export declare const UpdatePolicy:
  damlTypes.Serializable<UpdatePolicy> & {
  }
;


export declare type CollateralPolicy = {
  operator: damlTypes.Party;
  institution: damlTypes.Party;
  policyId: string;
  ruleType: RuleType;
  priorityList: string[];
  minLtv: damlTypes.Numeric;
  maxHaircut: damlTypes.Numeric;
  counterpartyRules: pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2<string, string[]>[];
  autoApprove: boolean;
  notificationEmail: damlTypes.Optional<string>;
  active: boolean;
  createdAt: damlTypes.Time;
};

export declare interface CollateralPolicyInterface {
  UpdatePolicy: damlTypes.Choice<CollateralPolicy, UpdatePolicy, damlTypes.ContractId<CollateralPolicy>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralPolicy, undefined>>;
  ArchivePolicy: damlTypes.Choice<CollateralPolicy, ArchivePolicy, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralPolicy, undefined>>;
  Archive: damlTypes.Choice<CollateralPolicy, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralPolicy, undefined>>;
}
export declare const CollateralPolicy:
  damlTypes.Template<CollateralPolicy, undefined, '#nexus-example:CollateralRouter:CollateralPolicy'> &
  damlTypes.ToInterface<CollateralPolicy, never> &
  CollateralPolicyInterface;

export declare namespace CollateralPolicy {
}



export declare type UpdateMetadata = {
  newYield: damlTypes.Numeric;
  newHaircut: damlTypes.Numeric;
  newEligible: boolean;
};

export declare const UpdateMetadata:
  damlTypes.Serializable<UpdateMetadata> & {
  }
;


export declare type CollateralAssetMetadata = {
  operator: damlTypes.Party;
  assetSymbol: string;
  currentYield: damlTypes.Numeric;
  haircut: damlTypes.Numeric;
  eligible: boolean;
  updatedAt: damlTypes.Time;
};

export declare interface CollateralAssetMetadataInterface {
  UpdateMetadata: damlTypes.Choice<CollateralAssetMetadata, UpdateMetadata, damlTypes.ContractId<CollateralAssetMetadata>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAssetMetadata, undefined>>;
  Archive: damlTypes.Choice<CollateralAssetMetadata, pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CollateralAssetMetadata, undefined>>;
}
export declare const CollateralAssetMetadata:
  damlTypes.Template<CollateralAssetMetadata, undefined, '#nexus-example:CollateralRouter:CollateralAssetMetadata'> &
  damlTypes.ToInterface<CollateralAssetMetadata, never> &
  CollateralAssetMetadataInterface;

export declare namespace CollateralAssetMetadata {
}



export declare type RoutingOption = {
  assets: string[];
  amounts: damlTypes.Numeric[];
  savings: damlTypes.Numeric;
  label: string;
};

export declare const RoutingOption:
  damlTypes.Serializable<RoutingOption> & {
  }
;


export declare type RouteStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Executed'
  | 'Failed'
;

export declare const RouteStatus:
  damlTypes.Serializable<RouteStatus> & {
  }
& { readonly keys: RouteStatus[] } & { readonly [e in RouteStatus]: e }
;


export declare type RuleType =
  | 'CTD'
  | 'ExpiryFirst'
  | 'YieldMax'
;

export declare const RuleType:
  damlTypes.Serializable<RuleType> & {
  }
& { readonly keys: RuleType[] } & { readonly [e in RuleType]: e }
;

