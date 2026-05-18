import { loadStoredSession } from "./auth";

const API_BASE_URL = "https://laganlakshmiinfra.com";

function extractListData(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data?.data?.data && Array.isArray(data.data.data)) {
    return data.data.data;
  }

  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

function extractObjectData(data) {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
      return data.data;
    }

    return data;
  }

  return null;
}

async function fetchFromEndpoints(endpoints, options = {}) {
  const session = loadStoredSession();
  const token = options.token ?? session?.token ?? "";
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.headers || {}),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in again to continue.");
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Failed to fetch data.");
}

export function makeAbsoluteUrl(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}

export async function fetchAllListings() {
  const response = await fetch("/api/listings");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return extractListData(data);
}

export async function fetchFeaturedListings() {
  const endpoints = [
    "/api/listings/featured",
    "https://laganlakshmiinfra.com/api/listings/featured",
  ];
  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(
            `Server error: featured listings API returned ${response.status}.`,
          );
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return extractListData(data);
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(
    lastError?.message ||
      "Failed to fetch featured properties. Please try again later.",
  );
}

export async function fetchListingById(id) {
  const listings = await fetchAllListings();
  return listings.find((item) => String(item?.id) === String(id)) || null;
}

export async function fetchPropertyById(id) {
  const data = await fetchFromEndpoints([
    `/api/properties/${id}`,
    `${API_BASE_URL}/api/properties/${id}`,
  ]);

  return extractObjectData(data);
}

export async function fetchProfile() {
  const data = await fetchFromEndpoints([
    "/api/profile",
    `${API_BASE_URL}/api/profile`,
  ]);

  return extractObjectData(data);
}

export async function fetchProfileProperties() {
  const data = await fetchFromEndpoints([
    "/api/profile/properties",
    `${API_BASE_URL}/api/profile/properties`,
  ]);

  return extractListData(data);
}
