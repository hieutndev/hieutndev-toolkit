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

// hooks/useFetch.ts
var useFetch_exports = {};
__export(useFetch_exports, {
  useFetch: () => useFetch
});
module.exports = __toCommonJS(useFetch_exports);
var import_react = require("react");
var import_cookies_next = require("cookies-next");
var BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
var buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== void 0) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
var parseURL = (url, searchParams) => {
  if (!url) {
    throw new Error("URL is required");
  }
  let baseUrl;
  if (!url.includes("http") && url.startsWith("/")) {
    baseUrl = `${BASE_URL}${url}`;
  } else if (!url.includes("http")) {
    baseUrl = `${BASE_URL}/${url}`;
  } else {
    baseUrl = url;
  }
  if (searchParams && Object.keys(searchParams).length > 0) {
    const queryString = buildQueryString(searchParams);
    if (queryString) {
      if (baseUrl.includes("?")) {
        return `${baseUrl}&${queryString.substring(1)}`;
      } else {
        return `${baseUrl}${queryString}`;
      }
    }
  }
  return baseUrl;
};
async function refreshToken() {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("x-rftk", (0, import_cookies_next.getCookie)("refresh_token") || "");
  const response = await fetch(`${BASE_URL}/accounts/rftk`, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw new Error("RefreshTokenExpiredError");
  }
  const data = await response.json();
  (0, import_cookies_next.setCookie)("access_token", data.results.access_token, { path: "/" });
}
function useFetch(url, searchParamsOrOptions, options) {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL is not defined");
  }
  const isSearchParams = searchParamsOrOptions && typeof searchParamsOrOptions === "object" && !("method" in searchParamsOrOptions) && !("body" in searchParamsOrOptions) && !("headers" in searchParamsOrOptions) && !("skip" in searchParamsOrOptions) && !("options" in searchParamsOrOptions);
  const searchParams = isSearchParams ? searchParamsOrOptions : void 0;
  const rawOptions = isSearchParams ? options : searchParamsOrOptions;
  const finalOptions = (0, import_react.useMemo)(
    () => rawOptions || {},
    [
      rawOptions?.method,
      rawOptions?.skip,
      rawOptions?.options?.removeContentType,
      JSON.stringify(rawOptions?.headers || {})
      // Note: body is handled separately in fetchData to avoid serialization issues
    ]
  );
  const memoizedSearchParams = (0, import_react.useMemo)(
    () => searchParams,
    [JSON.stringify(searchParams || {})]
  );
  const [state, setState] = (0, import_react.useState)({
    data: null,
    loading: !finalOptions?.skip,
    error: null,
    statusCode: null
  });
  const parseFetchBody = (fetchBody) => {
    if (fetchBody instanceof FormData) {
      return fetchBody;
    }
    return JSON.stringify(fetchBody);
  };
  const fetchData = async (overrideOptions) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
      statusCode: null
    }));
    const mergedOptions = {
      ...finalOptions,
      ...overrideOptions,
      headers: {
        ...finalOptions?.headers,
        ...overrideOptions?.headers
      },
      body: overrideOptions?.body ?? rawOptions?.body
    };
    try {
      const response = await fetch(parseURL(url, memoizedSearchParams), {
        method: mergedOptions.method ?? "GET",
        headers: {
          ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
          Authorization: `Bearer ${(0, import_cookies_next.getCookie)("access_token") || ""}`,
          ...mergedOptions.headers || {}
        },
        body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
      });
      if (response.status === 401 && (0, import_cookies_next.hasCookie)("refresh_token")) {
        await refreshToken();
        const retryResponse = await fetch(parseURL(url, memoizedSearchParams), {
          method: mergedOptions.method ?? "GET",
          headers: {
            ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
            Authorization: `Bearer ${(0, import_cookies_next.getCookie)("access_token") || ""}`,
            ...mergedOptions.headers || {}
          },
          body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
        });
        if (!retryResponse.ok) {
          const errorText = await retryResponse.text();
          const defaultErrorMessage = "Server error occurred, please try again later or contact admin for more details";
          const errorMessage = errorText || retryResponse.statusText || defaultErrorMessage;
          setState({
            data: null,
            loading: false,
            error: errorMessage,
            statusCode: retryResponse.status
          });
          return;
        }
        const retryData = await retryResponse.json();
        setState({
          data: retryData,
          loading: false,
          error: null,
          statusCode: retryResponse.status
        });
        return;
      }
      if (!response.ok) {
        const responseText = await response.text();
        let errorJson = {};
        try {
          errorJson = JSON.parse(responseText || "{}");
        } catch {
        }
        const defaultErrorMessage = "Server error occurred, please try again later or contact admin for more details";
        const errorMessage = responseText || response.statusText || defaultErrorMessage;
        setState({
          data: null,
          loading: false,
          error: errorMessage,
          statusCode: response.status
        });
        if (errorJson.message === "NO_PERMISSION") {
          window.location.href = "/sign-in?message=NO_PERMISSION";
        }
        return;
      }
      const data = await response.json();
      setState({
        data,
        loading: false,
        error: null,
        statusCode: response.status
      });
    } catch (error) {
      if (error.message === "RefreshTokenExpiredError") {
        setState({ data: null, loading: false, error: null, statusCode: null });
        window.location.href = "/sign-in?message=EXPIRED_REFRESH_TOKEN";
      } else {
        const defaultErrorMessage = "Server error occurred, please try again later or contact admin for more details";
        const errorMessage = error.message || defaultErrorMessage;
        setState({ data: null, loading: false, error: errorMessage, statusCode: null });
      }
    }
  };
  (0, import_react.useEffect)(() => {
    if (!finalOptions?.skip) {
      fetchData();
    }
  }, [
    url,
    memoizedSearchParams,
    finalOptions.method,
    finalOptions.skip,
    finalOptions.options?.removeContentType,
    JSON.stringify(finalOptions.headers || {})
  ]);
  return { ...state, fetch: fetchData };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useFetch
});
