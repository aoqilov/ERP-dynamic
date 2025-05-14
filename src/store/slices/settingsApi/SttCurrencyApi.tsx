import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyType, responseCurrency } from "@/types/Settings";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttCurrencyApi = createApi({
  reducerPath: "SttCurrencyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_TOKEN;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["currency"],
  endpoints: (builder) => ({
    // GET all currencies
    getAllCurrency: builder.query<responseCurrency, void>({
      query: () => "setting/currency",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "currency", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "currency" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "currency", id: "LIST" }], // Default tag if no data
    }),
    getActiveCurrency: builder.query<responseCurrency, void>({
      query: () => "setting/currency?is_active=true",
    }),
    patchCurrencyStatus: builder.mutation({
      query: ({
        id,
        is_active,
      }: {
        id: number | undefined;
        is_active: boolean;
      }) => ({
        url: `setting/currency/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "currency", id },
        { type: "currency", id: "LIST" },
      ],
    }),
    createCurrencyTitle: builder.mutation<responseCurrency, CurrencyType>({
      // Response type
      query: (body) => ({
        url: "/setting/currency",
        method: "POST",
        body,
      }),
      invalidatesTags: ["currency"],
    }),
    patchCurrencyData: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: number | undefined;
        body: CurrencyType;
      }) => ({
        url: `setting/currency/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "currency", id }, // Invalidate the specific job title
        { type: "currency", id: "LIST" }, // Invalidate the whole list
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllCurrencyQuery,
  usePatchCurrencyStatusMutation,
  useCreateCurrencyTitleMutation,
  usePatchCurrencyDataMutation,
  useGetActiveCurrencyQuery,
} = SttCurrencyApi;
