import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttjobApi = createApi({
  reducerPath: "jobTitleApi",
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

  tagTypes: ["JobTitle"],
  endpoints: (builder) => ({
    getAllJobTitles: builder.query<responseJob, void>({
      query: () => "setting/job-title",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "JobTitle", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "JobTitle" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "JobTitle", id: "LIST" }], // Default tag if no data
    }),
    patchJobStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/job-title/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobTitle", id }, // Invalidate the specific job title
        { type: "JobTitle", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchJobData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/job-title/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "JobTitle", id }, // Invalidate the specific job title
        { type: "JobTitle", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createJobTitle: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/job-title",
        method: "POST",
        body,
      }),
      invalidatesTags: ["JobTitle"],
    }),
  }),
});

export const {
  useGetAllJobTitlesQuery,
  usePatchJobStatusMutation,
  usePatchJobDataMutation,
  useCreateJobTitleMutation,
} = SttjobApi;
