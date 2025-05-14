// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { ProjectsApi } from "./slices/ProjectsApi";
import { AuthApi } from "./slices/AuthApi";
import { EmployeesApi } from "../store/slices/EmployesApi";
import { LogApi } from "./slices/LogApi";
import { SttjobApi } from "./slices/settingsApi/SttjobApi";
import { SttCurrencyApi } from "./slices/settingsApi/SttCurrencyApi";
import { SttRegionApi } from "./slices/settingsApi/SttRegionApi";
import { SttPtApi } from "./slices/settingsApi/SttPtApi";
import { SttIntegrationApi } from "./slices/settingsApi/SttIntegrationApi";
import { SttExperienceApi } from "./slices/settingsApi/SttExperienceApi";
import { SttExpenceApi } from "./slices/settingsApi/SttExpenceApi";
import { SttIncomeApi } from "./slices/settingsApi/SttIncome";
import { SttMarginApi } from "./slices/settingsApi/SttMarginApi";
import { SttCanbanApi } from "./slices/settingsApi/SttCanbanApi";
import { SlCanbanApi } from "./slices/SalesApi/SlCanbanApi";
import { FinanceExpenseApi } from "./slices/finance/FinanceExpenseApi";
// import { UsersApi } from "../features/api/UsersApi";
// import { ToolsApi } from "../features/api/ToolsApi";

export const store = configureStore({
  reducer: {
    [ProjectsApi.reducerPath]: ProjectsApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [EmployeesApi.reducerPath]: EmployeesApi.reducer,
    [LogApi.reducerPath]: LogApi.reducer,
    // settings
    [SttjobApi.reducerPath]: SttjobApi.reducer,
    [SttCurrencyApi.reducerPath]: SttCurrencyApi.reducer,
    [SttRegionApi.reducerPath]: SttRegionApi.reducer,
    [SttPtApi.reducerPath]: SttPtApi.reducer,
    [SttIntegrationApi.reducerPath]: SttIntegrationApi.reducer,
    [SttExperienceApi.reducerPath]: SttExperienceApi.reducer,
    [SttExpenceApi.reducerPath]: SttExpenceApi.reducer,
    [SttIncomeApi.reducerPath]: SttIncomeApi.reducer,
    [SttMarginApi.reducerPath]: SttMarginApi.reducer,
    [SttCanbanApi.reducerPath]: SttCanbanApi.reducer,
    // SALES
    [SlCanbanApi.reducerPath]: SlCanbanApi.reducer,
    [FinanceExpenseApi.reducerPath]: FinanceExpenseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ProjectsApi.middleware)
      .concat(EmployeesApi.middleware)
      .concat(AuthApi.middleware)
      .concat(LogApi.middleware)
      // settings
      .concat(SttjobApi.middleware)
      .concat(SttCurrencyApi.middleware)
      .concat(SttPtApi.middleware)
      .concat(SttIntegrationApi.middleware)
      .concat(SttExperienceApi.middleware)
      .concat(SttExpenceApi.middleware)
      .concat(SttIncomeApi.middleware)
      .concat(SttMarginApi.middleware)
      .concat(SttCanbanApi.middleware)
      .concat(SttRegionApi.middleware)
      // saless
      .concat(SlCanbanApi.middleware)
      // finance
      .concat(FinanceExpenseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
