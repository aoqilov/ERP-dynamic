export type ExpenseResponse = {
  current_page: number;
  data: Expense[]; // Generik, istalgan model bo'lishi mumkin
  from: number;
  message: string;
  page_size: number;
  per_currency: CurrencyTotal[];
  status_code: number;
  to: number;
  total_elements: number;
  total_pages: number;
};

export interface Expense {
  id: number;

  comment: string;
  cost: number;
  currency: string;
  current_rate: number;
  date: number | string;
  expense_types: ExpenseType[]; // to'liq objectlar
  method: string;
  project_name: string;
}

export interface ExpenseType {
  id: number;
  name: string;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

// Serverga ketadigan format:
export interface ExpenseSubmitPayload {
  comment: string;
  cost: number;
  currency: string;
  current_rate: number;
  date: number | string;
  expense_types: { id: number }[]; // faqat id
  method: string;
  project_name: string;
}

export type CurrencyTotal = {
  currency: string; // Masalan: "USD"
  total_cost: string; // Ehtimol string ko‘rinishida kelgan raqam
};
export type ExpenseQueryParams = {
  page: number;
  page_size: number;
  from?: number; // timestamp (milliseconds)
  to?: number; // timestamp (milliseconds)
};
