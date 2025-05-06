import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CurrencyType, responseCurrency } from "@/types/Settings";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const SttIntegrationApi = createApi({
  reducerPath: "integrationApi",
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
  tagTypes: ["integration"],
  endpoints: (builder) => ({
    // GET all currencies
    getAllIntegration: builder.query<responseCurrency, void>({
      query: () => "setting/integration",
      providesTags: (result) =>
        result?.data
          ? [
              { type: "integration", id: "LIST" }, // Tag for the whole list
              ...result.data.map((item) => ({
                type: "integration" as const, // Use `as const` to ensure this is a literal type
                id: item.id, // Tag for each individual job title
              })),
            ]
          : [{ type: "integration", id: "LIST" }], // Default tag if no data
    }),
    patchIntegrationStatus: builder.mutation({
      query: ({
        id,
        is_active,
      }: {
        id: number | undefined;
        is_active: boolean;
      }) => ({
        url: `setting/integration/${id}`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "integration", id }, // Invalidate the specific job title
        { type: "integration", id: "LIST" }, // Invalidate the whole list
      ],
    }),
    createIntegrationTitle: builder.mutation<responseCurrency, CurrencyType>({
      // Response type
      query: (body) => ({
        url: "/setting/integration",
        method: "POST",
        body,
      }),
      invalidatesTags: ["integration"],
    }),
    patchIntegrationData: builder.mutation({
      query: ({
        id,
        body,
      }: {
        id: number | undefined;
        body: CurrencyType;
      }) => ({
        url: `setting/integration/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "integration", id }, // Invalidate the specific job title
        { type: "integration", id: "LIST" }, // Invalidate the whole list
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAllIntegrationQuery,
  useCreateIntegrationTitleMutation,
  usePatchIntegrationDataMutation,
  usePatchIntegrationStatusMutation,
} = SttIntegrationApi;
