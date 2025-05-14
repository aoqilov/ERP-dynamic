"use client";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { DatePicker } from "antd";
import CanbanTodo from "./CanbanTodo";
import { useGetCanbanBoardQuery } from "@/store/slices/SalesApi/SlCanbanApi";

const { RangePicker } = DatePicker;
const CanbanPage = () => {
  const { data: canbanData, isLoading } = useGetCanbanBoardQuery();

  if (isLoading) return <p>Loading...</p>;
  if (!canbanData?.data) return <p>No data</p>;

  console.log(canbanData); // ✅ Tip xatoliksiz

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "20%",
      },
    },
    xaxis: {
      categories: ["Muzaffarxon Abdusalomov"],
    },
    legend: {
      position: "top",
    },
    fill: {
      opacity: 1,
    },
    colors: [
      "#FF3C38", // Backlog
      "#6D4C41", // In progress
      "#8D6E63", // Ready prod
      "#4CAF50", // Qoulified
      "#000000", // Meeting
      "#8BC34A", // Abdulaziz
      "#E0E0E0", // Taklif qinindi
    ],
    dataLabels: {
      enabled: true,
    },
    tooltip: {
      shared: false,
      intersect: true,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.config.series[seriesIndex].name;
        const value = w.config.series[seriesIndex].data[dataPointIndex];
        const categoryLabel = w.config.xaxis.categories[dataPointIndex]; // 'Muzaffarxon Abdusalomov'

        return `
      <div style="padding: 8px; font-size: 14px;">
        <p><strong>${categoryLabel}</strong></p>
        <div>
          <span style="color: ${w.config.colors[seriesIndex]}; font-weight: bold;">●</span>
          ${seriesName}: ${value}
        </div>
      </div>
    `;
      },
    },
  };

  const chartSeries = [
    { name: "Backlog", data: [1] },
    { name: "In progress", data: [4] },
    { name: "Ready prod", data: [1] },
    { name: "Qoulified", data: [4] },
    { name: "meeting", data: [1] },
    { name: "abdulaziz", data: [1] },
    { name: "Taklif qinindi", data: [1] },
  ];

  return (
    <div className="canban">
      <div className="canban__header">
        <h5 className="header-title">Canban</h5>
        <p className="header-description">
          Here you may track information about sales
        </p>
      </div>
      <div className="canban__chart">
        <div className="titlebox">
          <h5 className="chart-title">Sales Performance</h5>
          <div className="chart-date">
            <RangePicker />
          </div>
        </div>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
      <div className="canban__box">
        <CanbanTodo />
      </div>
    </div>
  );
};

export default CanbanPage;
