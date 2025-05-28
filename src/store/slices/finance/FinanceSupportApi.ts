import { ResponseSupportMain, Support } from "@/types/finance/support";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const FinanceSupportApi = createApi({
  reducerPath: "financeSupport",
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

  tagTypes: ["FinanceSupport"],
  endpoints: (builder) => ({
    // GET: all expenses
    getFinanceSupport: builder.query<
      ResponseSupportMain,
      { page: number; page_size: number }
    >({
      query: (params) => ({
        url: "/support",
        method: "GET",
        params,
      }),
      providesTags: ["FinanceSupport"],
    }),

    // POST: create expense
    createFinanceSupport: builder.mutation<Support, Support>({
      query: (body) => ({
        url: "/support",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinanceSupport"],
    }),
    // payment
    createFinanceSupportPayment: builder.mutation<
      any,
      {
        amount: number;
        method: string;
        support: { id: number };
        currency: { id: number };
      }
    >({
      query: (body) => ({
        url: "/support/payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinanceSupport"],
    }),
    // sms
    createFinanceSupportSms: builder.mutation<
      any,
      {
        support_id: number;
      }
    >({
      query: (body) => ({
        url: "/support/send-sms",
        method: "POST",
        body,
      }),
      invalidatesTags: ["FinanceSupport"],
    }),
    // delete
    deleteFinanceSupport: builder.mutation<ResponseSupportMain, { id: number }>(
      {
        query: ({ id }) => ({
          url: `/support/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FinanceSupport"],
      }
    ),

    // PATCH: update expense by ID
    updateFinanceSupport: builder.mutation<
      ResponseSupportMain,
      { id: number; data: Support }
    >({
      query: ({ id, data }) => ({
        url: `/support/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["FinanceSupport"],
    }),
  }),
});

export const {
  useGetFinanceSupportQuery,
  useCreateFinanceSupportMutation,
  useUpdateFinanceSupportMutation,
  useDeleteFinanceSupportMutation,
  //   /////
  useCreateFinanceSupportPaymentMutation,
  //   sms
  useCreateFinanceSupportSmsMutation,
} = FinanceSupportApi;
