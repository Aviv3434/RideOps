import { apiClient } from "../api/apiClient";

import type {
  AuthUser,
  LoginResponse,
} from "./auth.types";

export async function loginRequest(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response =
    await apiClient.post<LoginResponse>(
      "/auth/login",
      {
        email,
        password,
      }
    );

  return response.data;
}

export async function getCurrentUserRequest(): Promise<AuthUser> {
  const response =
    await apiClient.get<AuthUser>(
      "/auth/me"
    );

  return response.data;
}