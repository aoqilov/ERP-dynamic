import { StatusResponseCanban } from "@/types/SalesCanban";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SlCanbanApi = createApi({
  reducerPath: "canbanApi",
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

  tagTypes: ["SlCanban"],
  endpoints: (builder) => ({
    // READ: get all canbans
    getCanbanBoard: builder.query<StatusResponseCanban, void>({
      query: () => "/canban",
      providesTags: ["SlCanban"],
    }),

    // CREATE
    createCanbanBoard: builder.mutation<any, any>({
      query: (body) => ({
        url: "/canban",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SlCanban"],
    }),

    // UPDATE
    updateCanbanBoard: builder.mutation<any, any>({
      query: ({ id, data }) => ({
        url: `/canban/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "SlCanban", id }],
    }),

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
  useCreateCanbanBoardMutation,
  useUpdateCanbanBoardMutation,

  // useCreateCanbanBoardMutation,
  // useDeleteCanbanBoardMutation,
  // useUpdateCanbanBoardMutation,
} = SlCanbanApi;
