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

// hooks/serverFetch.ts
var serverFetch_exports = {};
__export(serverFetch_exports, {
  serverFetch: () => serverFetch
});
module.exports = __toCommonJS(serverFetch_exports);
var BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
async function serverFetch(endpoint, options = {}) {
  const {
    method = "GET",
    headers = {},
    body,
    cache = "force-cache",
    revalidate
  } = options;
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL environment variable is not set");
  }
  const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    cache,
    ...revalidate !== void 0 && { next: { revalidate } }
  };
  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      return response.json();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch error: ${error}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  serverFetch
});
