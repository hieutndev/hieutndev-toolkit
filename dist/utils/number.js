"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/number.ts
var number_exports = {};
__export(number_exports, {
  makeShorthandNumber: () => makeShorthandNumber
});
module.exports = __toCommonJS(number_exports);
function makeShorthandNumber(num, toFixed = 1, isUpperCase = false) {
  const suffixes = isUpperCase ? ["K", "M", "B", "T", "P", "E", "Z", "Y"] : ["k", "m", "b", "t", "p", "e", "z", "y"];
  if (num >= 1e24) {
    return (num / 1e24).toFixed(toFixed) + suffixes[3];
  } else if (num >= 1e21) {
    return (num / 1e21).toFixed(toFixed) + suffixes[4];
  } else if (num >= 1e18) {
    return (num / 1e18).toFixed(toFixed) + suffixes[5];
  } else if (num >= 1e15) {
    return (num / 1e15).toFixed(toFixed) + suffixes[6];
  } else if (num >= 1e12) {
    return (num / 1e12).toFixed(toFixed) + suffixes[7];
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(toFixed) + suffixes[8];
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(toFixed) + suffixes[1];
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(toFixed) + suffixes[0];
  } else {
    return num.toString().toLowerCase().trim();
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  makeShorthandNumber
});
