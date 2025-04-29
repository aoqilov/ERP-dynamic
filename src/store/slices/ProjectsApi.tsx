import { ProjectResponseType, ProjectType, todoType } from "@/types/Project";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TOKEN_DYN = process.env.TOKEN;

export const ProjectsApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers) => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNlbyIsImlhdCI6MTc0NTU3MjkxNCwiZXhwIjoxNzQ1ODMyMTE0fQ.OHxhuHWCUP_8jtcUef6Nvm4ozb0IKqgb_JhJ5-HTzPk";

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Project", "ProjectTodo"],

  endpoints: (builder) => ({
    // CREATE
    createProject: builder.mutation({
      query: (newProject) => ({
        url: "project",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),

    getProjectsAll: builder.query<
      ProjectType[],
      { name?: string; status?: string }
    >({
      query: ({ name, status }) => {
        const params: Record<string, string> = {};

        // params objektini faqat mavjud qiymatlar bilan to'ldirish
        if (name) params.name = name;
        if (status) params.status = status;

        return {
          url: "project",
          method: "GET",
          params,
        };
      },
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: "Project" as const, id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    // READ (GET ONE)
    getProjectById: builder.query<ProjectResponseType, string | number>({
      query: (id: number) => `project/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Project", id }],
    }),
    // UPDATE
    updateProject: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `project/quick-update/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    //
    // project/23  singlepage
    updateSinglePage: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `project/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    // DELETE
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Project", id },
        { type: "Project", id: "LIST" },
      ],
    }),
    // ///////////////////////////////////////////////
    // //////////////////////////////////////////////
    // /////////////////////////////////////////////

    // READ (TODO BY ID)
    getProjectByTodo: builder.query({
      query: (id) => `project/todo/${id}`,
      providesTags: (result, _error, id) => {
        if (!result?.data) return [{ type: "ProjectTodo", id }];
        return [
          ...result.data.map((todo: todoType) => ({
            type: "ProjectTodo" as const,
            id: todo.id,
          })),
          { type: "ProjectTodo", id: "LIST" },
        ];
      },
    }),

    // update todo
    updateProjectTodo: builder.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `project/todo/update/${id}`,
        method: "PATCH",
        body: updatedData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ProjectTodo", id },
        { type: "ProjectTodo", id: "LIST" },
      ],
    }),

    // remove/14
    deleteProjectTodo: builder.mutation({
      query: (id) => ({
        url: `project/todo/remove/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ProjectTodo", id },
        { type: "ProjectTodo", id: "LIST" },
      ],
    }),

    createProjectTodo: builder.mutation({
      // Birgina object argument qabul qiladi
      query: ({ id, newProject }) => ({
        url: `project/todo/create/${id}`,
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: [{ type: "ProjectTodo", id: "LIST" }],
    }),
  }),
});

export const {
  // for todo
  useUpdateSinglePageMutation,
  useCreateProjectTodoMutation,
  useUpdateProjectTodoMutation,
  useGetProjectByTodoQuery,
  useDeleteProjectTodoMutation,
  // for project
  useCreateProjectMutation,
  useGetProjectsAllQuery,
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = ProjectsApi;
