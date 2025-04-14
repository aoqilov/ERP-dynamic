// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { ProjectsApi } from "./slices/ProjectsApi";
import { AuthApi } from "./slices/AuthApi";
// import { EmployeesApi } from "../features/api/EmployeesApi";
// import { UsersApi } from "../features/api/UsersApi";
// import { ToolsApi } from "../features/api/ToolsApi";

export const store = configureStore({
  reducer: {
    [ProjectsApi.reducerPath]: ProjectsApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    // [EmployeesApi.reducerPath]: EmployeesApi.reducer,
    // [UsersApi.reducerPath]: UsersApi.reducer,
    // [ToolsApi.reducerPath]: ToolsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ProjectsApi.middleware)
      .concat(AuthApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
