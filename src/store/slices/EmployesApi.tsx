import { EmployesType } from "@/types/Employes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_DYN = process.env.TOKEN;

export const EmployeesApi = createApi({
  reducerPath: "employesApi",
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

  tagTypes: ["Employes"],

  endpoints: (builder) => ({
    // get all emmployers
    getEmployesAll: builder.query({
      query: ({ page, page_size, search, job }) => ({
        url: `employee?page=${page}&page_size=${page_size}&search=${search}${
          job ? `&job_title=${job}` : ""
        }`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item: EmployesType) => ({
                type: "Employes" as const,
                id: item.id,
              })),
              { type: "Employes", id: "LIST" },
            ]
          : [{ type: "Employes", id: "LIST" }],
    }),
    // create
    createEmploye: builder.mutation({
      query: (newEmploye: Partial<EmployesType>) => ({
        url: "employee",
        method: "POST",
        body: newEmploye,
      }),
      invalidatesTags: [{ type: "Employes", id: "LIST" }],
    }),
    // delete
    deleteEmploye: builder.mutation({
      query: (id: number) => ({
        url: `employee/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employes", id: "LIST" }],
    }),
    // PATCH
    updateEmploye: builder.mutation({
      query: ({
        id,
        data,
      }: {
        id: number | undefined;
        data: Partial<EmployesType>;
      }) => ({
        url: `employee/${id}`, // ID orqali xodimni aniqlayapmiz
        method: "PATCH", // PATCH method
        body: data, // yangilanadigan ma'lumotlar
      }),
    }),
  }),
});

export const {
  useGetEmployesAllQuery,
  useCreateEmployeMutation,
  useDeleteEmployeMutation,
  useUpdateEmployeMutation,
} = EmployeesApi;
