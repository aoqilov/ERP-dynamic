import { Button } from "antd";
import React from "react";
import { TbReplace } from "react-icons/tb";
import ChartTotal from "./chart-total/ChartTotal";
import ChartIncome from "./chart-income/ChartIncome";

const DashboardPage = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__titlebox">
        <div className="titlebox-info">
          <h5 className="info-title">Balance</h5>
          <p className="info-desc">
            Here you may track information of the Balance
          </p>
        </div>
        <div className="titlebox-btn">
          <Button type="default" icon={<TbReplace />} iconPosition="start">
            Convert
          </Button>
        </div>
      </div>
      <div className="dashboard__total">
        <ChartTotal />
        <ChartTotal />
      </div>
      <div className="dashboard__convert2">
        <ChartTotal />
        <ChartTotal />
      </div>
      <div className="dashboard__second">
        <ChartTotal />
        <ChartTotal />
      </div>
      <div className="dashboard__income">
        <ChartIncome title="Income" linecolor="#0070f3" />
      </div>
      <div className="dashboard__expense">
        <ChartIncome title="Expense" linecolor="#ED4D5D" />
      </div>
    </div>
  );
};

export default DashboardPage;
