"use client";

import { Input, Select } from "antd";

// import type { GetProps } from "antd";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectAddModal from "@/components/projects/ProjectAddModal";
import { useGetProjectsAllQuery } from "@/store/slices/ProjectsApi";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";

// type SearchProps = GetProps<typeof Input.Search>;
const ProjectLayout = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedValue, setSelectedValue] = useState<string | undefined>("");
  const debouncedSearch = useDebounce(searchInput, 500);

  // rtk-query
  const {
    data: projects,
    isLoading,
    error,
  } = useGetProjectsAllQuery({
    name: debouncedSearch,
    status: selectedValue,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects</p>;

  console.log(projects);

  return (
    <div className="project">
      <div className="project__header">
        <div className="header-inputs">
          <Input.Search
            placeholder="Search project"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Select Status"
            style={{ width: 180 }}
            onChange={setSelectedValue}
            value={selectedValue}
            allowClear
            options={[
              { value: "", label: "All" },
              { value: "not started", label: "Not started" },
              { value: "inprogress", label: "In progress" },
              { value: "testing", label: "Testing" },
              { value: "stoped", label: "Stopped" },
              { value: "finished", label: "Finished" },
              { value: "archived", label: "Archived" },
            ]}
          />
        </div>
        <ProjectAddModal />
      </div>
      <div className="project__cards">
        <ProjectCard projects={projects?.data ?? []} />
      </div>
    </div>
  );
};

export default ProjectLayout;
