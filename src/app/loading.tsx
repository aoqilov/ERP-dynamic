import { LoadingOutlined } from "@ant-design/icons";
import { Flex, Spin } from "antd";
import React from "react";

const Loading = () => {
  return (
    <div className="page-loading">
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />} />
      </Flex>
    </div>
  );
};

export default Loading;
