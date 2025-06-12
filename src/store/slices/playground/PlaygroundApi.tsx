 
import {
  DeleteResponse,
  PlaygroundCreatePayload,
  PlaygroundCreateResponse,
  ResponsePlayground,
} from "@/types/Playground";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    // ✅ PLAYGROUND CRUD
    getPlayground: builder.query<ResponsePlayground, void>({
      query: () => ({
        url: "/playground",
        method: "GET",
      }),
      providesTags: ["playground"],
    }),

    getPlaygroundCard: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/playground/${id}`,
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

    updatePlayground: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/playground/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),

    deletePlayground: builder.mutation<DeleteResponse, { id: number }>({
      query: ({ id }) => ({
        url: `/playground/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["playground"],
    }),

    // ✅ SECTIONS (USTUNLAR)
    getPlaygroundSections: builder.query<any, { id: number }>({
      query: ({ id }) => ({
        url: `/playground-section/find-by-playground/${id}`,
        method: "GET",
      }),
      providesTags: ["playground"],
    }),

    createPlaygroundColumn: builder.mutation<any, any>({
      query: (data) => ({
        url: "/playground-section",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),

    // ✅ TASK KO‘CHIRISH
    changeOrderOrSection: builder.mutation<any, any>({
      query: (payload) => ({
        url: "/playground-section-task/change-order-or-section",
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["playground"],
    }),
    patchPlaygroundSection: builder.mutation<any, { id: number; data: any }>({
      query: ({ data, id }) => ({
        url: `/playground-section/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),
    deletePlaygroundSection: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/playground-section/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["playground"],
    }),
    // ✅ TASK CRUD card
    createPlaygroundCard: builder.mutation<any, any>({
      query: (data) => ({
        url: "/playground-section-task",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),
    deletePlaygroundCard: builder.mutation<any, { id: number }>({
      query: ({ id }) => ({
        url: `/playground-section-task/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["playground"],
    }),
    patchPlaygroundCard: builder.mutation<any, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `playground-section-task/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["playground"],
    }),
  }),
});

export const {
  useGetPlaygroundQuery,
  useGetPlaygroundCardQuery,
  useCreatePlaygroundMutation,
  useUpdatePlaygroundMutation,
  useDeletePlaygroundMutation,
  //
  //
  useGetPlaygroundSectionsQuery,
  useCreatePlaygroundColumnMutation,
  useChangeOrderOrSectionMutation,
  usePatchPlaygroundSectionMutation,
  useDeletePlaygroundSectionMutation,
  //
  //
  useCreatePlaygroundCardMutation,
  useDeletePlaygroundCardMutation,
  usePatchPlaygroundCardMutation,
} = PlaygroundApi;
