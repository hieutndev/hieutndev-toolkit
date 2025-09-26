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

// utils/string.ts
var string_exports = {};
__export(string_exports, {
  emailMasking: () => emailMasking,
  generateSlug: () => generateSlug,
  generateUniqueStringClient: () => generateUniqueStringClient,
  generateUniqueStringServer: () => generateUniqueStringServer,
  isValidSlug: () => isValidSlug,
  sliceText: () => sliceText
});
module.exports = __toCommonJS(string_exports);
function emailMasking(email, localChars, domainChars) {
  if (!email.includes("@")) {
    return "Invalid email";
  }
  const [localPart, ...domainParts] = email.split("@", 2);
  const domain = domainParts.join("@");
  let maskedLocal;
  if (localPart.length <= localChars) {
    maskedLocal = "*".repeat(localPart.length);
  } else {
    maskedLocal = localPart.substring(0, localChars) + "*".repeat(localPart.length - localChars);
  }
  const domainSplit = domain.split(".");
  const domainName = domainSplit[0];
  let maskedDomain;
  if (domainName.length > domainChars) {
    maskedDomain = domainName.substring(0, domainChars) + "*".repeat(domainName.length - domainChars);
  } else {
    maskedDomain = domainName;
  }
  const maskedFullDomain = [maskedDomain, ...domainSplit.slice(1)].join(".");
  return maskedLocal + "@" + maskedFullDomain;
}
function generateUniqueStringClient(size = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
function generateUniqueStringServer(size = 32) {
  const crypto = require("crypto");
  return crypto.randomBytes(size).toString("hex");
}
var sliceText = (text, numsSlice = 4) => {
  const parseText = text.toString();
  return parseText.length <= numsSlice ? parseText : parseText.slice(0, numsSlice) + "...";
};
function generateSlug(text) {
  if (!text) return "";
  const vietnameseDiacritics = {
    // a
    "\xE0": "a",
    "\xE1": "a",
    "\u1EA1": "a",
    "\u1EA3": "a",
    "\xE3": "a",
    "\xE2": "a",
    "\u1EA7": "a",
    "\u1EA5": "a",
    "\u1EAD": "a",
    "\u1EA9": "a",
    "\u1EAB": "a",
    "\u0103": "a",
    "\u1EB1": "a",
    "\u1EAF": "a",
    "\u1EB7": "a",
    "\u1EB3": "a",
    "\u1EB5": "a",
    "\xC0": "A",
    "\xC1": "A",
    "\u1EA0": "A",
    "\u1EA2": "A",
    "\xC3": "A",
    "\xC2": "A",
    "\u1EA6": "A",
    "\u1EA4": "A",
    "\u1EAC": "A",
    "\u1EA8": "A",
    "\u1EAA": "A",
    "\u0102": "A",
    "\u1EB0": "A",
    "\u1EAE": "A",
    "\u1EB6": "A",
    "\u1EB2": "A",
    "\u1EB4": "A",
    // e
    "\xE8": "e",
    "\xE9": "e",
    "\u1EB9": "e",
    "\u1EBB": "e",
    "\u1EBD": "e",
    "\xEA": "e",
    "\u1EC1": "e",
    "\u1EBF": "e",
    "\u1EC7": "e",
    "\u1EC3": "e",
    "\u1EC5": "e",
    "\xC8": "E",
    "\xC9": "E",
    "\u1EB8": "E",
    "\u1EBA": "E",
    "\u1EBC": "E",
    "\xCA": "E",
    "\u1EC0": "E",
    "\u1EBE": "E",
    "\u1EC6": "E",
    "\u1EC2": "E",
    "\u1EC4": "E",
    // i
    "\xEC": "i",
    "\xED": "i",
    "\u1ECB": "i",
    "\u1EC9": "i",
    "\u0129": "i",
    "\xCC": "I",
    "\xCD": "I",
    "\u1ECA": "I",
    "\u1EC8": "I",
    "\u0128": "I",
    // o
    "\xF2": "o",
    "\xF3": "o",
    "\u1ECD": "o",
    "\u1ECF": "o",
    "\xF5": "o",
    "\xF4": "o",
    "\u1ED3": "o",
    "\u1ED1": "o",
    "\u1ED9": "o",
    "\u1ED5": "o",
    "\u1ED7": "o",
    "\u01A1": "o",
    "\u1EDD": "o",
    "\u1EDB": "o",
    "\u1EE3": "o",
    "\u1EDF": "o",
    "\u1EE1": "o",
    "\xD2": "O",
    "\xD3": "O",
    "\u1ECC": "O",
    "\u1ECE": "O",
    "\xD5": "O",
    "\xD4": "O",
    "\u1ED2": "O",
    "\u1ED0": "O",
    "\u1ED8": "O",
    "\u1ED4": "O",
    "\u1ED6": "O",
    "\u01A0": "O",
    "\u1EDC": "O",
    "\u1EDA": "O",
    "\u1EE2": "O",
    "\u1EDE": "O",
    "\u1EE0": "O",
    // u
    "\xF9": "u",
    "\xFA": "u",
    "\u1EE5": "u",
    "\u1EE7": "u",
    "\u0169": "u",
    "\u01B0": "u",
    "\u1EEB": "u",
    "\u1EE9": "u",
    "\u1EF1": "u",
    "\u1EED": "u",
    "\u1EEF": "u",
    "\xD9": "U",
    "\xDA": "U",
    "\u1EE4": "U",
    "\u1EE6": "U",
    "\u0168": "U",
    "\u01AF": "U",
    "\u1EEA": "U",
    "\u1EE8": "U",
    "\u1EF0": "U",
    "\u1EEC": "U",
    "\u1EEE": "U",
    // y
    "\u1EF3": "y",
    "\xFD": "y",
    "\u1EF5": "y",
    "\u1EF7": "y",
    "\u1EF9": "y",
    "\u1EF2": "Y",
    "\xDD": "Y",
    "\u1EF4": "Y",
    "\u1EF6": "Y",
    "\u1EF8": "Y",
    // d
    "\u0111": "d",
    "\u0110": "D"
  };
  let slug = text;
  for (const [diacritic, replacement] of Object.entries(vietnameseDiacritics)) {
    slug = slug.replace(new RegExp(diacritic, "g"), replacement);
  }
  slug = slug.toLowerCase();
  slug = slug.replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return slug;
}
function isValidSlug(slug) {
  if (!slug) return false;
  const slugRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  emailMasking,
  generateSlug,
  generateUniqueStringClient,
  generateUniqueStringServer,
  isValidSlug,
  sliceText
});
