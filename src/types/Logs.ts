export type LogType = {
  id: number;
  changed_deadline: string; // Ehtimol bu string ko‘rinishidagi timestamp (millisecond)
  previous_deadline: string;
  changed_status: string;
  previous_status: string;
  comment: string;
  createdAt: string; // Bu ham timestamp (millisecond)
  project: {
    name: string;
  };
  updatedBy: {
    fullname: string;
  };
  total_elements: number;
};
export type LogResponse = {
  data: LogType[];
  total_elements: number;
  page: number;
  page_size: number;
};
