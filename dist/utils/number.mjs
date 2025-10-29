import "./chunk-Y6FXYEAI.mjs";

// src/utils/number.ts
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
export {
  makeShorthandNumber
};
