// "use client";

// import React, { useState, useEffect } from "react";
// import { Modal, Form, Input, Select, Button, notification } from "antd";
// import { PlaygroundItem } from "@/types/Playground";
// import { useGetEmployesNotParamsQuery } from "@/store/slices/EmployesApi";
// import { PayloadAction } from "@reduxjs/toolkit";
// import { EmployesType } from "@/types/Employes";
// import { useCreatePlaygroundMutation } from "@/store/slices/playground/PlaygroundApi";

// const COLORS = [
//   { label: "Blue", color: "#1953E9" },
//   { label: "Yellow", color: "#E9D419" },
//   { label: "Green", color: "#25C225" },
//   { label: "Orange", color: "#E97E19" },
//   { label: "Red", color: "#F81515" },
//   { label: "Purple", color: "#D91CE6" },
// ];

// type propsModal = {
//   open: boolean;
//   onCancel: () => void;
//   initialData: null | PayloadAction<any>; // Typeni kerak bo‘lsa aniqlashtirasiz
// };

// const BoxCreateEditModal: React.FC<propsModal> = ({
//   open,
//   onCancel,
//   initialData,
// }) => {
//   const { data: employes, isLoading } = useGetEmployesNotParamsQuery(undefined);
//   const [createMut, { isLoading: isCreate }] = useCreatePlaygroundMutation();
//   const [api, contextHolder] = notification.useNotification();

//   const [form] = Form.useForm();
//   const [selectedColor, setSelectedColor] = useState("#1953E9");

//   // useEffect(() => {
//   //   if (initialData) {
//   //     form.setFieldsValue({
//   //       name: initialData.name,
//   //       employees: initialData.employees?.map((e: string) => e.fullname),
//   //     });
//   //     setSelectedColor(initialData.color || "#1953E9");
//   //   }
//   // }, [initialData, open, form]);

//   const handleFinish = async (values: PlaygroundItem) => {
//     const payload = {
//       name: values.name,
//       employees: values.employees.map((id) => ({ id })),
//       color: selectedColor,
//     };
//     try {
//       const res = await createMut(payload).unwrap();
//       console.log("Playground created:", res);
//       if (res.status == 201) {
//         api.success({ message: "Playground created successfully!" });
//         form.resetFields();
//         setSelectedColor("#1953E9");
//         onCancel();
//       }
//     } catch (error) {
//       console.error("Error creating playground:", error);
//       api.error({
//         message: "Failed to create playground",
//       });
//     }
//   };

//   return (
//     <>
//       {contextHolder}
//       <Modal
//         title="Add playground"
//         open={open}
//         onCancel={onCancel}
//         footer={null}
//       >
//         <Form form={form} layout="vertical" onFinish={handleFinish}>
//           <Form.Item
//             label="Project name"
//             name="name"
//             rules={[{ required: true, message: "Please enter project name" }]}
//           >
//             <Input placeholder="Write name..." />
//           </Form.Item>

//           <Form.Item
//             label="Add employer"
//             name="employees"
//             rules={[
//               {
//                 required: true,
//                 message: "Please select at least one employer",
//               },
//             ]}
//           >
//             <Select
//               mode="multiple"
//               placeholder="Please select"
//               loading={isLoading}
//               options={employes?.data?.map((item: EmployesType) => ({
//                 value: item.id,
//                 label: `${item.fullname} (${item.role})`,
//               }))}
//             />
//           </Form.Item>

//           <Form.Item label="Color">
//             <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//               {COLORS.map((item) => (
//                 <Button
//                   key={item.color}
//                   type={selectedColor === item.color ? "primary" : "default"}
//                   style={{
//                     borderColor: item.color,
//                     color: selectedColor === item.color ? "#fff" : item.color,
//                     backgroundColor:
//                       selectedColor === item.color ? item.color : "transparent",
//                   }}
//                   onClick={() => setSelectedColor(item.color)}
//                 >
//                   {item.label}
//                 </Button>
//               ))}
//             </div>
//           </Form.Item>

