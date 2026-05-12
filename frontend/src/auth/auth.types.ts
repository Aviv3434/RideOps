export type UserRole =
  | "COMPANY_ADMIN"
  | "CLIENT_USER";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  transportationCompanyId: string;
  clientId: string | null;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};