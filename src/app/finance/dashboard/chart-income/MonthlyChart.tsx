"use client";

import { IncomeData } from "@/types/finance/chart";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type monthChart = {
  linecolor: string;
  chartData: IncomeData[] | undefined;
};
const MonthlyChart: React.FC<monthChart> = ({ linecolor, chartData }) => {
  if (!chartData || !Array.isArray(chartData)) return null;

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
