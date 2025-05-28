"use client";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { DatePicker } from "antd";
import CanbanTodo from "./CanbanTodo";
import { useGetCanbanBoardQuery } from "@/store/slices/SalesApi/SlCanbanApi";
import { useState, useEffect } from "react";
import Loading from "@/app/loading";

const { RangePicker } = DatePicker;

const CanbanPage = () => {
  const { data: canbanData, isLoading } = useGetCanbanBoardQuery();
  const [chartSeries, setChartSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [chartColors, setChartColors] = useState<string[]>([]); // 🆕 colors state
  const [totalTaskNumber, setTotalTaskNumber] = useState<
    string | number | undefined
  >(0);
  console.log(canbanData?.data);

  useEffect(() => {
    if (canbanData?.data) {
      const resData = canbanData.data.map((col) => ({
        name: col.name,
        data: [col.canbans?.length],
        //  data: [col.canbans?.filter(c => c.sales_agent.fullname === "Muzaffarxon Abdusalomov").length || 0]
      }));
      const total = resData.reduce((sum, item) => sum + (item.data[0] || 0), 0);

      setTotalTaskNumber(total);
      setChartSeries(resData);
      const resColors = canbanData.data.map((col) => col.color || "#CCCCCC");
      setChartColors(resColors);
    }
  }, [canbanData]);

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

    dataLabels: {
      enabled: true,
    },
    tooltip: {
      shared: false,
      intersect: true,
      custom: function ({ seriesIndex, dataPointIndex, w }) {
        const seriesName = w.config.series[seriesIndex].name;
        const value = w.config.series[seriesIndex].data[dataPointIndex];
        const categoryLabel = w.config.xaxis.categories[dataPointIndex];

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
    colors: chartColors, // ✅ dynamic colors

    annotations: {
      points: [
        {
          x: totalTaskNumber, // umumiy qiymat (total)
          y: "Muzaffarxon Abdusalomov", // xaxis.categories dagi qiymat
          marker: {
            size: 0, // markerni yo'q qilamiz
          },
          label: {
            text: `${totalTaskNumber}`,
            style: {
              fontSize: "30px",
              color: "#000000",
              fontWeight: 600,
            },
            offsetX: 40, // chapga / o'ngga siljitish
            offsetY: 20,
          },
        },
      ],
    },
  };

  if (isLoading) return <Loading />;
  if (!canbanData?.data) return <p>No data</p>;

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
