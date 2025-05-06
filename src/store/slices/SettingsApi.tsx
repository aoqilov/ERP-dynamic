// import {
//   CurrencyType,
//   JobTitle,
//   responseCurrency,
//   responseJob,
// } from "@/types/Settings";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export const SettingsApi = createApi({
//   reducerPath: "jobTitleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_URL,
//     prepareHeaders: (headers) => {
//       const token =
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNlbyIsImlhdCI6MTc0NjA5MjI1OSwiZXhwIjoxNzQ2MzUxNDU5fQ.TeaCKUpK6B6MAxXz3o5_sLzgsjjC0VrBSaA2SVj8yTQ"; // or your own token
//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["JobTitle", "currency"], // Define tag types
//   endpoints: (builder) => ({
//     getAllJobTitles: builder.query<responseJob, void>({
//       query: () => "setting/job-title",
//       providesTags: (result) =>
//         result?.data
//           ? [
//               { type: "JobTitle", id: "LIST" }, // Tag for the whole list
//               ...result.data.map((item) => ({
//                 type: "JobTitle" as const, // Use `as const` to ensure this is a literal type
//                 id: item.id, // Tag for each individual job title
//               })),
//             ]
//           : [{ type: "JobTitle", id: "LIST" }], // Default tag if no data
//     }),
//     patchJobStatus: builder.mutation({
//       query: ({ id, is_active }: { id: number; is_active: boolean }) => ({
//         url: `setting/job-title/${id}`,
//         method: "PATCH",
//         body: { is_active },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "JobTitle", id }, // Invalidate the specific job title
//         { type: "JobTitle", id: "LIST" }, // Invalidate the whole list
//       ],
//     }),
//     patchJobData: builder.mutation({
//       query: ({ id, body }: { id: number | undefined; body: JobTitle }) => ({
//         url: `setting/job-title/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "JobTitle", id }, // Invalidate the specific job title
//         { type: "JobTitle", id: "LIST" }, // Invalidate the whole list
//       ],
//     }),
//     createJobTitle: builder.mutation<
//       { message: string; data: JobTitle }, // Response type
//       { name: string } // Body type
//     >({
//       query: (body) => ({
//         url: "/setting/job-title",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["JobTitle"],
//     }),
//     //
//     //               SETTINGS JOB TITLE
//     //

//     getAllCurrency: builder.query<responseCurrency, void>({
//       query: () => "setting/currency",
//       providesTags: (result) =>
//         result?.data
//           ? [
//               { type: "currency", id: "LIST" }, // Tag for the whole list
//               ...result.data.map((item) => ({
//                 type: "currency" as const, // Use `as const` to ensure this is a literal type
//                 id: item.id, // Tag for each individual job title
//               })),
//             ]
//           : [{ type: "currency", id: "LIST" }], // Default tag if no data
//     }),
//     patchCurrencyStatus: builder.mutation({
//       query: ({
//         id,
//         is_active,
//       }: {
//         id: number | undefined;
//         is_active: boolean;
//       }) => ({
//         url: `setting/currency/${id}`,
//         method: "PATCH",
//         body: { is_active },
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "currency", id }, // Invalidate the specific job title
//         { type: "currency", id: "LIST" }, // Invalidate the whole list
//       ],
//     }),
//     createCurrencyTitle: builder.mutation<responseCurrency, CurrencyType>({
//       // Response type
//       query: (body) => ({
//         url: "/setting/currency",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["currency"],
//     }),
//     patchCurrencyData: builder.mutation({
//       query: ({
//         id,
//         body,
//       }: {
//         id: number | undefined;
//         body: CurrencyType;
//       }) => ({
//         url: `setting/currency/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: (result, error, { id }) => [
//         { type: "currency", id }, // Invalidate the specific job title
//         { type: "currency", id: "LIST" }, // Invalidate the whole list
//       ],
//     }),
//   }),
// });

// export const {
//   useGetAllJobTitlesQuery,
//   usePatchJobStatusMutation,
//   usePatchJobDataMutation,
//   useCreateJobTitleMutation,
//   //
//   //
//   useGetAllCurrencyQuery,
//   usePatchCurrencyStatusMutation,
//   useCreateCurrencyTitleMutation,
//   usePatchCurrencyDataMutation,
// } = SettingsApi;
