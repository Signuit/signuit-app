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


exports.SeedInput = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({operatorId: damlTypes.Party.decoder, institutionId: damlTypes.Party.decoder, counterpartyId: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    operatorId: damlTypes.Party.encode(__typed__.operatorId),
    institutionId: damlTypes.Party.encode(__typed__.institutionId),
    counterpartyId: damlTypes.Party.encode(__typed__.counterpartyId),
  };
}
,
};

