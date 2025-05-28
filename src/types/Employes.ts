export type EmployesType = {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone_number: string;
  telegram: string;
  address: string;
  birth_date: string | number;
  date_join: string | number;
  experience: string;
  password: string | null;
  avatar: string | null;
  salary: number;
  status: string;
  role: string;
  is_active: boolean;
  is_deleted: boolean;
  is_lead: boolean;
  created_at: string | number;
  updated_at: string;

  region: {
    id: number;
  };

  company: {
    id: number;
  };

  job_title: {
    id: number;
  };

  currency: {
    id: number;
  };

  work_experience: {
    id: number;
  };
};
