import {
  IncomeQueryParams,
  IncomeResponse,
  IncomeSubmitPayload,
} from "@/types/finance/income";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const FinanceIncomeApi = createApi({
  reducerPath: "financeIncome",
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

  tagTypes: ["FinanceIncome"],
  endpoints: (builder) => ({
    // GET: all expenses
    getFinanceIncome: builder.query<IncomeResponse, IncomeQueryParams>({
      query: (params) => ({
        url: "/income",
        method: "GET",
        params,
      }),
      providesTags: ["FinanceIncome"],
    }),

    // GET:  SALES
    getFinanceIncomeSales: builder.query<any, void>({
      query: () => ({
        url: "/employee/find-by-role?role=sales",
        method: "GET",
      }),
      providesTags: ["FinanceIncome"],
    }),

    // POST: create expense
    createFinanceIncome: builder.mutation<any, IncomeSubmitPayload>({
      query: (body) => ({
        url: "/income",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinanceIncome"],
    }),
    // delete
    deleteFinanceIncome: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/income/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FinanceIncome"],
    }),

    // PATCH: update expense by ID
    updateFinanceIncome: builder.mutation<
      any,
      { id: number; data: IncomeSubmitPayload }
    >({
      query: ({ id, data }) => ({
        url: `/income/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FinanceIncome"],
    }),
  }),
});

export const {
  useGetFinanceIncomeQuery,
  useCreateFinanceIncomeMutation,
  useUpdateFinanceIncomeMutation,
  useDeleteFinanceIncomeMutation,
  useGetFinanceIncomeSalesQuery,
} = FinanceIncomeApi;
