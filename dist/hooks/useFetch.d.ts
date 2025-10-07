type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
interface FetchOptions<TBody> {
    method?: HttpMethod;
    url?: string;
    body?: TBody;
    headers?: HeadersInit;
    skip?: boolean;
    options?: {
        removeContentType?: boolean;
    };
}
type SearchParams = Record<string, string | number | boolean | null | undefined>;
interface FetchState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    statusCode: number | null;
}
declare function useFetch<TResponse = any, TBody = any>(url: string, options?: FetchOptions<TBody>): FetchState<TResponse> & {
    fetch: (overrideOptions?: FetchOptions<TBody>) => Promise<void>;
};
declare function useFetch<TResponse = any, TBody = any>(url: string, searchParams?: SearchParams, options?: FetchOptions<TBody>): FetchState<TResponse> & {
    fetch: (overrideOptions?: FetchOptions<TBody>) => Promise<void>;
};

export { type HttpMethod, useFetch };
