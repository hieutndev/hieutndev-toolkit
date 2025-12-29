// src/hooks/useFetch.ts
import { useEffect, useState, useMemo } from "react";
import { getCookie, hasCookie, setCookie } from "cookies-next";
var BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL;
var FALLBACK_URL_ON_TOKEN_EXPIRED = process.env.NEXT_PUBLIC_FALLBACK_URL_ON_TOKEN_EXPIRED || process.env.FALLBACK_URL_ON_TOKEN_EXPIRED || "/";
var REFRESH_TOKEN_ENDPOINT = process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT || process.env.REFRESH_TOKEN_ENDPOINT;
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
  headers.append("x-rftk", getCookie("refresh_token") || "");
  headers.append("Authorization", `Bearer ${getCookie("refresh_token") || ""}`);
  const response = await fetch(`${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw new Error("RefreshTokenExpiredError");
  }
  const data = await response.json();
  setCookie("access_token", data.results.access_token, { path: "/" });
  setCookie("refresh_token", data.results.refresh_token, { path: "/" });
}
function useFetch(url, searchParamsOrOptions, options) {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL/BASE_API_URL is not defined");
  }
  if (!REFRESH_TOKEN_ENDPOINT) {
    throw new Error(
      "NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT/REFRESH_TOKEN_ENDPOINT is not defined"
    );
  }
  const isSearchParams = searchParamsOrOptions && typeof searchParamsOrOptions === "object" && !("method" in searchParamsOrOptions) && !("body" in searchParamsOrOptions) && !("headers" in searchParamsOrOptions) && !("skip" in searchParamsOrOptions) && !("options" in searchParamsOrOptions);
  const searchParams = isSearchParams ? searchParamsOrOptions : void 0;
  const rawOptions = isSearchParams ? options : searchParamsOrOptions;
  const finalOptions = useMemo(
    () => rawOptions || {},
    [
      rawOptions?.method,
      rawOptions?.skip,
      rawOptions?.options?.removeContentType,
      JSON.stringify(rawOptions?.headers || {})
      // Note: body is handled separately in fetchData to avoid serialization issues
    ]
  );
  const memoizedSearchParams = useMemo(
    () => searchParams,
    [JSON.stringify(searchParams || {})]
  );
  const [state, setState] = useState({
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
    const requestUrl = mergedOptions.url ?? url;
    try {
      const response = await fetch(parseURL(requestUrl, memoizedSearchParams), {
        method: mergedOptions.method ?? "GET",
        headers: {
          ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
          Authorization: `Bearer ${getCookie("access_token") || ""}`,
          "x-TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...mergedOptions.headers || {}
        },
        body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
      });
      if (response.status === 401 && hasCookie("refresh_token")) {
        await refreshToken();
        const retryResponse = await fetch(
          parseURL(requestUrl, memoizedSearchParams),
          {
            method: mergedOptions.method ?? "GET",
            headers: {
              ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
              Authorization: `Bearer ${getCookie("access_token") || ""}`,
              "x-TimeZone": Intl.DateTimeFormat().resolvedOptions().timeZone,
              ...mergedOptions.headers || {}
            },
            body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
          }
        );
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
      if (response.status === 401 && !hasCookie("refresh_token")) {
        window.location.href = FALLBACK_URL_ON_TOKEN_EXPIRED;
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
      const defaultErrorMessage = "Server error occurred, please try again later or contact admin for more details";
      const errorMessage = error.message || defaultErrorMessage;
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        statusCode: null
      });
    }
  };
  useEffect(() => {
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
export {
  useFetch
};
