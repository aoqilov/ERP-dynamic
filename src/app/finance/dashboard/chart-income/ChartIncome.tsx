import { Select } from "antd";
import React from "react";
import MonthlyChart from "./MonthlyChart";
import { IncomeData } from "@/types/finance/chart";

type ChartIncomeProps = {
  title: string;
  linecolor: string;
  chartData: IncomeData[] | undefined;
};
const ChartIncome: React.FC<ChartIncomeProps> = ({
  title,
  linecolor,
  chartData,
}) => {
  return (
    <div className="income">
      <div className="income__titlebox">
        <div className="titlebox-info">
          <h5 className="info-title">{title}</h5>
          <p className="info-desc">Here you may track financial information</p>
        </div>
        <div className="titlebox-selectbox">
          <Select
            size="large"
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            options={[
              {
                value: "jack",
                label: "Jack",
              },
              {
                value: "lucy",
                label: "Lucy",
              },
              {
                value: "tom",
                label: "Tom",
              },
            ]}
          />
        </div>
      </div>
      <div className="income__chart">
        <MonthlyChart linecolor={linecolor} chartData={chartData} />
      </div>
    </div>
  );
};

export default ChartIncome;
