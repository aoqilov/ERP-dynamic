"use client";

import { Select } from "antd";

import { Input } from "antd";
// import type { GetProps } from "antd";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectAddModal from "@/components/projects/ProjectAddModal";
import { useGetProjectsAllQuery } from "@/store/slices/ProjectsApi";

// type SearchProps = GetProps<typeof Input.Search>;
const ProjectLayout = () => {
  // rtk-query
  const { data: projects, isLoading, error } = useGetProjectsAllQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading projects</p>;

  // // for header search and select
  // const onSearch: SearchProps["onSearch"] = (value) => {
  //   // console.log(value);
  // };
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };

  return (
    <div className="project">
      <div className="project__header">
        <div className="header-inputs">
          <Input.Search
            variant="outlined"
            placeholder="input search text"
            // onSearch={onSearch}
            style={{ width: 300 }}
          />
          <Select
            placeholder="select"
            style={{ width: 180 }}
            // onChange={handleChange}
            options={[
              { value: "jack", label: "Jack" },
              { value: "lucy", label: "Lucy" },
              { value: "Yiminghe", label: "yiminghe" },
              { value: "disabled", label: "Disabled", disabled: true },
            ]}
          />
        </div>
        <ProjectAddModal />
      </div>
      <div className="project__cards">
        <ProjectCard projects={projects?.data} />
      </div>
    </div>
  );
};

export default ProjectLayout;
