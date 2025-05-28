export type IncomeChartResponse = {
  data: IncomeData[];
  message: string;
  status: number;
};

export type IncomeData = {
  month: string;
  total: number;
};
