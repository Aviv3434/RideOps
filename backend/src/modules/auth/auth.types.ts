export type LoginRequestBody = {
  email: string;
  password: string;
};

export type AuthUserResponse = {
  id: string;
  email: string;
  fullName: string;
  role: "COMPANY_ADMIN" | "CLIENT_USER";
  transportationCompanyId: string;
  clientId: string | null;
};