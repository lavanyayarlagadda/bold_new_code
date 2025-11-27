import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const uploadDocumentApi = createApi({
  reducerPath: "uploadDocumentApi",
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
    uploadDocuments: builder.mutation({
      query: (body) => ({
        url: "ca/api/managementServices/uploadDocuments",
        method: "POST",
        body,
      }),
    }),
    viewDocument: builder.mutation({
      query: (documentId) => ({
        url: `ca/api/managementServices/viewUrl?documentId=${documentId}`,
        method: "GET",
      }),
    }),

    downloadDocument: builder.mutation({
      query: (documentId) => ({
        url: `ca/api/managementServices/download?documentId=${documentId}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),

    deleteDocument: builder.mutation({
      query: ({ documentId, userId }) => ({
        url: `ca/api/managementServices/deleteDocument?documentId=${documentId}&userId=${userId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUploadDocumentsMutation,
  useViewDocumentMutation,
  useDownloadDocumentMutation,
  useDeleteDocumentMutation,
} = uploadDocumentApi;
