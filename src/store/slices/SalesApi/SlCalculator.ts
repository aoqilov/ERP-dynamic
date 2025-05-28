import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const SlCalculatorApi = createApi({
  reducerPath: "calculatorApi",
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

  tagTypes: ["SlCalculator"],
  endpoints: (builder) => ({
    // READ: get all canbans
    getDevsEmployer: builder.query<any, void>({
      query: () => "/employee/find-by-role?role=dev",
    }),
    getPmEmployer: builder.query<any, void>({
      query: () => "/employee/find-by-role?role=pm",
    }),
  }),
});

export const { useGetDevsEmployerQuery, useGetPmEmployerQuery } =
  SlCalculatorApi;
