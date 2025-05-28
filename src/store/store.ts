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
import { FinanceIncomeApi } from "./slices/finance/FinanceIncomeApi";
import { FinanceSupportApi } from "./slices/finance/FinanceSupportApi";
import { ChartApi } from "./slices/finance/ChartApi";
import { SlCalculatorApi } from "./slices/SalesApi/SlCalculator";
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
    [SlCalculatorApi.reducerPath]: SlCalculatorApi.reducer,
    // finance

    [FinanceExpenseApi.reducerPath]: FinanceExpenseApi.reducer,
    [FinanceIncomeApi.reducerPath]: FinanceIncomeApi.reducer,
    [FinanceSupportApi.reducerPath]: FinanceSupportApi.reducer,
    [ChartApi.reducerPath]: ChartApi.reducer,
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
      .concat(SlCalculatorApi.middleware)
      // finance
      .concat(FinanceIncomeApi.middleware)
      .concat(FinanceExpenseApi.middleware)
      .concat(FinanceSupportApi.middleware)
      .concat(ChartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
