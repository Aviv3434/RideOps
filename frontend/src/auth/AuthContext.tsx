import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser } from "./auth.types";

import {
  getCurrentUserRequest,
  loginRequest,
} from "./auth.api";

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<AuthUser>;

  logout: () => void;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      const token =
        localStorage.getItem("rideops_token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser =
          await getCurrentUserRequest();

        setUser(currentUser);
      } catch {
        localStorage.removeItem(
          "rideops_token"
        );

        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  async function login(
    email: string,
    password: string
  ) {
    const result =
      await loginRequest(email, password);

    localStorage.setItem(
      "rideops_token",
      result.token
    );

    setUser(result.user);

    return result.user;
  }

  function logout() {
    localStorage.removeItem(
      "rideops_token"
    );

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}