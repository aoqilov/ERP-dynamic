import {
  ExpenseQueryParams,
  ExpenseResponse,
  ExpenseSubmitPayload,
} from "@/types/finance/expense";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const FinanceExpenseApi = createApi({
  reducerPath: "financeExpense",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_TOKEN;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["FinanceExpense"],
  endpoints: (builder) => ({
    // GET: all expenses
    getFinanceExpence: builder.query<ExpenseResponse, ExpenseQueryParams>({
      query: (params) => ({
        url: "/expense",
        method: "GET",
        params,
      }),
      providesTags: ["FinanceExpense"],
    }),

    // POST: create expense
    createFinanceExpense: builder.mutation<any, ExpenseSubmitPayload>({
      query: (body) => ({
        url: "/expense",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinanceExpense"],
    }),
    // delete
    deleteFinanceExpense: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/expense/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FinanceExpense"],
    }),

    // PATCH: update expense by ID
    updateFinanceExpense: builder.mutation<
      any,
      { id: number; data: ExpenseSubmitPayload }
    >({
      query: ({ id, data }) => ({
        url: `/expense/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FinanceExpense"],
    }),
  }),
});

export const {
  useGetFinanceExpenceQuery,
  useCreateFinanceExpenseMutation,
  useUpdateFinanceExpenseMutation,
  useDeleteFinanceExpenseMutation,
} = FinanceExpenseApi;
