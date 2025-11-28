import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Client {
  clientId: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  totalServices: number;
  totalDocuments: number;
}
export interface GetAllClients {
  statusCode: number;
  message: string;
  data: Client[];
}

export interface ClientMetric {
  totalClients: number;
  activeClients: number;
  inactiveClients: number;
  totalServices: number;
}
export interface ClientMetricsResponse {
  statusCode: number;
  message: string;
  data: ClientMetric;
}
export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8181/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    clientMetrics: builder.query<ClientMetricsResponse, void>({
      query: () => "ca/api/userManagementService/clientMetrics",
    }),
    getAllClients: builder.mutation<GetAllClients, { searchText: string }>({
      query: (body) => ({
        url: "ca/api/userManagementService/getAllClients",
        method: "POST",
        body,
      }),
    }),

    createClient: builder.mutation<
      any,
      {
        clientName: string;
        clientEmail: string;
        clientPhoneNumber: string;
        clientAddress: string;
      }
    >({
      query: (body) => ({
        url: "ca/api/userManagementService/createClient",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useClientMetricsQuery, useGetAllClientsMutation, useCreateClientMutation } = clientsApi;
