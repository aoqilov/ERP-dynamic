export type PlaygroundItem = {
  id: number | string;
  created_at: string;
  name: string;
  color: string;
  created_by: {
    id: number;
    fullname: string;
    job_title: {
      id: number;
      name: string;
    };
  };
  employees: Employee[];
};
export type Employee = {
  id: number;
  fullname: string;
  job_title: {
    id: number;
    name: string;
  };
};
export type ResponsePlayground = {
  data: PlaygroundItem[];
  message: string;
  status: number;
};
// createPlayground uchun payload
export type PlaygroundCreatePayload = {
  name: string;
  color: string;
  employees: { id: number }[];
};

// ////////////
export type PlaygroundCreateResponse = {
  status: number;
  message: string;
  data: {
    id: number;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
    is_deleted: boolean;
    employees: EmployeeType[];
    created_by: UserType;
  };
};

export type EmployeeType = {
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  birth_date: string;
  address: string;
  date_join: string;
  telegram: string;
  role: string;
  salary: number;
  experience: string;
  is_lead: boolean;
  status: string;
};

export type UserType = {
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  fullname: string;
  username: string;
  email: string;
  password: string;
  phone_number: string;
  birth_date: string;
  address: string;
  date_join: string;
  telegram: string;
  role: string;
  salary: number;
  experience: string;
  is_lead: boolean;
  status: string;
  company: { id: number }[];
  job_title: {
    id: number;
    name: string;
  };
};
// deleye
export type DeleteResponse = {
  data: []; // yoki agar bu doim bo'sh bo'lsa: []
  status: number; // masalan: 200
  message: string; // masalan: "Deleted succesfully!"
};
