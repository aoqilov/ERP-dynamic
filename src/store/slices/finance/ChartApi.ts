import { IncomeChartResponse } from "@/types/finance/chart";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ChartApi = createApi({
  reducerPath: "chart",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      let token: string | null = localStorage.getItem("token");

      if (token !== null) {
        // Agar token atrofida qo‘sh tirnoq bo‘lsa, ularni olib tashlaymiz:
        if (token.startsWith('"') && token.endsWith('"')) {
          token = token.slice(1, -1);
        }
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  tagTypes: ["incomechart"],
  endpoints: (builder) => ({
    // GET: all expenses
    getChartIncome: builder.query<IncomeChartResponse, void>({
      query: () => ({
        url: "/chart/income-chart",
        method: "GET",
      }),
      providesTags: ["incomechart"],
    }),
    // expense

    getChartExpense: builder.query<IncomeChartResponse, void>({
      query: () => ({
        url: "/chart/expense-chart",
        method: "GET",
      }),
      providesTags: ["incomechart"],
    }),
  }),
});

export const { useGetChartIncomeQuery, useGetChartExpenseQuery } = ChartApi;
