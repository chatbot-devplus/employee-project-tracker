"use client";
import Image from "next/image";
import Link from "next/link";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import FormModal from "../../components/FormModal";
import { getAllProjects } from "../../api/project";
import { message, Spin } from "antd";

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
  const [projects, setProjects] = useState<project[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const fetchProjects = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const { data: dataProjects, total } = await getAllProjects(
          page,
          itemsPerPage,
          debouncedSearchQuery,
          startDate,
          endDate,
        );
        setTotalItems(total);
        setProjects(dataProjects as project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    },
    [
      setLoading,
      setItemsPerPage,
      setProjects,
      setTotalItems,
      debouncedSearchQuery,
      startDate,
      endDate,
    ],
  );

  useEffect(() => {
    fetchProjects(1);
  }, [fetchProjects]);

  const handleProjectChange = useCallback(
    (newProject: project, action: "create" | "update" | "delete") => {
      if (action === "create") {
        setProjects((prevProjects) => [...prevProjects, newProject]);
        messageApi.open({
          type: "success",
          content: "Project created successfully!",
        });
      }
      if (action === "update") {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === newProject.id ? newProject : project,
          ),
        );
        messageApi.open({
          type: "success",
          content: "Project updated successfully!",
        });
      }
      if (action === "delete") {
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== newProject.id),
        );
        messageApi.open({
          type: "success",
          content: "Project deleted successfully!",
        });
      }
    },
    [messageApi],
  );
  const renderRow = useCallback(
    (item: project) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
      >
        <td className="hidden md:table-cell p-4">{item.name}</td>
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
            <FormModal
              table="project"
              type="update"
              data={item}
              onItemChange={handleProjectChange}
            />
            <FormModal
              table="project"
              type="delete"
              id={item.id}
              onItemChange={handleProjectChange}
            />
          </div>
        </td>
      </tr>
    ),
    [handleProjectChange],
  );

  const memoizedTable = useMemo(() => {
    if (loading) {
      return <Spin />;
    }
    return <Table renderRow={renderRow} data={projects} />;
  }, [projects, renderRow, loading]);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchProjects(newPage);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchProjects(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalSearchQuery(query);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  };
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {contextHolder}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Projects</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-gray-500 text-xs">
              Items per page:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-1 rounded-md text-xs border border-gray-300"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-[200px] p-2 bg-transparent outline-none"
                value={localSearchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <label htmlFor="startDate" className="text-gray-500 text-xs">
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              className="p-1 rounded-md text-xs border border-gray-300"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <label htmlFor="endDate" className="text-gray-500 text-xs">
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              className="p-1 rounded-md text-xs border border-gray-300"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            <FormModal
              table="project"
              type="create"
              onItemChange={handleProjectChange}
            />
          </div>
        </div>
      </div>
      {/* LIST */}
      <table className="w-full table-auto text-left">
        <thead className="text-gray-500 text-xs uppercase">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`p-4 ${column.className || ""}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{memoizedTable}</tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default projectsListPage;
