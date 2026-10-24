import { useState } from "react";

import { loginUser } from "../api/auth";
import { AuthContext } from "./useAuth";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("access")),
  );

  async function login(credentials) {
    const tokens = await loginUser(credentials);

    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);

    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}