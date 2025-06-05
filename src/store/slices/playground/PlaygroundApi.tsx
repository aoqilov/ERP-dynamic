import {
  DeleteResponse,
  PlaygroundCreatePayload,
  PlaygroundCreateResponse,
  ResponsePlayground,
} from "@/types/Playground";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // <-- ".react" bo'lishi shart!

export const PlaygroundApi = createApi({
  reducerPath: "playgroundApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        let token: string | null = localStorage.getItem("token");

        if (token) {
          // Qo'shtirnoqlarni olib tashlash
          if (token.startsWith('"') && token.endsWith('"')) {
            token = token.slice(1, -1);
          }
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  tagTypes: ["playground"],
  endpoints: (builder) => ({
    getPlayground: builder.query<ResponsePlayground, void>({
      query: () => ({
        url: "/playground",
        method: "GET",
      }),
      providesTags: ["playground"],
    }),

    createPlayground: builder.mutation<
      PlaygroundCreateResponse,
      PlaygroundCreatePayload
    >({
      query: (data) => ({
        url: "/playground",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),

    updatePlayground: builder.mutation<
      PlaygroundCreateResponse,
      { id: number; data: PlaygroundCreatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/playground/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),

    deletePlayground: builder.mutation<DeleteResponse, { id: number }>({
      query: (id) => ({
        url: `/playground/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["playground"],
    }),
    //
    //
    getPlaygroundCanbanID: builder.query<any, any>({
      query: ({ id }) => ({
        url: `/playground/${id}`,
        method: "GET",
      }),
      providesTags: ["playground"],
    }),
  }),
});

export const {
  useGetPlaygroundQuery,
  useCreatePlaygroundMutation,
  useUpdatePlaygroundMutation,
  useDeletePlaygroundMutation,
  //
  //
  useGetPlaygroundCanbanIDQuery,
} = PlaygroundApi;
