import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Client {
  clientId: number;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  companyDetails: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  activeInd: string;
}

export interface GetAllClientsResponse {
  statusCode: number;
  message: string;
  data: Client[];
}

export interface Status {
  statusId: number;
  statusName: string;
}

export interface GetAllStatusResponse {
  statusCode: number;
  message: string;
  data: Status[];
}

// Role type
export interface Role {
  roleId: number;
  roleName: string;
}

// Client type
export interface Client {
  clientId: number;
  clientName: string;
  contactEmail: string;
  contactPhone: string;
  companyDetails: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  activeInd: string;
}
// User type
export interface SingleUser {
  userId: number;
  email: string;
  passwordHash: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  activeInd: string;
  role: Role;
  client: Client;
}

export interface GetAllUsersResponse {
  statusCode: number;
  message: string;
  data: SingleUser[];
  timestamp: string | null;
}

export interface TaskFormData {
  id?: number;
  taskName: string;
  taskDescription: string;
  assigneeId: number | null;
  dueDate: string;
  taskTemplateId: number | null;
  taskId?: number | null;
  serviceId?: number | null;
  clientId?: number | null;
  statusId?: number | null;
  createdBy?: string;
  updatedBy?: string;
  assignedId?: number | null;
}

export interface ServiceTemplate {
  serviceTemplateId: number;
  serviceName: string;
  description: string;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number;
  updatedBy: number | null;
  tasks: [];
}

export interface GetAllServiceTemplatesResponse {
  statusCode: number;
  message: string;
  payload: any;
  data: ServiceTemplate[];
}
export interface GetAllRolesResponse {
  statusCode: number;
  message: string;
  data: Role[];
}

export const dropdownApi = createApi({
  reducerPath: "dropdownApi",
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
    getServiceStatuses: builder.query({
      query: () => "CAServiceManagement/api/services/status",
    }),

    getAllClients: builder.query<GetAllClientsResponse, void>({
      query: () => "ca/api/managementServices/getAllClients",
    }),

    getAllServices: builder.query<GetAllStatusResponse, void>({
      query: () => "ca/api/managementServices/getAllStatus",
    }),

    getAllUsers: builder.query<GetAllUsersResponse, void>({
      query: () => "ca/api/managementServices/getAllUsers",
    }),
    getAllRoles: builder.query<GetAllRolesResponse, void>({
      query: () => "ca/api/managementServices/getAllRoles",
    }),
    getAllServiceTemplates: builder.mutation<
      GetAllServiceTemplatesResponse,
      void
    >({
      query: () => ({
        url: "ca/api/managementServices/getAllServiceTemplates",
        method: "POST",
        body: {},
      }),
    }),

    createUpdateTask: builder.mutation({
      query: (body) => ({
        url: "ca/api/managementServices/createUpdateTasks",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetServiceStatusesQuery,
  useGetAllClientsQuery,
  useGetAllServicesQuery,
  useGetAllUsersQuery,
  useGetAllServiceTemplatesMutation,
  useCreateUpdateTaskMutation,
  useGetAllRolesQuery
} = dropdownApi;
