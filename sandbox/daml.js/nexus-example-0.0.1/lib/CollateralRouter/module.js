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
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:AllocationRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, counterparty: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Party).decoder), marginCallId: damlTypes.Text.decoder, assetsSent: damlTypes.List(damlTypes.Text).decoder, amountsSent: damlTypes.List(damlTypes.Numeric(10)).decoder, ruleApplied: damlTypes.Text.decoder, opportunityCostBps: damlTypes.Numeric(10).decoder, approvedBy: damlTypes.Party.decoder, executedAt: damlTypes.Time.decoder, status: exports.RouteStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    counterparty: damlTypes.Optional(damlTypes.Party).encode(__typed__.counterparty),
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
  Archive: {
    template: function () { return exports.AllocationRecord; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  MarkFailed: {
    template: function () { return exports.AllocationRecord; },
    choiceName: 'MarkFailed',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.MarkFailed.decoder; }),
    argumentEncode: function (__typed__) { return exports.MarkFailed.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AllocationRecord).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AllocationRecord).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AllocationRecord, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



exports.RejectSuggestion = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ApproveSuggestion = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({approvedBy: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    approvedBy: damlTypes.Party.encode(__typed__.approvedBy),
  };
}
,
};



exports.RoutingSuggestion = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:RoutingSuggestion',
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:RoutingSuggestion',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, counterparty: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Party).decoder), marginCallId: damlTypes.Text.decoder, amountRequired: damlTypes.Numeric(10).decoder, suggestedAssets: damlTypes.List(damlTypes.Text).decoder, suggestedAmounts: damlTypes.List(damlTypes.Numeric(10)).decoder, estimatedOpportunityCost: damlTypes.Numeric(10).decoder, opportunityCostBps: damlTypes.Numeric(10).decoder, alternativeOptions: damlTypes.List(exports.RoutingOption).decoder, expiryWarnings: damlTypes.List(damlTypes.Text).decoder, explanation: damlTypes.Text.decoder, status: exports.RouteStatus.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    operator: damlTypes.Party.encode(__typed__.operator),
    counterparty: damlTypes.Optional(damlTypes.Party).encode(__typed__.counterparty),
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


damlTypes.registerTemplate(exports.RoutingSuggestion, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



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
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:MarginCall',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({callId: damlTypes.Text.decoder, operator: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, counterparty: damlTypes.Party.decoder, amountRequired: damlTypes.Numeric(10).decoder, currency: damlTypes.Text.decoder, dueBy: damlTypes.Time.decoder, status: exports.RouteStatus.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    callId: damlTypes.Text.encode(__typed__.callId),
    operator: damlTypes.Party.encode(__typed__.operator),
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


damlTypes.registerTemplate(exports.MarginCall, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



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
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:CollateralHolding',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, holdingId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, asset: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, yield: damlTypes.Numeric(10).decoder, haircut: damlTypes.Numeric(10).decoder, expiry: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
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
  UpdateHolding: {
    template: function () { return exports.CollateralHolding; },
    choiceName: 'UpdateHolding',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateHolding.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateHolding.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CollateralHolding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CollateralHolding).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.CollateralHolding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CollateralHolding, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



exports.ArchivePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UpdateCollateralPolicy = {
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
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:CollateralPolicy',
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
  UpdateCollateralPolicy: {
    template: function () { return exports.CollateralPolicy; },
    choiceName: 'UpdateCollateralPolicy',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateCollateralPolicy.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateCollateralPolicy.encode(__typed__); },
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


damlTypes.registerTemplate(exports.CollateralPolicy, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



exports.UpdateServicePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newPolicy: exports.CollateralPolicy.decoder, }); }),
  encode: function (__typed__) {
  return {
    newPolicy: exports.CollateralPolicy.encode(__typed__.newPolicy),
  };
}
,
};



exports.TerminateAgreement = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.ServiceAgreement = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:ServiceAgreement',
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:ServiceAgreement',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, agreementId: damlTypes.Text.decoder, policy: exports.CollateralPolicy.decoder, tier: damlTypes.Text.decoder, status: exports.AgreementStatus.decoder, createdAt: damlTypes.Time.decoder, acceptedAt: jtv.Decoder.withDefault(null, damlTypes.Optional(damlTypes.Time).decoder), }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    institution: damlTypes.Party.encode(__typed__.institution),
    agreementId: damlTypes.Text.encode(__typed__.agreementId),
    policy: exports.CollateralPolicy.encode(__typed__.policy),
    tier: damlTypes.Text.encode(__typed__.tier),
    status: exports.AgreementStatus.encode(__typed__.status),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    acceptedAt: damlTypes.Optional(damlTypes.Time).encode(__typed__.acceptedAt),
  };
}
,
  TerminateAgreement: {
    template: function () { return exports.ServiceAgreement; },
    choiceName: 'TerminateAgreement',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TerminateAgreement.decoder; }),
    argumentEncode: function (__typed__) { return exports.TerminateAgreement.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ServiceAgreement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ServiceAgreement).encode(__typed__); },
  },
  UpdateServicePolicy: {
    template: function () { return exports.ServiceAgreement; },
    choiceName: 'UpdateServicePolicy',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateServicePolicy.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateServicePolicy.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ServiceAgreement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ServiceAgreement).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.ServiceAgreement; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.ServiceAgreement, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



