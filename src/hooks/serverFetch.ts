const BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || process.env.BASE_API_URL;

interface serverFetchOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    headers?: HeadersInit;
    body?: any;
    cache?: RequestCache;
    revalidate?: number | false;
}

export async function serverFetch<T>(
    endpoint: string,
    options: serverFetchOptions = {}
): Promise<T> {
    const {
        method = "GET",
        headers = {},
        body,
        cache = "force-cache",
        revalidate
    } = options;

    if (!BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_API_URL/BASE_API_URL environment variable is not set");
    }

    const url = endpoint.startsWith("http") ? endpoint : `${BASE_URL}${endpoint}`;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        cache,
        ...(revalidate !== undefined && { next: { revalidate } }),
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
