"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');

var pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4 = require('@daml.js/daml-prim-DA-Types-1.0.0');
var pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69 = require('@daml.js/ghc-stdlib-DA-Internal-Template-1.0.0');


exports.UpdateHolding = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newAmount: damlTypes.Numeric(10).encode(__typed__.newAmount),
  };
}
,
};



exports.CollateralHolding = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:CollateralHolding',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:CollateralHolding',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({holdingId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, asset: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, yield: damlTypes.Numeric(10).decoder, haircut: damlTypes.Numeric(10).decoder, expiry: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), }); }),
  encode: function (__typed__) {
  return {
    holdingId: damlTypes.Text.encode(__typed__.holdingId),
    institution: damlTypes.Party.encode(__typed__.institution),
    asset: damlTypes.Text.encode(__typed__.asset),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    yield: damlTypes.Numeric(10).encode(__typed__.yield),
    haircut: damlTypes.Numeric(10).encode(__typed__.haircut),
    expiry: damlTypes.Optional(damlTypes.Time).encode(__typed__.expiry),
  };
}
,
  Archive: {
    template: function () { return exports.CollateralHolding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  UpdateHolding: {
    template: function () { return exports.CollateralHolding; },
    choiceName: 'UpdateHolding',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateHolding.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateHolding.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralHolding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralHolding).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CollateralHolding, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.SatisfyMarginCall = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.MarginCall = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:MarginCall',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:MarginCall',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({callId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, counterparty: damlTypes.Party.decoder, amountRequired: damlTypes.Numeric(10).decoder, currency: damlTypes.Text.decoder, dueBy: damlTypes.Time.decoder, status: exports.RouteStatus.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    callId: damlTypes.Text.encode(__typed__.callId),
    institution: damlTypes.Party.encode(__typed__.institution),
    counterparty: damlTypes.Party.encode(__typed__.counterparty),
    amountRequired: damlTypes.Numeric(10).encode(__typed__.amountRequired),
    currency: damlTypes.Text.encode(__typed__.currency),
    dueBy: damlTypes.Time.encode(__typed__.dueBy),
    status: exports.RouteStatus.encode(__typed__.status),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  SatisfyMarginCall: {
    template: function () { return exports.MarginCall; },
    choiceName: 'SatisfyMarginCall',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SatisfyMarginCall.decoder; }),
    argumentEncode: function (__typed__) { return exports.SatisfyMarginCall.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.MarginCall).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.MarginCall).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.MarginCall; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.MarginCall, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.MarkFailed = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.AllocationRecord = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:AllocationRecord',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:AllocationRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, marginCallId: damlTypes.Text.decoder, assetsSent: damlTypes.List(damlTypes.Text).decoder, amountsSent: damlTypes.List(damlTypes.Numeric(10)).decoder, ruleApplied: damlTypes.Text.decoder, opportunityCostBps: damlTypes.Numeric(10).decoder, approvedBy: damlTypes.Party.decoder, executedAt: damlTypes.Time.decoder, status: exports.RouteStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    marginCallId: damlTypes.Text.encode(__typed__.marginCallId),
    assetsSent: damlTypes.List(damlTypes.Text).encode(__typed__.assetsSent),
    amountsSent: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.amountsSent),
    ruleApplied: damlTypes.Text.encode(__typed__.ruleApplied),
    opportunityCostBps: damlTypes.Numeric(10).encode(__typed__.opportunityCostBps),
    approvedBy: damlTypes.Party.encode(__typed__.approvedBy),
    executedAt: damlTypes.Time.encode(__typed__.executedAt),
    status: exports.RouteStatus.encode(__typed__.status),
  };
}
,
  MarkFailed: {
    template: function () { return exports.AllocationRecord; },
    choiceName: 'MarkFailed',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkFailed.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkFailed.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationRecord).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationRecord).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AllocationRecord; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AllocationRecord, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.RejectSuggestion = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ApproveSuggestion = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RoutingSuggestion = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:RoutingSuggestion',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:RoutingSuggestion',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, marginCallId: damlTypes.Text.decoder, amountRequired: damlTypes.Numeric(10).decoder, suggestedAssets: damlTypes.List(damlTypes.Text).decoder, suggestedAmounts: damlTypes.List(damlTypes.Numeric(10)).decoder, estimatedOpportunityCost: damlTypes.Numeric(10).decoder, opportunityCostBps: damlTypes.Numeric(10).decoder, alternativeOptions: damlTypes.List(exports.RoutingOption).decoder, expiryWarnings: damlTypes.List(damlTypes.Text).decoder, explanation: damlTypes.Text.decoder, status: exports.RouteStatus.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    marginCallId: damlTypes.Text.encode(__typed__.marginCallId),
    amountRequired: damlTypes.Numeric(10).encode(__typed__.amountRequired),
    suggestedAssets: damlTypes.List(damlTypes.Text).encode(__typed__.suggestedAssets),
    suggestedAmounts: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.suggestedAmounts),
    estimatedOpportunityCost: damlTypes.Numeric(10).encode(__typed__.estimatedOpportunityCost),
    opportunityCostBps: damlTypes.Numeric(10).encode(__typed__.opportunityCostBps),
    alternativeOptions: damlTypes.List(exports.RoutingOption).encode(__typed__.alternativeOptions),
    expiryWarnings: damlTypes.List(damlTypes.Text).encode(__typed__.expiryWarnings),
    explanation: damlTypes.Text.encode(__typed__.explanation),
    status: exports.RouteStatus.encode(__typed__.status),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  ApproveSuggestion: {
    template: function () { return exports.RoutingSuggestion; },
    choiceName: 'ApproveSuggestion',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ApproveSuggestion.decoder; }),
    argumentEncode: function (__typed__) { return exports.ApproveSuggestion.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationRecord).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationRecord).encode(__typed__); },
  },
  RejectSuggestion: {
    template: function () { return exports.RoutingSuggestion; },
    choiceName: 'RejectSuggestion',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectSuggestion.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectSuggestion.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.RoutingSuggestion; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.RoutingSuggestion, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.ArchivePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UpdatePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newRuleType: exports.RuleType.decoder, newPriorityList: damlTypes.List(damlTypes.Text).decoder, newMinLtv: damlTypes.Numeric(10).decoder, newMaxHaircut: damlTypes.Numeric(10).decoder, newCounterpartyRules: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(damlTypes.Text))).decoder, newAutoApprove: damlTypes.Bool.decoder, newNotificationEmail: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), newActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    newRuleType: exports.RuleType.encode(__typed__.newRuleType),
    newPriorityList: damlTypes.List(damlTypes.Text).encode(__typed__.newPriorityList),
    newMinLtv: damlTypes.Numeric(10).encode(__typed__.newMinLtv),
    newMaxHaircut: damlTypes.Numeric(10).encode(__typed__.newMaxHaircut),
    newCounterpartyRules: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(damlTypes.Text))).encode(__typed__.newCounterpartyRules),
    newAutoApprove: damlTypes.Bool.encode(__typed__.newAutoApprove),
    newNotificationEmail: damlTypes.Optional(damlTypes.Text).encode(__typed__.newNotificationEmail),
    newActive: damlTypes.Bool.encode(__typed__.newActive),
  };
}
,
};



