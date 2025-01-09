"use client";

import Image from "next/image";
import Link from "next/link";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import React, { useEffect, useState } from "react";
import FormModal from "../../../components/FormModal";
import { getAllProjects } from "../../../api/project";
export type project = {
  id: string;
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  is_destroyed: boolean;
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

  const [reload, setReload] = useState(false);

  const [projects, setProjects] = useState<project[]>([]);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getAllProjects();
        setProjects(response);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [reload]);

  const onItemChange = () => {
    setReload(!reload);
  };

  const renderRow = (item: project) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
    >
      <td className="hidden md:table-cell">{item.id}</td>
      <td className="hidden md:table-cell">{item.name}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td className="hidden md:table-cell">{item.start_date}</td>
      <td className="hidden md:table-cell">{item.end_date}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="project" type="update" data={item} onItemChange={onItemChange} />
          <FormModal table="project" type="delete" id={item.id} onItemChange={onItemChange} />

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
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreen">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaGreen">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="project" type="create" onItemChange={onItemChange}/>
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns= {columns} renderRow={renderRow} data={projects} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default projectsListPage;
