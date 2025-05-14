import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttPtApi = createApi({
  reducerPath: "ptApi",
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
  tagTypes: ["ptApi"],
  endpoints: (builder) => ({
    getAllPt: builder.query<responseJob, void>({
      query: () => "setting/project-type",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "ptApi", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "ptApi" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "ptApi", id: "LIST" }], // Default tag if no data
    }),
    patchPtStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/project-type/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ptApi", id }, // Invalidate the specific job title
        { type: "ptApi", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchPtData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/project-type/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ptApi", id }, // Invalidate the specific job title
        { type: "ptApi", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createPt: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/project-type",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ptApi"],
    }),
  }),
});

export const {
  usePatchPtDataMutation,
  usePatchPtStatusMutation,
  useGetAllPtQuery,
  useCreatePtMutation,
} = SttPtApi;
