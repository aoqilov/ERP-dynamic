import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyType, responseCurrency } from "@/types/Settings";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttCanbanApi = createApi({
  reducerPath: "SttCanbanApi",
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

  tagTypes: ["canban"],
  endpoints: (builder) => ({
    // GET all currencies
    getAllCanban: builder.query<responseCurrency, void>({
      query: () => "setting/canban-status",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "canban", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "canban" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "canban", id: "LIST" }], // Default tag if no data
    }),
    patchCanbanStatus: builder.mutation({
      query: ({
        id,
        is_active,
      }: {
        id: number | undefined;
        is_active: boolean;
      }) => ({
        url: `setting/canban-status/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "canban", id }, // Invalidate the specific job title
        { type: "canban", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createCanbanTitle: builder.mutation<responseCurrency, CurrencyType>({
      // Response type
      query: (body) => ({
        url: "/setting/canban-status",
        method: "POST",
        body,
      }),
      invalidatesTags: ["canban"],
    }),
    patchCanbanData: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: number | undefined;
        body: CurrencyType;
      }) => ({
        url: `setting/canban-status/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "canban", id }, // Invalidate the specific job title
        { type: "canban", id: "LIST" }, // Invalidate the whole list
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllCanbanQuery,
  usePatchCanbanDataMutation,
  usePatchCanbanStatusMutation,
  useCreateCanbanTitleMutation,
} = SttCanbanApi;
