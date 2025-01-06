"use client";

import Image from "next/image";
import Link from "next/link";
import { projectsData } from "../../../lib/projectsData";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import React, { useState } from "react";
// import ProjectForm from "../../../components/forms/ProjectForm";
import FormModal from "../../../components/FormModal";
export type project = {
  id: string;
  projectID: string;
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  is_destroy: boolean;
  skill: string[];
};

const columns = [
  {
    label: "project ID",
    key: "projectID",
    className: "hidden md:table-cell",
  },
  {
    label: "Project name",
    key: "name",
    className: "hidden lg:table-cell",
  },
  {
    label: "status",
    key: "status",
    className: "hidden lg:table-cell",
  },
  {
    label: "Start date",
    key: "startDate",
    className: "hidden lg:table-cell",
  },
  {
    label: "End date",
    key: "endDate",
    className: "hidden lg:table-cell",
  },
  {
    label: "Actions",
    key: "action",
  },
];

const projectsListPage = () => {
  const [modalType, setModalType] = useState<"create" | "update" | "delete" |null>(null);
  const [selectProject, setSelectProject] = useState<project | null>(null);

  const handleShowForm = (type: "create" | "update" | "delete", project?: project) => {
    setModalType(type);
    setSelectProject(project || null);
    console.log("đang clickon");
  }
  const handleCloseForm = () => {
    setModalType(null);
    setSelectProject(null);
  }

  const renderRow = (item: project) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="hidden md:table-cell">{item.projectID}</td>
      <td className="hidden md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td className="hidden md:table-cell">{item.startDate}</td>
      <td className="hidden md:table-cell">{item.endDate}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="project" type="update" data={item} />
          <FormModal table="project" type="delete" id={item.id} />

        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">

      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Projects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreenLight">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreenLight">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="project" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns= {columns} renderRow={renderRow} data={projectsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default projectsListPage;
