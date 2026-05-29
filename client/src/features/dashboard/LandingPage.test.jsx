import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../auth/AuthProvider.jsx";
import { LandingPage } from "./LandingPage.jsx";

afterEach(() => {
  cleanup();
});

describe("LandingPage", () => {
  it("renders the product name and GitHub login action", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /open source contribution tracker/i })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /set up github login/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /try demo dashboard/i })).toBeInTheDocument();
  });

  it("shows setup guidance when GitHub OAuth is not configured", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const button = await screen.findByRole("button", { name: /set up github login/i });
    fireEvent.click(button);

    expect(screen.getByText(/github login needs local oauth credentials/i)).toBeInTheDocument();
  });
});
