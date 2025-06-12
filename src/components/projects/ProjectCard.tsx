"use client";
import { LuCalendarCheck2, LuCalendarClock } from "react-icons/lu";
import ProjectEditModal from "./ProjectEditModal";
import Link from "next/link";
import React, { useState } from "react";
import { VscEdit } from "react-icons/vsc";
import "@/wscss/components/projects/_projectCard.scss";
import { ProjectType } from "@/types/Project";
import { Progress, ProgressProps } from "antd";

interface propsProjects {
  projects: ProjectType[];
}
const ProjectCard: React.FC<propsProjects> = ({ projects }) => {
  const [editProjectData, setEditProjectData] = useState<ProjectType | null>(
    null
  );
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openEditModal = (id: number) => {
    const edData = projects.find((item) => item.id === id);
    if (edData) {
      setEditProjectData(edData);
      setIsEditOpen(true); // modalni shu yerda ochamiz
    }
  };

  const closeEditModal = () => {
    setIsEditOpen(false);
    setEditProjectData(null);
  };
  const getColor = (value: number) => {
    if (value >= 100) return "#00F700";
    if (value >= 60) return "blue";
    if (value >= 30) return "#FFCC00";
    return "#FA001C";
  };

  return (
    <>
      {projects.length !== 0 ? (
        projects.map((item) => (
          <div className="project-card" key={item.id}>
            <div className="card-header">
              <p className="header-text">
                <Link href={`/projects/${item.id}`}>{item.name}</Link>
              </p>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  if (item.id) openEditModal(item.id); // Tekshirish qo'shildi
                }}
              >
                <VscEdit size={22} color="blue" />
              </div>
            </div>
            <div className="card-foter">
              <div className="foter-times" style={{ textAlign: "center" }}>
                <div className="time-start">
                  <LuCalendarClock size={13} color="rgba(104, 102, 102, 1)" />
                  <p className="start-text">
                    {new Date(Number(item.start)).toLocaleDateString()}
                  </p>
                </div>
                <div className="time-status">{item.status}</div>
                <div className="time-start">
                  <LuCalendarCheck2 size={13} color="rgba(104, 102, 102, 1)" />
                  <p className="start-text">
                    {new Date(Number(item.deadline)).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="foter-progres">
                <Progress
                  percent={item.passed_time}
                  strokeColor={getColor(item.passed_time)}
                  strokeWidth={23}
                  format={(percent) => (
                    <span
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: "5px",
                        transform: "translateX(-50%)",
                        color: "white",
                        fontSize: 14,
                      }}
                    >
                      {percent}%
                    </span>
                  )}
                  strokeLinecap="butt"
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>no data</p>
      )}

      {/* Modalni alohida joyda render qilamiz */}
      {editProjectData && (
        <ProjectEditModal
          editData={editProjectData}
          open={isEditOpen}
          onClose={closeEditModal}
        />
      )}
    </>
  );
};

export default ProjectCard;
