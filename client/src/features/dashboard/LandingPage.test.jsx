import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AuthProvider } from "../auth/AuthProvider.jsx";
import { LandingPage } from "./LandingPage.jsx";

describe("LandingPage", () => {
  it("renders the product name and GitHub login action", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /open source contribution tracker/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue with github/i })).toBeInTheDocument();
  });
});
