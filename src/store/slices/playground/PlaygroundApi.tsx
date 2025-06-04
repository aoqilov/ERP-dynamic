import {
  DeleteResponse,
  PlaygroundCreatePayload,
  PlaygroundCreateResponse,
  PlaygroundItem,
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

    updatePlayground: builder.mutation<any, any>({
      query: (data) => ({
        url: `/playground/${data.id}`,
        method: "PUT",
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
  }),
});

export const {
  useGetPlaygroundQuery,
  useCreatePlaygroundMutation,
  useUpdatePlaygroundMutation,
  useDeletePlaygroundMutation,
} = PlaygroundApi;
