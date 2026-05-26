import { apiClient } from "./apiClient";

export type Client = {
  id: string;
  externalCode: string;
  name: string;
  primaryPhone: string | null;
  secondaryPhone: string | null;
  mobilePhone: string | null;
  institutionAddress: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ClientsResponse = {
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type GetClientsParams = {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: "true" | "false" | "";
};

export type CreateClientInput = {
  externalCode: string;
  name: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  mobilePhone?: string;
  institutionAddress?: string;
  notes?: string;
  isActive?: boolean;
};

export type UpdateClientInput = Partial<CreateClientInput>;

export async function getClients(
  params: GetClientsParams
): Promise<ClientsResponse> {
  const cleanParams = {
    page: params.page,
    limit: params.limit,
    ...(params.search ? { search: params.search } : {}),
    ...(params.isActive ? { isActive: params.isActive } : {}),
  };

  const response = await apiClient.get<ClientsResponse>("/clients", {
    params: cleanParams,
  });

  return response.data;
}

export async function createClient(data: CreateClientInput): Promise<Client> {
  const response = await apiClient.post<Client>("/clients", data);

  return response.data;
}

export async function updateClient(
  clientId: string,
  data: UpdateClientInput
): Promise<Client> {
  const response = await apiClient.patch<Client>(`/clients/${clientId}`, data);

  return response.data;
}