// Centralized API client for Django backend
// - Always sends HttpOnly cookies (credentials: "include")
// - Auto-refreshes access cookie on 401, then retries once
// - Normalizes NEXT_PUBLIC_API_BASE_URL

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function normalizeBaseUrl(base) {
  if (!base) return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

export const API_BASE = normalizeBaseUrl(RAW_API_BASE);

function ensureLeadingSlash(path) {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

async function tryRefresh() {
  if (!API_BASE) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh/`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * apiFetch(path, options)
 *
 * Usage:
 *   const res = await apiFetch("/admin/users/");
 *   const data = await res.json();
 *
 * Notes:
 * - `path` should be backend path WITHOUT the `/api` prefix if your API_BASE already includes it.
 *   Example: if NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api", then use "/admin/users/".
 */
export async function apiFetch(path, options = {}) {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not set. Example: http://localhost:8000/api"
    );
  }

  const url = `${API_BASE}${ensureLeadingSlash(path)}`;

  const baseOptions = {
    credentials: "include",
    cache: "no-store",
    ...options,
    headers: {
      ...(options.headers || {}),
    },
  };

  // If we send a body and no Content-Type was provided, default to JSON.
  const hasBody = typeof baseOptions.body !== "undefined";
  const headers = new Headers(baseOptions.headers);
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  baseOptions.headers = Object.fromEntries(headers.entries());

  // If Content-Type is JSON and body is a plain object, stringify it
  const ct = headers.get("Content-Type") || "";
  const body = baseOptions.body;
  const isNonJsonBody =
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer;

  if (
    hasBody &&
    ct.includes("application/json") &&
    body !== null &&
    typeof body === "object" &&
    !isNonJsonBody
  ) {
    baseOptions.body = JSON.stringify(body);
  }

  // 1) First attempt
  let res = await fetch(url, baseOptions);

  // 2) If unauthorized, refresh then retry once
  if (res.status === 401) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      res = await fetch(url, baseOptions);
    }
  }

  return res;
}

/**
 * Convenience helper for JSON requests.
 * Returns parsed JSON (or throws with a readable error message).
 */
export async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      payload?.detail ||
      payload?.message ||
      `API request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return payload;
}

// ==============================
// Domain helpers (public)
// ==============================

function asList(payload) {
  if (!payload) return [];
  // DRF pagination commonly returns { count, next, previous, results }
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

/**
 * Fetch published realisations (public endpoint).
 * Works with both non-paginated ([]) and paginated ({ results: [] }) DRF responses.
 *
 * Options:
 * - limit: number (optional) -> slice client-side for reliability
 */
export async function getRealisations(options = {}) {
  const { limit } = options;

  // Do NOT assume filtering/pagination query params exist.
  // Fetch the list and slice client-side for now.
  const payload = await apiJson("/realisations/");
  const items = asList(payload);

  if (typeof limit === "number") {
    return items.slice(0, Math.max(0, limit));
  }

  return items;
}

/**
 * Fetch a single realisation by slug (public endpoint).
 */
export async function getRealisation(slug) {
  if (!slug) throw new Error("Missing slug");
  const safe = encodeURIComponent(String(slug));
  return apiJson(`/realisations/${safe}/`);
}
