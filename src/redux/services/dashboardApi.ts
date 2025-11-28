import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export interface Metric {
  totalServices: number;
  activeClients: number;
  overdueTasks: number;
  documentCount: number;
}
export interface GetAllDashboardMetrics {
  statusCode: number;
  message: string;
  data: Metric;
}
export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
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
    dashboardMetrics: builder.query<GetAllDashboardMetrics, void>({
      query: () => "ca/api/managementServices/dashboardMetrics",
    }),
  }),
});

export const { useDashboardMetricsQuery } = dashboardApi;
