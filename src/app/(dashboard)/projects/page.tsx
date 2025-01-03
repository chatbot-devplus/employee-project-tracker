'use client';

import Image from "next/image";
import Link from "next/link";
import { projectsData } from "../../../lib/projectsData";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import React, { useState } from "react";
import CreateProjectForm from "../../../components/CreateProjectForm";

export type project = {
  id: number;
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
    header: "project ID",
    accessor: "projectID",
    className: "hidden md:table-cell",
  },
  {
    header: "Project name",
    accessor: "name",
    className: "hidden lg:table-cell",
  },
  {
    header: "status",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Start date",
    accessor: "startDate",
    className: "hidden lg:table-cell",
  },
  {
    header: "End date",
    accessor: "endDate",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const employeesListPage = () => {
  const [showForm, setShowForm] = useState(false);
  const handleCreateProject = (newProject: any) => {
    console.log("New Project:", newProject);
    // Logic lưu trữ project mới (có thể cập nhật state hoặc gọi API)
  };
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
          <Link href={`/employees/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            <Image src="/delete.png" alt="" width={16} height={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            <Image src="/update.png" alt="" width={16} height={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* Hiển thị form khi nhấn nút */}
      {showForm && (
        <CreateProjectForm
          onSubmit={handleCreateProject}
          onClose={() => setShowForm(false)}
        />
      )}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Projects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreenLight">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreenLight">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <button 
            onClick={() => setShowForm(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreenLight">
              <Image src="/create.png" alt="" width={14} height={14} />
            </button>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={projectsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default employeesListPage;

