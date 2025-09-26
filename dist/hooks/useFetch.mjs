// hooks/useFetch.ts
import { useEffect, useState, useMemo } from "react";
import { getCookie, hasCookie, setCookie } from "cookies-next";
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
  headers.append("x-rftk", getCookie("refresh_token") || "");
  const response = await fetch(`${BASE_URL}/accounts/rftk`, {
    method: "GET",
    headers
  });
  if (!response.ok) {
    throw new Error("RefreshTokenExpiredError");
  }
  const data = await response.json();
  setCookie("access_token", data.results.access_token, { path: "/" });
}
function useFetch(url, searchParamsOrOptions, options) {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL is not defined");
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
    try {
      const response = await fetch(parseURL(url, memoizedSearchParams), {
        method: mergedOptions.method ?? "GET",
        headers: {
          ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
          Authorization: `Bearer ${getCookie("access_token") || ""}`,
          ...mergedOptions.headers || {}
        },
        body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
      });
      if (response.status === 401 && hasCookie("refresh_token")) {
        await refreshToken();
        const retryResponse = await fetch(parseURL(url, memoizedSearchParams), {
          method: mergedOptions.method ?? "GET",
          headers: {
            ...mergedOptions.options?.removeContentType ? {} : { "Content-Type": "application/json" },
            Authorization: `Bearer ${getCookie("access_token") || ""}`,
            ...mergedOptions.headers || {}
          },
          body: mergedOptions.body ? parseFetchBody(mergedOptions.body) : void 0
        });
        if (!retryResponse.ok) {
          const errorText = await retryResponse.text();
          setState({
            data: null,
            loading: false,
            error: errorText || retryResponse.statusText,
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
        const errorJson = JSON.parse(responseText || "{}");
        setState({
          data: null,
          loading: false,
          error: responseText || response.statusText,
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
        setState({ data: null, loading: false, error: error.message, statusCode: null });
      }
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
