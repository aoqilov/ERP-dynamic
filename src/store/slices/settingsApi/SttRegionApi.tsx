import { JobTitle, responseJob } from "@/types/Settings";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttRegionApi = createApi({
  reducerPath: "regionApi",
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
  tagTypes: ["region"],
  endpoints: (builder) => ({
    getAllRegionTitles: builder.query<responseJob, void>({
      query: () => "setting/region",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "region", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "region" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "region", id: "LIST" }], // Default tag if no data
    }),
    patchRegionStatus: builder.mutation({
      query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
        url: `setting/region/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "region", id }, // Invalidate the specific job title
        { type: "region", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    patchRegionData: builder.mutation({
      query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
        url: `setting/region/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "region", id }, // Invalidate the specific job title
        { type: "region", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createRegionTitle: builder.mutation<
      { message: string; data: JobTitle }, // Response type
      { name: string } // Body type
    >({
      query: (body) => ({
        url: "/setting/region",
        method: "POST",
        body,
      }),
      invalidatesTags: ["region"],
    }),
  }),
});

export const {
  useCreateRegionTitleMutation,
  useGetAllRegionTitlesQuery,
  usePatchRegionDataMutation,
  usePatchRegionStatusMutation,
} = SttRegionApi;
