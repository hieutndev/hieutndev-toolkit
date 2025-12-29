import { useEffect, useState, useMemo } from "react";
import { getCookie, hasCookie, setCookie } from "cookies-next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL;

const FALLBACK_URL_ON_TOKEN_EXPIRED =
  process.env.NEXT_PUBLIC_FALLBACK_URL_ON_TOKEN_EXPIRED ||
  process.env.FALLBACK_URL_ON_TOKEN_EXPIRED ||
  "/";

const REFRESH_TOKEN_ENDPOINT =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT ||
  process.env.REFRESH_TOKEN_ENDPOINT;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface FetchOptions<TBody> {
  method?: HttpMethod;
  url?: string;
  body?: TBody;
  headers?: HeadersInit;
  skip?: boolean; // skip fetch on mount,
  options?: {
    removeContentType?: boolean;
  };
}

type SearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  statusCode: number | null;
}

const buildQueryString = (params: SearchParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

const parseURL = (url: string, searchParams?: SearchParams) => {
  if (!url) {
    throw new Error("URL is required");
  }

  let baseUrl: string;

  if (!url.includes("http") && url.startsWith("/")) {
    baseUrl = `${BASE_URL}${url}`;
  } else if (!url.includes("http")) {
    baseUrl = `${BASE_URL}/${url}`;
  } else {
    baseUrl = url;
  }

  // Add query parameters if provided
  if (searchParams && Object.keys(searchParams).length > 0) {
    const queryString = buildQueryString(searchParams);

    if (queryString) {
      // Check if URL already has query parameters
      if (baseUrl.includes("?")) {
        // URL already has query params, append with &
        return `${baseUrl}&${queryString.substring(1)}`; // Remove the leading '?'
      } else {
        // URL doesn't have query params, append with ?
        return `${baseUrl}${queryString}`; // Keep the leading '?'
      }
    }
  }

  return baseUrl;
};

async function refreshToken() {
  const headers = new Headers();

  headers.append("Content-Type", "application/json");
  headers.append("x-rftk", (getCookie("refresh_token") as string) || "");
  headers.append("Authorization", `Bearer ${getCookie("refresh_token") || ""}`);

  const response = await fetch(`${BASE_URL}${REFRESH_TOKEN_ENDPOINT}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    throw new Error("RefreshTokenExpiredError");
  }

  const data = await response.json();

  setCookie("access_token", data.results.access_token, { path: "/" });
  setCookie("refresh_token", data.results.refresh_token, { path: "/" });
}

// Function overloads for backward compatibility
export function useFetch<TResponse = any, TBody = any>(
  url: string,
  options?: FetchOptions<TBody>
): FetchState<TResponse> & {
  fetch: (overrideOptions?: FetchOptions<TBody>) => Promise<void>;
};

export function useFetch<TResponse = any, TBody = any>(
  url: string,
  searchParams?: SearchParams,
  options?: FetchOptions<TBody>
): FetchState<TResponse> & {
  fetch: (overrideOptions?: FetchOptions<TBody>) => Promise<void>;
};

/**
 * Custom React hook for performing HTTP requests with flexible options and automatic token refresh handling.
 *
 * This hook provides a convenient way to fetch data from an API endpoint, supporting query parameters,
 * custom request options, and automatic handling of authentication tokens (including refresh on 401).
 * It manages loading, error, and response state, and exposes a `fetch` function for manual invocation.
 *
 * Template parameters
 * @template TResponse - The expected response data type.
 * @template TBody - The request body type.
 *
 * Parameters
 * @param url - The initial endpoint URL to fetch data from. This value is used unless an override is
 * provided when calling the returned `fetch` function.
 * @param searchParamsOrOptions - Either search parameters to append to the URL or fetch options.
 * @param options - Additional fetch options if search parameters are provided as the second argument.
 *
 * Return value
 * @returns An object containing:
 * - `data`: The response data or `null`.
 * - `loading`: Boolean indicating if the request is in progress.
 * - `error`: Error message or `null`.
 * - `statusCode`: HTTP status code or `null`.
 * - `fetch`: Function to manually trigger the fetch with optional override options.
 *
 * Override behavior
 * - The `fetch` function accepts `overrideOptions?: FetchOptions<TBody>`. If `overrideOptions.url` is
 *   provided, that URL will be used instead of the initial `url` passed to the hook. The hook will still
 *   append the memoized search parameters (if any) to the final request URL.
 * - When a 401 response triggers a token refresh, the same (possibly overridden) URL is used for the retry
 *   attempt.
 *
 * Examples
 * ```tsx
 * // Use hook with a fixed URL
 * const { data, loading, error, fetch } = useFetch<User[]>('/api/users');
 *
 * // Call fetch and override the url for this request only
 * fetch({ url: '/api/admin/users', method: 'GET' });
 * ```
 *
 * Remarks
 * - Automatically attaches `Authorization` header using `access_token` cookie.
 * - If a 401 response is received and a `refresh_token` cookie exists, attempts to refresh the token and retry.
 * - Redirects to sign-in page on permission errors or expired refresh tokens.
 * - Memoizes options and search parameters to prevent unnecessary re-fetches.
 */
export function useFetch<TResponse = any, TBody = any>(
  url: string,
  searchParamsOrOptions?: SearchParams | FetchOptions<TBody>,
  options?: FetchOptions<TBody>
) {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_BASE_API_URL/BASE_API_URL is not defined");
  }

  if (!REFRESH_TOKEN_ENDPOINT) {
    throw new Error(
      "NEXT_PUBLIC_REFRESH_TOKEN_ENDPOINT/REFRESH_TOKEN_ENDPOINT is not defined"
    );
  }

  // Determine if the second parameter is searchParams or options
  const isSearchParams =
    searchParamsOrOptions &&
    typeof searchParamsOrOptions === "object" &&
    !("method" in searchParamsOrOptions) &&
    !("body" in searchParamsOrOptions) &&
    !("headers" in searchParamsOrOptions) &&
    !("skip" in searchParamsOrOptions) &&
    !("options" in searchParamsOrOptions);

  const searchParams = isSearchParams
    ? (searchParamsOrOptions as SearchParams)
    : undefined;
  const rawOptions = isSearchParams
    ? options
    : (searchParamsOrOptions as FetchOptions<TBody>);

  // Memoize the final options to prevent unnecessary re-renders
  const finalOptions = useMemo(
    () => rawOptions || {},
    [
      rawOptions?.method,
      rawOptions?.skip,
      rawOptions?.options?.removeContentType,
      JSON.stringify(rawOptions?.headers || {}),
      // Note: body is handled separately in fetchData to avoid serialization issues
    ]
  );

  // Memoize searchParams to prevent unnecessary re-renders
  const memoizedSearchParams = useMemo(
    () => searchParams,
    [JSON.stringify(searchParams || {})]
  );

  const [state, setState] = useState<FetchState<TResponse>>({
    data: null,
    loading: !finalOptions?.skip,
    error: null,
    statusCode: null,
  });

  const parseFetchBody = (fetchBody: any) => {
    if (fetchBody instanceof FormData) {
      return fetchBody;
    }

    return JSON.stringify(fetchBody);
  };

  const fetchData = async (overrideOptions?: FetchOptions<TBody>) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
      statusCode: null,
    }));

    const mergedOptions = {
      ...finalOptions,
      ...overrideOptions,
      headers: {
        ...finalOptions?.headers,
        ...overrideOptions?.headers,
      },
      body: overrideOptions?.body ?? rawOptions?.body,
    };

    // allow overrideOptions to replace the initial url
    const requestUrl = mergedOptions.url ?? url;

    try {
      const response = await fetch(parseURL(requestUrl, memoizedSearchParams), {
        method: mergedOptions.method ?? "GET",
        headers: {
          ...(mergedOptions.options?.removeContentType
            ? {}
            : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${getCookie("access_token") || ""}`,
          "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          ...(mergedOptions.headers || {}),
        },
        body: mergedOptions.body
          ? parseFetchBody(mergedOptions.body)
          : undefined,
      });

      if (response.status === 401 && hasCookie("refresh_token")) {
        await refreshToken();

        const retryResponse = await fetch(
          parseURL(requestUrl, memoizedSearchParams),
          {
            method: mergedOptions.method ?? "GET",
            headers: {
              ...(mergedOptions.options?.removeContentType
                ? {}
                : { "Content-Type": "application/json" }),
              Authorization: `Bearer ${getCookie("access_token") || ""}`,
              "x-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
              ...(mergedOptions.headers || {}),
            },
            body: mergedOptions.body
              ? parseFetchBody(mergedOptions.body)
              : undefined,
          }
        );

        if (!retryResponse.ok) {
          const errorText = await retryResponse.text();
          const defaultErrorMessage =
            "Server error occurred, please try again later or contact admin for more details";
          const errorMessage =
            errorText || retryResponse.statusText || defaultErrorMessage;

          setState({
            data: null,
            loading: false,
            error: errorMessage,
            statusCode: retryResponse.status,
          });

          return;
        }

        const retryData = await retryResponse.json();

        setState({
          data: retryData,
          loading: false,
          error: null,
          statusCode: retryResponse.status,
        });

        return;
      }

      if (response.status === 401 && !hasCookie("refresh_token")) {
        window.location.href = FALLBACK_URL_ON_TOKEN_EXPIRED;
        return;
      }

      if (!response.ok) {
        const responseText = await response.text();

        let errorJson: any = {};
        try {
          errorJson = JSON.parse(responseText || "{}");
        } catch {
          // If response is not valid JSON, keep errorJson as empty object
        }

        const defaultErrorMessage =
          "Server error occurred, please try again later or contact admin for more details";
        const errorMessage =
          responseText || response.statusText || defaultErrorMessage;

        setState({
          data: null,
          loading: false,
          error: errorMessage,
          statusCode: response.status,
        });

        return;
      }

      const data = await response.json();

      setState({
        data,
        loading: false,
        error: null,
        statusCode: response.status,
      });
    } catch (error: any) {
      const defaultErrorMessage =
        "Server error occurred, please try again later or contact admin for more details";
      const errorMessage = error.message || defaultErrorMessage;
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        statusCode: null,
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
    JSON.stringify(finalOptions.headers || {}),
  ]);

  return { ...state, fetch: fetchData };
}
