interface serverFetchOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    body?: any;
    cache?: RequestCache;
    revalidate?: number | false;
}
declare function serverFetch<T>(endpoint: string, options?: serverFetchOptions): Promise<T>;

export { serverFetch };
