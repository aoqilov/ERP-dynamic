import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttIncomeApi = createApi({
  reducerPath: "incomeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNlbyIsImlhdCI6MTc0NjM1NTA5MywiZXhwIjoxNzQ2NjE0MjkzfQ.buU1yxCgSJfjPZw_cEjDmkDDbFDt4Iu5IRSek-EjqnY";
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["income"],
  endpoints: (builder) => ({
    getAllIncome: builder.query<responseJob, void>({
      query: () => "setting/income-type",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "income", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "income" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "income", id: "LIST" }], // Default tag if no data
    }),
    patchIncomeStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/income-type/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "income", id }, // Invalidate the specific job title
        { type: "income", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchIncomeData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/income-type/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "income", id }, // Invalidate the specific job title
        { type: "income", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createIncomeTitle: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/income-type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["income"],
    }),
  }),
});

export const {
  useGetAllIncomeQuery,
  useCreateIncomeTitleMutation,
  usePatchIncomeDataMutation,
  usePatchIncomeStatusMutation,
} = SttIncomeApi;
