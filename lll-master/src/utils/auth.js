const API_ENDPOINTS = {
  login: "/api/login",
  loginGoogle: "/api/login/google",
  loginApple: "/api/login/apple",
  register: "/api/register",
  forgotPassword: "/api/forgot-password",
  resetPassword: "/api/reset-password",
};

const AUTH_STORAGE_KEY = "laganlakshmi_auth_session";

function isObject(value) {
  return typeof value === "object" && value !== null;
}

function parseResponseBody(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractMessage(payload, fallbackMessage) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (!isObject(payload)) {
    return fallbackMessage;
  }

  const candidates = [
    payload.message,
    payload.error,
    payload.detail,
    payload.status,
    payload.data?.message,
    payload.data?.error,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }

  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    const firstError = payload.errors[0];
    if (typeof firstError === "string" && firstError.trim()) {
      return firstError;
    }
  }

  if (isObject(payload.errors)) {
    const firstEntry = Object.values(payload.errors).find(Boolean);
    if (Array.isArray(firstEntry) && typeof firstEntry[0] === "string") {
      return firstEntry[0];
    }

    if (typeof firstEntry === "string") {
      return firstEntry;
    }
  }

  if (isObject(payload.data?.errors)) {
    const firstEntry = Object.values(payload.data.errors).find(Boolean);
    if (Array.isArray(firstEntry) && typeof firstEntry[0] === "string") {
      return firstEntry[0];
    }

    if (typeof firstEntry === "string") {
      return firstEntry;
    }
  }

  return fallbackMessage;
}

function extractToken(payload) {
  if (!isObject(payload)) {
    return "";
  }

  const directToken = [
    payload.token,
    payload.access_token,
    payload.accessToken,
    payload.auth_token,
    payload.jwt,
  ].find((value) => typeof value === "string" && value.trim());

  if (directToken) {
    return directToken;
  }

  const nestedSources = [payload.data, payload.user, payload.result].filter(
    isObject,
  );

  for (const source of nestedSources) {
    const nestedToken = extractToken(source);
    if (nestedToken) {
      return nestedToken;
    }
  }

  return "";
}

function extractUser(payload) {
  if (!isObject(payload)) {
    return null;
  }

  const directUser = [payload.user, payload.data?.user, payload.data, payload.result]
    .filter(isObject)
    .find((candidate) =>
      ["name", "email", "phone", "mobile", "id"].some((key) => key in candidate),
    );

  return directUser || null;
}

function createAuthHeaders(token) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createAuthHeaders(options.token),
      ...(options.headers || {}),
    },
  });

  const rawText = await response.text();
  const payload = parseResponseBody(rawText);

  if (!response.ok) {
    console.error("API request failed", {
      url,
      status: response.status,
      payload,
    });
    throw new Error(
      extractMessage(payload, "We could not complete your request right now."),
    );
  }

  return payload;
}

export function getOAuthUrl(provider) {
  if (provider === "google") {
    return API_ENDPOINTS.loginGoogle;
  }

  if (provider === "apple") {
    return API_ENDPOINTS.loginApple;
  }

  return "";
}

export function loadStoredSession() {
  try {
    const rawSession = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!rawSession) {
      return null;
    }

    const session = JSON.parse(rawSession);
    if (!isObject(session)) {
      return null;
    }

    return session?.token ? session : null;
  } catch {
    return null;
  }
}

export function saveStoredSession(session) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  if (session?.token) {
    window.localStorage.setItem("authToken", session.token);
  }
  if (session?.user?.email) {
    window.localStorage.setItem("userEmail", session.user.email);
  }
  if (session?.user?.name) {
    window.localStorage.setItem("userName", session.user.name);
  }
}

export function clearStoredSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.localStorage.removeItem("authToken");
  window.localStorage.removeItem("userEmail");
  window.localStorage.removeItem("userName");
}

function buildSession(payload, fallbackUser = null) {
  const token = extractToken(payload);
  const apiUser = extractUser(payload);
  const user = apiUser || fallbackUser;

  if (!token) {
    throw new Error(
      extractMessage(payload, "Login failed. Token was not returned by the API."),
    );
  }

  return {
    token,
    user,
    raw: payload,
  };
}

export async function loginUser(credentials) {
  const payloadData = { ...credentials };
  const identifier = String(
    credentials.emailOrPhone || credentials.email || credentials.phone || "",
  ).trim();

  if (identifier) {
    if (!credentials.email && !credentials.phone) {
      if (/^[+\d\s()-]{7,20}$/.test(identifier) && !identifier.includes("@")) {
        payloadData.phone = identifier.replace(/\D/g, "");
      } else {
        payloadData.email = identifier;
      }
    }
  }

  delete payloadData.emailOrPhone;
  if (payloadData.email) {
    payloadData.email = String(payloadData.email).trim();
  }
  if (payloadData.phone) {
    payloadData.phone = String(payloadData.phone).replace(/\D/g, "");
  }
  if (payloadData.password) {
    payloadData.password = String(payloadData.password);
  }

  const payload = await request(API_ENDPOINTS.login, {
    method: "POST",
    body: JSON.stringify(payloadData),
  });

  return buildSession(payload, { email: payloadData.email || identifier });
}

async function loginWithProvider(endpoint, payloadData = {}, providerLabel) {
  const payload = await request(endpoint, {
    method: "POST",
    body: JSON.stringify(payloadData),
  });

  return buildSession(payload, {
    provider: providerLabel,
    email: payloadData.email || payloadData.emailOrPhone || "",
    name: payloadData.name || "",
  });
}

export async function loginWithGoogle(payloadData = {}) {
  return loginWithProvider(API_ENDPOINTS.loginGoogle, payloadData, "google");
}

export async function loginWithApple(payloadData = {}) {
  return loginWithProvider(API_ENDPOINTS.loginApple, payloadData, "apple");
}

export async function registerUser(details) {
  const payloadData = {
    name: String(details.name || "").trim(),
    email: String(details.email || "").trim(),
    phone: String(details.phone || "").replace(/\D/g, ""),
    password: String(details.password || ""),
  };

  const payload = await request(API_ENDPOINTS.register, {
    method: "POST",
    body: JSON.stringify(payloadData),
  });

  return buildSession(payload, {
    name: payloadData.name,
    email: payloadData.email,
    phone: payloadData.phone,
  });
}

export async function forgotPassword(details) {
  return request(API_ENDPOINTS.forgotPassword, {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export async function resetPassword(details) {
  return request(API_ENDPOINTS.resetPassword, {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function getApiSuccessMessage(payload, fallbackMessage) {
  return extractMessage(payload, fallbackMessage);
}
