// hooks/serverFetch.ts
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
export {
  serverFetch
};
