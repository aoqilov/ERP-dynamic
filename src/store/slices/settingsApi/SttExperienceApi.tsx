import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttExperienceApi = createApi({
  reducerPath: "SttExperience",
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
  tagTypes: ["SttExperience"],
  endpoints: (builder) => ({
    getAllExperience: builder.query<responseJob, void>({
      query: () => "setting/work-experience",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "SttExperience", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "SttExperience" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "SttExperience", id: "LIST" }], // Default tag if no data
    }),
    patchExperienceStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/work-experience/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SttExperience", id }, // Invalidate the specific job title
        { type: "SttExperience", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchExperienceData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/work-experience/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SttExperience", id }, // Invalidate the specific job title
        { type: "SttExperience", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createExperienceTitle: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/work-experience",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SttExperience"],
    }),
  }),
});

export const {
  useGetAllExperienceQuery,
  useCreateExperienceTitleMutation,
  usePatchExperienceDataMutation,
  usePatchExperienceStatusMutation,
} = SttExperienceApi;