exports.SetUnderReview = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.RejectRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({rejectionReason: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    rejectionReason: damlTypes.Text.encode(__typed__.rejectionReason),
  };
}
,
};



exports.AcceptRequest = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({agreementId: damlTypes.Text.decoder, approvedPolicy: exports.CollateralPolicy.decoder, }); }),
  encode: function (__typed__) {
  return {
    agreementId: damlTypes.Text.encode(__typed__.agreementId),
    approvedPolicy: exports.CollateralPolicy.encode(__typed__.approvedPolicy),
  };
}
,
};



exports.JoinRequest = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:JoinRequest',
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:JoinRequest',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({applicant: damlTypes.Party.decoder, operator: damlTypes.Party.decoder, companyName: damlTypes.Text.decoder, companyId: damlTypes.Text.decoder, requestedTier: damlTypes.Text.decoder, contactEmail: damlTypes.Text.decoder, submittedAt: damlTypes.Time.decoder, status: exports.OnboardingStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    applicant: damlTypes.Party.encode(__typed__.applicant),
    operator: damlTypes.Party.encode(__typed__.operator),
    companyName: damlTypes.Text.encode(__typed__.companyName),
    companyId: damlTypes.Text.encode(__typed__.companyId),
    requestedTier: damlTypes.Text.encode(__typed__.requestedTier),
    contactEmail: damlTypes.Text.encode(__typed__.contactEmail),
    submittedAt: damlTypes.Time.encode(__typed__.submittedAt),
    status: exports.OnboardingStatus.encode(__typed__.status),
  };
}
,
  AcceptRequest: {
    template: function () { return exports.JoinRequest; },
    choiceName: 'AcceptRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.ServiceAgreement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.ServiceAgreement).encode(__typed__); },
  },
  RejectRequest: {
    template: function () { return exports.JoinRequest; },
    choiceName: 'RejectRequest',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RejectRequest.decoder; }),
    argumentEncode: function (__typed__) { return exports.RejectRequest.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.JoinRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.JoinRequest).encode(__typed__); },
  },
  SetUnderReview: {
    template: function () { return exports.JoinRequest; },
    choiceName: 'SetUnderReview',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.SetUnderReview.decoder; }),
    argumentEncode: function (__typed__) { return exports.SetUnderReview.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.JoinRequest).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.JoinRequest).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.JoinRequest; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkg9e70a8b3510d617f8a136213f33d6a903a10ca0eeec76bb06ba55d1ed9680f69.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.JoinRequest, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



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
  templateIdWithPackageId: 'dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f:CollateralRouter:CollateralAssetMetadata',
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


damlTypes.registerTemplate(exports.CollateralAssetMetadata, ['dd067bd7c791f3881583bdd41a52e80dd1ca4acff5cef6a5981e6c5131ffca8f', '#nexus-example']);



exports.OnboardingStatus = {
  OnboardingPending: 'OnboardingPending',
  UnderReview: 'UnderReview',
  OnboardingApproved: 'OnboardingApproved',
  OnboardingRejected: 'OnboardingRejected',
  keys: ['OnboardingPending','UnderReview','OnboardingApproved','OnboardingRejected',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.OnboardingStatus.OnboardingPending), jtv.constant(exports.OnboardingStatus.UnderReview), jtv.constant(exports.OnboardingStatus.OnboardingApproved), jtv.constant(exports.OnboardingStatus.OnboardingRejected)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.AgreementStatus = {
  AgreementPending: 'AgreementPending',
  AgreementActive: 'AgreementActive',
  AgreementTerminated: 'AgreementTerminated',
  keys: ['AgreementPending','AgreementActive','AgreementTerminated',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AgreementStatus.AgreementPending), jtv.constant(exports.AgreementStatus.AgreementActive), jtv.constant(exports.AgreementStatus.AgreementTerminated)); }),
  encode: function (__typed__) { return __typed__; },
};



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
  RoutePending: 'RoutePending',
  RouteApproved: 'RouteApproved',
  RouteRejected: 'RouteRejected',
  RouteExecuted: 'RouteExecuted',
  RouteFailed: 'RouteFailed',
  keys: ['RoutePending','RouteApproved','RouteRejected','RouteExecuted','RouteFailed',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.RouteStatus.RoutePending), jtv.constant(exports.RouteStatus.RouteApproved), jtv.constant(exports.RouteStatus.RouteRejected), jtv.constant(exports.RouteStatus.RouteExecuted), jtv.constant(exports.RouteStatus.RouteFailed)); }),
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