exports.CollateralPolicy = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:CollateralPolicy',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:CollateralPolicy',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, policyId: damlTypes.Text.decoder, ruleType: exports.RuleType.decoder, priorityList: damlTypes.List(damlTypes.Text).decoder, minLtv: damlTypes.Numeric(10).decoder, maxHaircut: damlTypes.Numeric(10).decoder, counterpartyRules: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(damlTypes.Text))).decoder, autoApprove: damlTypes.Bool.decoder, notificationEmail: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Text).decoder), active: damlTypes.Bool.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    institution: damlTypes.Party.encode(__typed__.institution),
    policyId: damlTypes.Text.encode(__typed__.policyId),
    ruleType: exports.RuleType.encode(__typed__.ruleType),
    priorityList: damlTypes.List(damlTypes.Text).encode(__typed__.priorityList),
    minLtv: damlTypes.Numeric(10).encode(__typed__.minLtv),
    maxHaircut: damlTypes.Numeric(10).encode(__typed__.maxHaircut),
    counterpartyRules: damlTypes.List(pkg5aee9b21b8e9a4c4975b5f4c4198e6e6e8469df49e2010820e792f393db870f4.DA.Types.Tuple2(damlTypes.Text, damlTypes.List(damlTypes.Text))).encode(__typed__.counterpartyRules),
    autoApprove: damlTypes.Bool.encode(__typed__.autoApprove),
    notificationEmail: damlTypes.Optional(damlTypes.Text).encode(__typed__.notificationEmail),
    active: damlTypes.Bool.encode(__typed__.active),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  UpdatePolicy: {
    template: function () { return exports.CollateralPolicy; },
    choiceName: 'UpdatePolicy',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdatePolicy.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdatePolicy.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralPolicy).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralPolicy).encode(__typed__); },
  },
  ArchivePolicy: {
    template: function () { return exports.CollateralPolicy; },
    choiceName: 'ArchivePolicy',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ArchivePolicy.decoder; }),
    argumentEncode: function (__typed__) { return exports.ArchivePolicy.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.CollateralPolicy; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CollateralPolicy, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.UpdateMetadata = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newYield: damlTypes.Numeric(10).decoder, newHaircut: damlTypes.Numeric(10).decoder, newEligible: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    newYield: damlTypes.Numeric(10).encode(__typed__.newYield),
    newHaircut: damlTypes.Numeric(10).encode(__typed__.newHaircut),
    newEligible: damlTypes.Bool.encode(__typed__.newEligible),
  };
}
,
};



