import { demoApi } from "./demoApi.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export async function api(path, options = {}) {
  const token = localStorage.getItem("accessToken");

  if (token === "demo-token") {
    return demoApi(path, options);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.error?.message ?? "Request failed", response.status);
  }

  return data;
}

export { API_URL };
