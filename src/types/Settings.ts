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

export interface CurrencyType {
  id: number | undefined;
  name: string;
  rate: number;
  surcharge: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string; // yoki Date agar uni new Date(+created_at) ga o‘zgartirsangiz
  updated_at: string;
  color?: string;
  // yoki Date
}

export type responseCurrency = {
  data: CurrencyType[];
  message: string;
  status: number;
};