exports.CollateralAssetMetadata = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:CollateralAssetMetadata',
  templateIdWithPackageId: '60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014:CollateralRouter:CollateralAssetMetadata',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, assetSymbol: damlTypes.Text.decoder, currentYield: damlTypes.Numeric(10).decoder, haircut: damlTypes.Numeric(10).decoder, eligible: damlTypes.Bool.decoder, updatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    currentYield: damlTypes.Numeric(10).encode(__typed__.currentYield),
    haircut: damlTypes.Numeric(10).encode(__typed__.haircut),
    eligible: damlTypes.Bool.encode(__typed__.eligible),
    updatedAt: damlTypes.Time.encode(__typed__.updatedAt),
  };
}
,
  UpdateMetadata: {
    template: function () { return exports.CollateralAssetMetadata; },
    choiceName: 'UpdateMetadata',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateMetadata.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateMetadata.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralAssetMetadata).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralAssetMetadata).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.CollateralAssetMetadata; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CollateralAssetMetadata, ['60705d2991761bae50c8489f1d5ee0bfdbf3cb1e338321950a536f2bd220f014', '#nexus-example']);



exports.RoutingOption = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assets: damlTypes.List(damlTypes.Text).decoder, amounts: damlTypes.List(damlTypes.Numeric(10)).decoder, savings: damlTypes.Numeric(10).decoder, label: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    assets: damlTypes.List(damlTypes.Text).encode(__typed__.assets),
    amounts: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.amounts),
    savings: damlTypes.Numeric(10).encode(__typed__.savings),
    label: damlTypes.Text.encode(__typed__.label),
  };
}
,
};



exports.RouteStatus = {
  Pending: 'Pending',
  Approved: 'Approved',
  Rejected: 'Rejected',
  Executed: 'Executed',
  Failed: 'Failed',
  keys: ['Pending','Approved','Rejected','Executed','Failed',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.RouteStatus.Pending), jtv.constant(exports.RouteStatus.Approved), jtv.constant(exports.RouteStatus.Rejected), jtv.constant(exports.RouteStatus.Executed), jtv.constant(exports.RouteStatus.Failed)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.RuleType = {
  CTD: 'CTD',
  ExpiryFirst: 'ExpiryFirst',
  YieldMax: 'YieldMax',
  keys: ['CTD','ExpiryFirst','YieldMax',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.RuleType.CTD), jtv.constant(exports.RuleType.ExpiryFirst), jtv.constant(exports.RuleType.YieldMax)); }),
  encode: function (__typed__) { return __typed__; },
};

