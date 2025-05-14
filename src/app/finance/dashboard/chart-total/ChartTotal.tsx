"use client";
import dynamic from "next/dynamic";
import React from "react";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartTotal = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    title: {
      text: "Project Summary", // <-- Sarlavha
      align: "center", // "left", "right", "center"
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
        },
      },
    ],
  };

  return (
    <div className="total">
      <div className="total__content">
        <ReactApexChart
          options={chartOptions}
          series={[44, 55, 41]}
          type="donut"
          width={360}
        />
        <ul className="content-info">
          <li>
            <b>bank</b>: 5&nbsp;530
          </li>
          <li>
            <b>card</b>: 5&nbsp;074&nbsp;455
          </li>
          <li>
            <b>cash</b>: 89&nbsp;010
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChartTotal;
