export type IncomeResponse = {
  current_page: number;
  data: Income[]; // Generik, istalgan model bo'lishi mumkin
  from: number;
  message: string;
  page_size: number;
  per_currency: CurrencyTotal[];
  status_code: number;
  to: number;
  total_elements: number;
  total_pages: number;
};

export interface Income {
  id: number;
  comment: string;
  cost: number;
  currency: string;
  current_rate: number;
  date: number | string;
  income_types: IncomeType[]; // to'liq objectlar
  method: string;
  project_name: string;
  sales_agent: IncomeSalesAgent;
}

export interface IncomeType {
  id: number;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Serverga ketadigan format:
export interface IncomeSubmitPayload {
  comment: string;
  cost: number;
  currency: string;
  current_rate: number;
  date: number | string;
  income_types: { id: number }[]; // faqat id
  method: string;
  project_name: string;
  sales_agent: { id: number };
}

export type CurrencyTotal = {
  currency: string; // Masalan: "USD"
  total_cost: string; // Ehtimol string ko‘rinishida kelgan raqam
};
export type IncomeQueryParams = {
  page: number;
  page_size: number;
  from?: number; // timestamp (milliseconds)
  to?: number; // timestamp (milliseconds)
};
export type IncomeSalesAgent = {
  fullname: string;
  id?: number;
};
