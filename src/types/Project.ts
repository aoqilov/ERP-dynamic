export type ProjectType = {
  id?: number;
  name?: string;
  description?: string | null;
  client_name?: string | null;
  client_phone_number?: string | null;
  project_lead?: string | null;
  status?: string;
  is_active?: boolean;
  is_deleted?: boolean;
  start: number;
  deadline: number;
  passed_time?: number;
  created_at?: string;
  updated_at?: string;
  data: [];
};

export type ProjectAllProp = {
  data: ProjectType[]; // Bu massivni o'z ichiga oladi
  message: string;
  status: number;
};
export type ProjectResponseType = {
  data: ProjectType;
};

export type todoType = {
  created_at: string;
  id: number;
  is_active: boolean;
  is_checked: boolean;
  is_deleted: boolean;
  name: string;
  updated_at: string;
};
