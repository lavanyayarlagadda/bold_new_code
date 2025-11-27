import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface UserItem {
  userId: number;
  email: string;
  fullName: string;
  roleId: number;
  roleName: string;
  clientId: number;
  clientName: string;
  contactPhone: string;
  companyDetails: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
  isActive: number;
  phoneNumber?:number;
}

export interface FetchAllUsersResponse {
  statusCode: number;
  message: string;
  data: UserItem[];
}

export const usersApi = createApi({
  reducerPath: "usersApi",
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
    fetchAllUsersDetails: builder.query<FetchAllUsersResponse, void>({
      query: () => ({
        url: "ca/api/userManagementService/fetchAllUserDetails",
        method: "GET",
      }),
    }),
    getUserDetailsById: builder.mutation({
      query: (body) => ({
        url: "ca/api/userManagementService/getTheUserDetailsByUserId",
        method: "POST",
        body,
      }),
    }),
    updateUserById: builder.mutation({
      query: (body) => ({
        url: "ca/api/userManagementService/updateById",
        method: "POST",
        body,
      }),
    }),
    createUser: builder.mutation({
      query: (body) => ({
        url: "ca/api/userManagementService/createUser",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useFetchAllUsersDetailsQuery,
  useGetUserDetailsByIdMutation,
  useUpdateUserByIdMutation,
  useCreateUserMutation
} = usersApi;
