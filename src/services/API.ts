import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

const API = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ==============================
// Token Key Definitions
// ==============================
export const TOKEN_KEYS = {
  admin: "adminToken",
  faculty: "facultyToken",
  student: "studentToken",
};

// ==============================
// Set Token
// ==============================
export const setAuthToken = (
  token: string | null,
  role: keyof typeof TOKEN_KEYS
) => {
  const key = TOKEN_KEYS[role];

  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(key, token);
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem(key);
      delete API.defaults.headers.common["Authorization"];
    }
  }
};

// ==============================
// Get Token
// ==============================
export const getAuthToken = (role: keyof typeof TOKEN_KEYS): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEYS[role]);
  }
  return null;
};

// ==============================
// Role Tracker (for token persistence)
// ==============================
export const setActiveRole = (role: keyof typeof TOKEN_KEYS) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("activeRole", role);
  }
};

export const getActiveRole = (): keyof typeof TOKEN_KEYS | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("activeRole") as keyof typeof TOKEN_KEYS | null;
  }
  return null;
};

export const clearActiveRole = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("activeRole");
  }
};

// ==============================
// Auto-load token from active role on init (browser only)
// ==============================
if (typeof window !== "undefined") {
  const activeRole = getActiveRole();
  if (activeRole) {
    const token = getAuthToken(activeRole);
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log(`[${activeRole}] token loaded on init:`, token);
    }
  }
}

// ==============================
// Global Axios Interceptor
// ==============================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      Object.values(TOKEN_KEYS).forEach((key) => localStorage.removeItem(key));
      clearActiveRole();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
