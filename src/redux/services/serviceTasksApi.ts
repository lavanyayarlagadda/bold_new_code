import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ServiceTask {
  serviceId: number;
  serviceName: string;
  serviceCategory: string;
  clientName: string;
  clientId: number;
  assignedTo: string;
  statusName: string;
  statusId: number;
  dueDate: string;
  progressPercent: number;
}
interface FetchServiceTasksResponse {
  statusCode: number;
  message: string;
  data: ServiceTask[];
}

interface FetchServiceTasksRequest {
  serviceTemplateId: number;
  clientId: number;
  statusId: number;
}

export interface ServiceTaskDetails {
  serviceInformation: {
    serviceId: number;
    serviceType: string;
    clientName: string;
    clientId: number;
    status: string | null;
    frequencyCd: string;
    progressPercent: number;
    dueDate: string;
    priorityId: number | null;
    priorityLabel: string;
    serviceName:string
  };
  assignedTeam: {
    serviceId: number;
    assignedUser: string;
    designation: string;
    userId: number;
  }[];
  documents: any[];
  comments: {
    serviceId: number;
    commentId: number;
    commentText: string;
    authorName: string;
    authorEmail: string;
    createdAt: string;
    commentVisibility: string;
  }[];
  taskList: {
    serviceId: number;
    taskId: number;
    taskName: string;
    taskDescription: string;
    assigneeName: string;
    assignedId: number;
    status: string;
    dueDate: string;
    priorityLabel: string;
  }[];
  activityLogs: {
    logId: number;
    serviceId: number;
    userId: number;
    fullName: string;
    action: string;
    timeStamp: string;
  }[];
}

export interface FetchServiceTaskDetailsResponse {
  statusCode: number;
  message: string;
  data: ServiceTaskDetails;
}

export interface saveCommentsRequest {
  userId: number;
  clientId: number;
  serviceId: number;
  message: string;
  isInternal: number;
}

export interface saveCommentsResponse {
  statusCode: number;
  message: string;
}
export const serviceTasksApi = createApi({
  reducerPath: "serviceTasksApi",
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
    fetchServiceTasks: builder.mutation<
      FetchServiceTasksResponse,
      FetchServiceTasksRequest
    >({
      query: (body) => ({
        url: "ca/api/managementServices/fetchServicesTasks",
        method: "POST",
        body,
      }),
    }),

    fetchServiceTaskDetails: builder.query<
      FetchServiceTaskDetailsResponse,
      number
    >({
      query: (serviceId) =>
        `ca/api/managementServices/fetchViewServicesTasks?serviceId=${serviceId}`,
    }),

    saveComments: builder.mutation<saveCommentsResponse, saveCommentsRequest>({
      query: (body) => ({
        url: "ca/api/managementServices/saveComments",
        method: "POST",
        body,
      }),
    }),

    createNewService: builder.mutation({
      query: (body) => ({
        url: "ca/api/managementServices/createNewService",
        method: "POST",
        body,
      }),
    }),
    getTasksByServiceTemplate: builder.mutation({
      query: (body) => ({
        url: "ca/api/managementServices/getTasksByServiceTemplate",
        method: "POST",
        body,
      }),
    }),
    createUpdateTasks:builder.mutation({
       query: (body) => ({
        url: "ca/api/managementServices/createUpdateTasks ",
        method: "POST",
        body,
      }),
    })
  }),
});

export const {
  useFetchServiceTasksMutation,
  useFetchServiceTaskDetailsQuery,
  useSaveCommentsMutation,
  useCreateNewServiceMutation,
  useGetTasksByServiceTemplateMutation,
  useCreateUpdateTasksMutation
} = serviceTasksApi;
