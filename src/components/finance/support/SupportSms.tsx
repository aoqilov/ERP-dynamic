import { useCreateFinanceSupportSmsMutation } from "@/store/slices/finance/FinanceSupportApi";
import { Support } from "@/types/finance/support";
import { Button, Form, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";

type PropsCreate = {
  smsOpen: boolean;
  smsCloes: () => void;
  smsData?: Support | null; // yangi qo‘shildi
};
const SupportSms: React.FC<PropsCreate> = ({ smsCloes, smsOpen, smsData }) => {
  const [api, context] = notification.useNotification();
  const [smsText, setSmsText] = useState<string>("");
  const [create, { isLoading }] = useCreateFinanceSupportSmsMutation();
  console.log(smsData);
  const [form] = useForm();

  useEffect(() => {
    if (smsData) {
      setSmsText(`Are you sure you want to send this message ?

${smsData.project_name} lohiyasi uchun ${smsData.cost} ${smsData.currency.name} miqdordagi oylik to'lovni shu  oyning ${smsData.pay_date}-sanasigacha amalga oshirishingizni so'raymiz! Dynamic Soft.`);
    }
  }, [smsData]);
  async function handleSubmit() {
    if (smsData) {
      const newData = {
        support_id: Number(smsData.id),
      };
      try {
        const resCreate = await create(newData);
        api.success({ message: resCreate.data.message });
        form.resetFields();
        smsCloes();
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div>
      {context}
      <Modal open={smsOpen} onClose={smsCloes} title="Sms" footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item>
            <TextArea
              value={smsText}
              onChange={(e) => setSmsText(e.target.value)}
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={smsCloes} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportSms;
