export interface JobTitle {
  id: number;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string; // yoki: number; agar timestamp number bo'lsa
  updated_at: string;
}

export type responseJob = {
  data: JobTitle[];
  message: string;
  status: number;
};
