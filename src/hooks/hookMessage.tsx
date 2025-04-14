import { message } from "antd";

// Custom hook to use message API
const hookMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (
    type: "success" | "error" | "info" | "warning",
    content: string
  ) => {
    messageApi[type](content);
  };

  return { showMessage, contextHolder };
};

export default hookMessage;
