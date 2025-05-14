import { StatusResponseCanban } from "@/types/SalesCanban";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SlCanbanApi = createApi({
  reducerPath: "canbanApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = process.env.NEXT_PUBLIC_TOKEN;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["SlCanban"],
  endpoints: (builder) => ({
    // READ: get all canbans
    getCanbanBoard: builder.query<StatusResponseCanban, void>({
      query: () => "/canban",
    }),

    // // CREATE
    // createCanbanBoard: builder.mutation<>({
    //   query: (body) => ({
    //     url: "/canban",
    //     method: "POST",
    //     body,
    //   }),
    //   invalidatesTags: [{ type: "SlCanban", id: "LIST" }],
    // }),

    // // UPDATE
    // updateCanbanBoard: builder.mutation<>({
    //   query: ({ id, data }) => ({
    //     url: `/canban/${id}`,
    //     method: "PUT",
    //     body: data,
    //   }),
    //   invalidatesTags: (result, error, { id }) => [{ type: "SlCanban", id }],
    // }),

    // // DELETE
    // deleteCanbanBoard: builder.mutation<>({
    //   query: (id) => ({
    //     url: `/canban/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: (result, error, id) => [{ type: "SlCanban", id }],
    // }),
  }),
});

export const {
  useGetCanbanBoardQuery,
  // useCreateCanbanBoardMutation,
  // useDeleteCanbanBoardMutation,
  // useUpdateCanbanBoardMutation,
} = SlCanbanApi;
