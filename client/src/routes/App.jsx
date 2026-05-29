import { Route, Routes } from "react-router-dom";
import { AuthCallback } from "../features/auth/AuthCallback.jsx";
import { DashboardPage } from "../features/dashboard/DashboardPage.jsx";
import { LandingPage } from "../features/dashboard/LandingPage.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
