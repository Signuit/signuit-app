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
  templateIdWithPackageId: '45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931:CollateralRouter:CollateralHolding',
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


damlTypes.registerTemplate(exports.CollateralHolding, ['45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931', '#nexus-example']);



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
  templateIdWithPackageId: '45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931:CollateralRouter:MarginCall',
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


damlTypes.registerTemplate(exports.MarginCall, ['45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931', '#nexus-example']);



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
  templateIdWithPackageId: '45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931:CollateralRouter:AllocationRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, marginCallId: damlTypes.Text.decoder, assetsSent: damlTypes.List(damlTypes.Text).decoder, amountsSent: damlTypes.List(damlTypes.Numeric(10)).decoder, ruleApplied: damlTypes.Text.decoder, ctdSavingsBps: damlTypes.Numeric(10).decoder, approvedBy: damlTypes.Party.decoder, executedAt: damlTypes.Time.decoder, status: exports.RouteStatus.decoder, }); }),
  encode: function (__typed__) {
  return {
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    marginCallId: damlTypes.Text.encode(__typed__.marginCallId),
    assetsSent: damlTypes.List(damlTypes.Text).encode(__typed__.assetsSent),
    amountsSent: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.amountsSent),
    ruleApplied: damlTypes.Text.encode(__typed__.ruleApplied),
    ctdSavingsBps: damlTypes.Numeric(10).encode(__typed__.ctdSavingsBps),
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


damlTypes.registerTemplate(exports.AllocationRecord, ['45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931', '#nexus-example']);



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
  templateIdWithPackageId: '45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931:CollateralRouter:RoutingSuggestion',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({routeId: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, marginCallId: damlTypes.Text.decoder, amountRequired: damlTypes.Numeric(10).decoder, suggestedAssets: damlTypes.List(damlTypes.Text).decoder, suggestedAmounts: damlTypes.List(damlTypes.Numeric(10)).decoder, ctdSavings: damlTypes.Numeric(10).decoder, explanation: damlTypes.Text.decoder, status: exports.RouteStatus.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    routeId: damlTypes.Text.encode(__typed__.routeId),
    institution: damlTypes.Party.encode(__typed__.institution),
    marginCallId: damlTypes.Text.encode(__typed__.marginCallId),
    amountRequired: damlTypes.Numeric(10).encode(__typed__.amountRequired),
    suggestedAssets: damlTypes.List(damlTypes.Text).encode(__typed__.suggestedAssets),
    suggestedAmounts: damlTypes.List(damlTypes.Numeric(10)).encode(__typed__.suggestedAmounts),
    ctdSavings: damlTypes.Numeric(10).encode(__typed__.ctdSavings),
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


damlTypes.registerTemplate(exports.RoutingSuggestion, ['45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931', '#nexus-example']);



exports.ArchivePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.UpdatePolicy = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newRuleType: exports.RuleType.decoder, newPriorityList: damlTypes.List(damlTypes.Text).decoder, newMinLtv: damlTypes.Numeric(10).decoder, newMaxHaircut: damlTypes.Numeric(10).decoder, newActive: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    newRuleType: exports.RuleType.encode(__typed__.newRuleType),
    newPriorityList: damlTypes.List(damlTypes.Text).encode(__typed__.newPriorityList),
    newMinLtv: damlTypes.Numeric(10).encode(__typed__.newMinLtv),
    newMaxHaircut: damlTypes.Numeric(10).encode(__typed__.newMaxHaircut),
    newActive: damlTypes.Bool.encode(__typed__.newActive),
  };
}
,
};



exports.CollateralPolicy = damlTypes.assembleTemplate(
{
  templateId: '#nexus-example:CollateralRouter:CollateralPolicy',
  templateIdWithPackageId: '45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931:CollateralRouter:CollateralPolicy',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operator: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, policyId: damlTypes.Text.decoder, ruleType: exports.RuleType.decoder, priorityList: damlTypes.List(damlTypes.Text).decoder, minLtv: damlTypes.Numeric(10).decoder, maxHaircut: damlTypes.Numeric(10).decoder, active: damlTypes.Bool.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    operator: damlTypes.Party.encode(__typed__.operator),
    institution: damlTypes.Party.encode(__typed__.institution),
    policyId: damlTypes.Text.encode(__typed__.policyId),
    ruleType: exports.RuleType.encode(__typed__.ruleType),
    priorityList: damlTypes.List(damlTypes.Text).encode(__typed__.priorityList),
    minLtv: damlTypes.Numeric(10).encode(__typed__.minLtv),
    maxHaircut: damlTypes.Numeric(10).encode(__typed__.maxHaircut),
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


damlTypes.registerTemplate(exports.CollateralPolicy, ['45f66670fb2f7752c9c4a220ce4477b972bcad0642981883fdde676811db7931', '#nexus-example']);



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

