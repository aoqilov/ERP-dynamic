export interface ResponseSupportMain {
  current_page: number;
  data: Support[] | undefined;
  from: number;
  message: string;
  page_size: number;
  per_currency: {
    currency: string;
    total_cost: string;
  }[];
  status_code: number;
  to: number;
  total_elements: number;
  total_pages: number;
}
export type Support = {
  id: number;
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  balance: number;
  cost: number;
  comment: string;
  pay_date: number | string;
  phone_number: string;
  project_name: string;
  currency: {
    id?: number;
    is_active?: boolean;
    is_deleted?: boolean;
    created_at?: string;
    updated_at?: string;
    name?: string;
  };
};
