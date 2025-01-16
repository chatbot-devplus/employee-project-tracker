"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Table } from "antd";
import type { TableProps } from "antd";
import { getIDDetailProject } from "../../../api/project";

type DetailProject = {
  id: string;
  name: string;
  description: string;
  status: string;
  start_date: Date;
  end_date: Date;
  project_skills: {
    skill_id: string;
    skills: {
      name: string;
    };
  }[];
};

const columns: TableProps<DetailProject>["columns"] = [
  {
    title: "Project Name",
    dataIndex: "name",
    key: "projectName",
  },
  {
    title: "Project Description",
    dataIndex: "description",
    key: "projectDescription",
  },
  {
    title: "Skills",
    key: "skills",
    className: "hidden lg:table-cell",
    render: (_, record) => (
      <ul>
        {record.project_skills.map((skill) => (
          <li key={skill.skill_id}>{skill.skills.name}</li>
        ))}
      </ul>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Project Start Date",
    dataIndex: "start_date",
    key: "projectStartDate",
  },
  {
    title: "Project End Date",
    dataIndex: "end_date",
    key: "projectEndDate",
  },
];

const DetailProjectPage = () => {
  const [projects, setProjects] = useState<DetailProject[]>([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const id = params?.id;

  const fetchIDEmployees = async () => {
    if (!id) {
      console.error("ID không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const dataEmployees = await getIDDetailProject(id);
      setProjects(dataEmployees as DetailProject[]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchIDEmployees();
    }
  }, [id]);
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="flex-1 mt-10">
        <h2 className="text-2xl font-bold uppercase text-gray-800 border-b-2 border-blue-500 pb-2 mb-5">
          Details Project
        </h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : projects.length > 0 ? (
          <Table<DetailProject>
            columns={columns}
            dataSource={projects}
            rowKey="id"
          />
        ) : (
          <h2 className="text-2xl font-bold uppercase text-gray-800 border-b-2 border-blue-500 pb-2 mb-5">
            Details Project
          </h2>
        )}
      </div>
    </div>
  );
};

export default DetailProjectPage;
