/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import {
  useCreatePlaygroundColumnMutation,
  usePatchPlaygroundSectionMutation,
} from "@/store/slices/playground/PlaygroundApi";

const COLORS = [
  { name: "Blue", color: "#1953E9" },
  { name: "Yellow", color: "#FFC700" },
  { name: "Green", color: "#1A8400" },
  { name: "Orange", color: "#F76707" },
  { name: "Red", color: "#F81515" },
  { name: "Purple", color: "#D64CED" },
];

type Props = {
  open: boolean;
  onCancel: () => void;
  id: number | null;
  initialData: any;
};

export default function TaskColumnCreateEdit({
  open,
  onCancel,
  id,
  initialData,
}: Props) {
  const [createColumn, { isLoading: isCreate }] =
    useCreatePlaygroundColumnMutation();
  // edit
  const [editColumn, { isLoading: isEdit }] =
    usePatchPlaygroundSectionMutation(); // Assuming you have a mutation for editing columns
  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState(COLORS[0].color);
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
      });
      setSelectedColor(initialData.color || COLORS[0].color);
    } else {
      form.resetFields();
      setSelectedColor(COLORS[0].color);
    }
  }, [initialData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: values.name,
        color: selectedColor,
        playground: { id: id },
      };

      if (initialData) {
        // Edit rejimi
        await editColumn({
          id: initialData.id,
          data: payload,
        }).unwrap();
        console.log("Column updated successfully");
      } else {
        // Create rejimi
        await createColumn(payload).unwrap();
        console.log("Column created successfully");
      }

      form.resetFields();
      setSelectedColor(COLORS[0].color);
      onCancel();
    } catch (err) {
      console.error("Failed to create or update column:", err);
    }
  };

  return (
    <Modal
      title="Add section"
      open={open}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setSelectedColor(COLORS[0].color);
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={handleOk}
          loading={initialData ? isEdit : isCreate}
        >
          Ok
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="Section name"
          name="name"
          rules={[{ required: true, message: "Please enter section name" }]}
        >
          <Input placeholder="Write name…" />
        </Form.Item>

        <div className="mb-2 font-medium text-sm">Color</div>
        <div className="flex flex-wrap gap-3" style={{ paddingBottom: "10px" }}>
          {COLORS.map((c) => (
            <Button
              key={c.name}
              type="default"
              onClick={() => setSelectedColor(c.color)}
              className={`px-3 py-1 rounded border font-medium text-sm ${
                selectedColor === c.color
                  ? "text-white border-transparent"
                  : `text-[${c.color}] border-[${c.color}]`
              }`}
              style={{
                marginRight: "5px",
                backgroundColor:
                  selectedColor === c.color ? c.color : "transparent",
                color: selectedColor === c.color ? "#fff" : c.color,
                borderColor: c.color,
              }}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </Form>
    </Modal>
  );
}
