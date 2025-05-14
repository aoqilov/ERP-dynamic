import React from "react";
import TaskCard from "./taskCanban";
import { Button, Dropdown, Menu } from "antd";
import { FaAngleDown } from "react-icons/fa6";
import "../../../wscss/components/canban/_canbanColumn.scss";
import { FaPlus } from "react-icons/fa";

function Column({ column, tasks }) {
  const totalId = tasks.reduce((sum, item) => sum + item.id, 0);
  const menu = (
    <Menu
      items={tasks.map((item) => ({
        key: item.id,
        label: `count id:${totalId}`,
      }))}
    />
  );
  return (
    <div
      className="column"
      style={{
        padding: "10px",
        borderRadius: "8px",
        width: "250px",
      }}
    >
      <div className="column__title">
        <h3
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: column.color,
          }}
        >
          {column.name}
        </h3>
        <Dropdown menu={menu} trigger={["hover"]}>
          <Button type="default" icon={<FaAngleDown />} iconPosition="end">
            Overall Cost
          </Button>
        </Dropdown>
      </div>
      <div className="column__border"></div>
      <div className="column__add">
        <Button
          style={{ width: "100%", color: "#a4a4a4" }}
          type="default"
          icon={<FaPlus />}
          iconPosition="end"
        >
          New card
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} column={column} />
        ))}
      </div>
    </div>
  );
}

export default Column;
