import { configureStore } from "@reduxjs/toolkit";
import { serviceTasksApi } from "./services/serviceTasksApi";
import { dropdownApi } from "./services/dropdownApi";
import { uploadDocumentApi } from "./services/uploadDocumentApi";
import dropdownReducer from "./slices/dropdownSlice";


export const store = configureStore({
  reducer: {
    // RTK Query reducers
    [serviceTasksApi.reducerPath]: serviceTasksApi.reducer,
    [dropdownApi.reducerPath]: dropdownApi.reducer,
    [uploadDocumentApi.reducerPath]: uploadDocumentApi.reducer,

     // Regular slice
    dropdown: dropdownReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(serviceTasksApi.middleware)
      .concat(dropdownApi.middleware)
      .concat(uploadDocumentApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
