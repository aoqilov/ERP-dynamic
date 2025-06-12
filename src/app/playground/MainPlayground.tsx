/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import PlaygroundBox from "./PlaygroundBox";
import { useGetPlaygroundQuery } from "@/store/slices/playground/PlaygroundApi";
import Loading from "../loading";
import BoxCreateEditModal from "@/components/playground/BoxCreateEditModal";

const MainPlayground = () => {
  const { data, isLoading } = useGetPlaygroundQuery();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [initialData, setInitialData] = useState<null | any>(null);

  useEffect(() => {
    if (initialData) {
      setOpenModal(true);
    }
  }, [initialData]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setInitialData(null); // Modal yopilganda initialData ni tozalash
  };

  const handleOpenCreateModal = () => {
    setInitialData(null); // Create mode uchun null qilish
    setOpenModal(true);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="playground">
        <div className="playground__header">
          <div className="header-info">
            <div className="info-title">Task playground</div>
            <div className="info-paragrph"> List of playgrounds</div>
          </div>
          <div className="header-btns">
            <Button
              onClick={handleOpenCreateModal}
              icon={<FaPlus />}
              iconPosition="start"
              type="primary"
            >
              Add playground
            </Button>
          </div>
        </div>
        <div className="playground__boxes">
          {data
            ? data?.data.map((item) => {
                return (
                  <PlaygroundBox
                    key={item.id}
                    item={item}
                    setInitialData={setInitialData}
                  />
                );
              })
            : "Ma'lumot yo'q"}
        </div>
      </div>
      <BoxCreateEditModal
        open={openModal}
        onCancel={handleCloseModal}
        initialData={initialData}
      />
    </>
  );
};

export default MainPlayground;
