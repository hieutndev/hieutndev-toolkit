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

// utils/date.ts
var date_exports = {};
__export(date_exports, {
  formatDate: () => formatDate,
  formatTime: () => formatTime,
  getDiffTime: () => getDiffTime,
  getLastTimeString: () => getLastTimeString,
  getMonthYearName: () => getMonthYearName
});
module.exports = __toCommonJS(date_exports);
function formatDate(isoString, format = "fullDate") {
  const date = new Date(isoString);
  const pad = (num) => num.toString().padStart(2, "0");
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  switch (format) {
    case "fullDate":
      return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
    case "onlyDate":
      return `${day}/${month}/${year}`;
    case "onlyMonthYear":
      return `${month}/${year}`;
    case "onlyDateReverse":
      return `${year}-${month}-${day}`;
    case "onlyTime":
      return `${hours}:${minutes}:${seconds}`;
  }
}
function getMonthYearName(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
}
function getLastTimeString(isoString) {
  const lastUpdatedTime = new Date(isoString);
  const currentTime = /* @__PURE__ */ new Date();
  const diffInSeconds = Math.floor((currentTime.getTime() - lastUpdatedTime.getTime()) / 1e3);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  } else {
    return `${diffInSeconds} second${diffInSeconds > 1 ? "s" : ""} ago`;
  }
}
function getDiffTime(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInSeconds = Math.floor((end.getTime() - start.getTime()) / 1e3);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  return {
    days: diffInDays,
    hours: diffInHours % 24,
    minutes: diffInMinutes % 60,
    seconds: diffInSeconds % 60
  };
}
function formatTime(seconds, format = "fullTime") {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor(seconds % 3600 / 60);
  const remainingSeconds = seconds % 60;
  switch (format) {
    case "fullTime":
      return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
    case "onlyHours":
      return `${hours}h`;
    case "onlyMinutes":
      return `${minutes}m`;
    case "onlySeconds":
      return `${remainingSeconds}s`;
    case "onlyHourAndMinute":
      return `${hours}h ${minutes}m`;
    case "onlyMinuteAndSecond":
      return `${minutes}m ${remainingSeconds}s`;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatDate,
  formatTime,
  getDiffTime,
  getLastTimeString,
  getMonthYearName
});
