import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import { AuthProvider, useAuth } from "../context/AuthContext";

function AuthHarness() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="auth-state">{isAuthenticated ? user.name : "anonymous"}</div>
      <button type="button" onClick={() => void login("admin", "admin@posco.id", "admin123")}>Login Admin</button>
      <button type="button" onClick={logout}>Logout</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          user: { id: "1", name: "Dr. Ahmad Fauzi", email: "admin@posco.id", role: "admin" },
          token: "mocked-jwt-token"
        })
      })
    ));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs an admin user in and out", async () => {
    render(
      <AuthProvider>
        <AuthHarness />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");

    fireEvent.click(screen.getByRole("button", { name: "Login Admin" }));
    await waitFor(() => expect(screen.getByTestId("auth-state")).toHaveTextContent("Dr. Ahmad Fauzi"));

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(screen.getByTestId("auth-state")).toHaveTextContent("anonymous");
  });
});