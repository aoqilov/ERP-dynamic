export interface StatusResponseCanban {
  data: StatusResponseCanbanItem;
  message: string;
  status: number;
}

export interface StatusResponseCanbanItem {
  id: number;

  name: string;
  color: string;
  canbans: CanbanItem[];
  total: TotalItem[];
}

export interface CanbanItem {
  id: number;
  project_name: string;
  phone_number: string;
  client_name: string;
  cost: number;
  currency: Currency;
  current_rate: number;
  date: string; // Agar timestamp bo‘lsa, string yoki number
  description: string;
  order: number;
  sales_agent: SalesAgent;
}

export interface Currency {
  id: number;
  name: string;
  rate: number;
}

export interface SalesAgent {
  id: number;
  fullname: string;
  email: string;
  phone_number: string;
  telegram: string;
  experience: string;
}

export interface TotalItem {
  currency: string;
  total_cost: string;
}
