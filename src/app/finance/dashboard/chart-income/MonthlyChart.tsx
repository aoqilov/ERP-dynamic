"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type MonthlyData = {
  month: string;
  total: number;
};

const chartData: MonthlyData[] = [
  { month: "2024-06", total: 0 },
  { month: "2024-07", total: 0 },
  { month: "2024-08", total: 0 },
  { month: "2024-09", total: 16884000 },
  { month: "2024-10", total: 13410180000 },
  { month: "2024-11", total: 0 },
  { month: "2024-12", total: 0 },
  { month: "2025-01", total: 197200000 },
  { month: "2025-02", total: 2790887400 },
  { month: "2025-03", total: 0 },
  { month: "2025-04", total: 0 },
  { month: "2025-05", total: 1260000 },
];

type monthChart = {
  linecolor: string;
};
const MonthlyChart: React.FC<monthChart> = ({ linecolor }) => {
  const options: ApexOptions = {
    chart: {
      id: "monthly-chart",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    xaxis: {
      categories: chartData.map((d) => d.month.slice(5)),
    },
    yaxis: {
      labels: {
        formatter: (val: number) => val.toLocaleString(),
      },
    },
    stroke: {
      curve: "straight" as const, // TypeScript uchun aniq tip berildi
      width: 2,
    },
    colors: [linecolor],
    dataLabels: { enabled: false },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
  };

  const series = [
    {
      name: "Total",
      data: chartData.map((d) => d.total),
    },
  ];

  return <Chart options={options} series={series} type="line" height={400} />;
};

export default MonthlyChart;
