import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttExpenceApi = createApi({
  reducerPath: "ExpenceApi",
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
  tagTypes: ["expence"],
  endpoints: (builder) => ({
    getAllExpence: builder.query<responseJob, void>({
      query: () => "setting/expense-type",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "expence", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "expence" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "expence", id: "LIST" }], // Default tag if no data
    }),
    patchExpenceStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/expense-type/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "expence", id }, // Invalidate the specific job title
        { type: "expence", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchExpenceData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/expense-type/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "expence", id }, // Invalidate the specific job title
        { type: "expence", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createExpenceTitle: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/expense-type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["expence"],
    }),
  }),
});

export const {
  useGetAllExpenceQuery,
  useCreateExpenceTitleMutation,
  usePatchExpenceDataMutation,
  usePatchExpenceStatusMutation,
} = SttExpenceApi;
