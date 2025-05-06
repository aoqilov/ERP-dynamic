import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttMarginApi = createApi({
  reducerPath: "marginApi",
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
  tagTypes: ["margin"],
  endpoints: (builder) => ({
    getAllWage: builder.query<responseJob, void>({
      query: () => "setting/company-wage",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "margin", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "margin" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "margin", id: "LIST" }], // Default tag if no data
    }),

    patchWageData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/company-wage/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "margin", id }, // Invalidate the specific job title
        { type: "margin", id: "LIST" }, // Invalidate the whole list
      ],
    }),
  }),
});

export const { useGetAllWageQuery, usePatchWageDataMutation } = SttMarginApi;
