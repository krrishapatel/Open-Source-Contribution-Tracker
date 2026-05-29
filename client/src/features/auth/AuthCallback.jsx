import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../../api/http.js";
import { useAuth } from "./AuthProvider.jsx";

export function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { storeSession } = useAuth();

  useEffect(() => {
    async function finishLogin() {
      const token = params.get("token");
      if (!token) {
        navigate("/");
        return;
      }

      localStorage.setItem("accessToken", token);
      const payload = await api("/api/auth/me");
      storeSession(payload);
      navigate("/dashboard");
    }

    finishLogin();
  }, [navigate, params, storeSession]);

  return <main className="center-screen">Signing you in...</main>;
}