//           <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
//             <Button onClick={onCancel}>Cancel</Button>
//             <Button type="primary" htmlType="submit" loading={isCreate}>
//               Ok
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default BoxCreateEditModal;

"use client";

import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, notification } from "antd";
import { PlaygroundItem } from "@/types/Playground";
import { useGetEmployesNotParamsQuery } from "@/store/slices/EmployesApi";
import { EmployesType } from "@/types/Employes";
import {
  useCreatePlaygroundMutation,
  useUpdatePlaygroundMutation,
} from "@/store/slices/playground/PlaygroundApi";

const COLORS = [
  { label: "Blue", color: "#1953E9" },
  { label: "Yellow", color: "#E9D419" },
  { label: "Green", color: "#25C225" },
  { label: "Orange", color: "#E97E19" },
  { label: "Red", color: "#F81515" },
  { label: "Purple", color: "#D91CE6" },
];

type propsModal = {
  open: boolean;
  onCancel: () => void;
  initialData: null | any;
};

const BoxCreateEditModal: React.FC<propsModal> = ({
  open,
  onCancel,
  initialData,
}) => {
  const { data: employes, isLoading } = useGetEmployesNotParamsQuery(undefined);
  const [createMut, { isLoading: isCreate }] = useCreatePlaygroundMutation();
  const [updateMut, { isLoading: isUpdate }] = useUpdatePlaygroundMutation();
  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [selectedColor, setSelectedColor] = useState("#1953E9");

  // Modal ochilganda ma'lumotlarni o'rnatish
  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode - mavjud ma'lumotlarni formga o'rnatish
        form.setFieldsValue({
          name: initialData.name,
          employees: initialData.employees?.map((emp: any) => emp.id),
        });
        setSelectedColor(initialData.color || "#1953E9");
      } else {
        // Create mode - formni tozalash
        form.resetFields();
        setSelectedColor("#1953E9");
      }
    }
  }, [open, initialData, form]);

  const handleFinish = async (values: PlaygroundItem) => {
    const payload = {
      name: values.name,
      employees: values.employees.map((id) => ({ id })),
      color: selectedColor,
    };

    try {
      let res;

      if (initialData) {
        // Edit mode
        res = await updateMut({
          id: initialData.id,
          data: payload,
        }).unwrap();

        if (res.status === 200) {
          api.success({ message: "Playground yangilandi!" });
        }
      } else {
        // Create mode
        res = await createMut(payload).unwrap();

        if (res.status === 201) {
          api.success({ message: "Playground yaratildi!" });
        }
      }

      // Muvaffaqiyatli amalga oshgandan keyin
      form.resetFields();
      setSelectedColor("#1953E9");
      onCancel();
    } catch (error) {
      console.error("Xatolik:", error);
      api.error({
        message: initialData
          ? "Playground yangilashda xatolik"
          : "Playground yaratishda xatolik",
      });
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedColor("#1953E9");
    onCancel();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={initialData ? "Playground tahrirlash" : "Playground qo'shish"}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Loyiha nomi"
            name="name"
            rules={[{ required: true, message: "Loyiha nomini kiriting" }]}
          >
            <Input placeholder="Nom yozing..." />
          </Form.Item>

          <Form.Item
            label="Xodimlar"
            name="employees"
            rules={[
              {
                required: true,
                message: "Kamida bitta xodim tanlang",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Xodimlarni tanlang"
              loading={isLoading}
              options={employes?.data?.map((item: EmployesType) => ({
                value: item.id,
                label: `${item.fullname} (${item.role})`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Rang">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {COLORS.map((item) => (
                <Button
                  key={item.color}
                  type={selectedColor === item.color ? "primary" : "default"}
                  style={{
                    borderColor: item.color,
                    color: selectedColor === item.color ? "#fff" : item.color,
                    backgroundColor:
                      selectedColor === item.color ? item.color : "transparent",
                  }}
                  onClick={() => setSelectedColor(item.color)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={handleCancel}>Bekor qilish</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isCreate || isUpdate}
            >
              {initialData ? "Yangilash" : "Saqlash"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default BoxCreateEditModal;
