import { createContext, useContext, useMemo, useState } from "react";
import { api, API_URL } from "../../api/http.js";
import { startDemoSession } from "../../api/demoApi.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  function storeSession(payload) {
    localStorage.setItem("accessToken", payload.accessToken);
    localStorage.setItem("user", JSON.stringify(payload.user));
    setUser(payload.user);
  }

  async function refreshSession() {
    const payload = await api("/api/auth/refresh", { method: "POST" });
    storeSession(payload);
  }

  function loginWithGithub() {
    window.location.href = `${API_URL}/api/auth/github`;
  }

  function loginWithDemo() {
    const payload = startDemoSession();
    setUser(payload.user);
  }

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, storeSession, refreshSession, loginWithGithub, loginWithDemo, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
