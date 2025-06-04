"use client";

import { useDeletePlaygroundMutation } from "@/store/slices/playground/PlaygroundApi";
import { PlaygroundItem } from "@/types/Playground";
import { Button, Dropdown, MenuProps, Popconfirm, message } from "antd";
import dayjs from "dayjs";
import React from "react";
import { BiEdit } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { HiEllipsisVertical } from "react-icons/hi2";

type propsBox = {
  item: PlaygroundItem;
  setInitialData: (data: null | any) => void; // initialData uchun kerak bo‘lsa aniqlashtirasiz
};

const PlaygroundBox: React.FC<propsBox> = ({ item, setInitialData }) => {
  const [deleteMut, { isLoading: isDelete }] = useDeletePlaygroundMutation();

  const handleDelete = async () => {
    try {
      const res = await deleteMut({ id: item.id }).unwrap();
      if (res.status === 204) {
        message.success("Playground deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete playground:", error);
      message.error("Failed to delete playground");
    }
  };

  const handleEdit = () => {
    setInitialData(item);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "edit",
      label: (
        <span
          onClick={handleEdit}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <BiEdit /> Edit
        </span>
      ),
    },
    {
      key: "delete",
      label: (
        <Popconfirm
          title="Are you sure to delete this playground?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ loading: isDelete }}
        >
          <span
            style={{
              color: "red",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FiDelete /> Delete
          </span>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="box" style={{ border: `1px solid ${item.color}` }}>
      <div className="box__header">
        <p className="header-title" style={{ color: item.color }}>
          {item.name}
        </p>
        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" icon={<HiEllipsisVertical />} />
        </Dropdown>
      </div>
      <div className="box__footer">
        <div className="footer-name">
          <h5>
            Creators: <span>{item.created_by.fullname}</span>
          </h5>
        </div>
        <p className="footer-date">
          {dayjs(+item.created_at).format("DD.MM.YYYY")}
        </p>
      </div>
    </div>
  );
};

export default PlaygroundBox;
