import { configureStore } from "@reduxjs/toolkit";
import { serviceTasksApi } from "./services/serviceTasksApi";
import { dropdownApi } from "./services/dropdownApi";
import { uploadDocumentApi } from "./services/uploadDocumentApi";
import dropdownReducer from "./slices/dropdownSlice";
import { usersApi } from "./services/usersApi";
import { authApi } from "./services/authApi";
import { dashboardApi } from "./services/dashboardApi";
import { clientsApi } from "./services/clientsApi";

export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [serviceTasksApi.reducerPath]: serviceTasksApi.reducer,
    [dropdownApi.reducerPath]: dropdownApi.reducer,
    [uploadDocumentApi.reducerPath]: uploadDocumentApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,

    // Regular slice
    dropdown: dropdownReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(serviceTasksApi.middleware)
      .concat(dropdownApi.middleware)
      .concat(uploadDocumentApi.middleware)
      .concat(authApi.middleware)
      .concat(usersApi.middleware)
      .concat(dashboardApi.middleware)
      .concat(clientsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
