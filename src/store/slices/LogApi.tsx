import { LogResponse, LogType } from "@/types/Logs";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LogQueryParams = Partial<{
  page: number;
  page_size: number;
  search: string;
  status: string;
}>;

export const LogApi = createApi({
  reducerPath: "logApi",
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

  tagTypes: ["Log"],

  endpoints: (builder) => ({
    getLogAll: builder.query<LogResponse, LogQueryParams>({
      query: ({ page, page_size, search, status }) => ({
        url: `project-log?page=${page}&page_size=${page_size}&search=${search}${
          status ? `&status=${status}` : ""
        }`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item: LogType) => ({
                type: "Log" as const,
                id: item.id,
              })),
              { type: "Log", id: "LIST" },
            ]
          : [{ type: "Log", id: "LIST" }],
    }),
  }),
});

export const { useGetLogAllQuery } = LogApi;
