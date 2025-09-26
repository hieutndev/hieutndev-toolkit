interface nonAuthFetchOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    body?: any;
    cache?: RequestCache;
    revalidate?: number | false;
}
declare function serverFetch<T>(endpoint: string, options?: nonAuthFetchOptions): Promise<T>;

export { serverFetch };
