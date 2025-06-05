"use client";

import { useGetPlaygroundCanbanIDQuery } from "@/store/slices/playground/PlaygroundApi";
import { useParams } from "next/navigation";
import React from "react";

const PlaygroundCanbanid = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetPlaygroundCanbanIDQuery({ id });

  if (isLoading) return <div>Loading...</div>;
  console.log(data);
  return (
    <div className="playcanban">
      <div className="playcanban__header">
        <h5>{data?.data.name}</h5>
      </div>
      <div className="playcanban__board"></div>
      PlaygroundCanbanboard
    </div>
  );
};

export default PlaygroundCanbanid;
