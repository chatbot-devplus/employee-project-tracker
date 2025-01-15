"use client";
import React, { useState, useEffect, useCallback } from "react";
import { getAllRole } from "../../api/roles";
import { message } from "antd";
import Pagination from "../../components/Pagination";
import FormModal from "../../components/FormModal";

type Role = {
  id: string;
  role_name: string;
};

const columns = [
  { label: "STT",
    key: "stt",
  },
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Actions",
    key: "action",
  },
];

const RolesComponent = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchRoles = useCallback(
    async (page: number) => {
      try {
        setLoading(true);

        const { data: dataRoles, total } = await getAllRole(page, itemsPerPage);

        setTotalItems(total);
        setRoles(dataRoles as Role[]);
      } catch (error) {
        console.error("Error fetching roles: ", error);
        messageApi.open({
          type: "error",
          content: "Failed to fetch roles. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [itemsPerPage, messageApi],
  );

  const handleRoleChange = useCallback(
    (newRoles: Role, action: "create" | "update" | "delete") => {
      if (action === "create") {
        setRoles((prevRoles) => [...prevRoles, newRoles]);
        messageApi.open({
          type: "success",
          content: "Role created successfully!",
        });
      }
      if (action === "update") {
        setRoles((prevRoles) =>
          prevRoles.map((role) => (role.id === newRoles.id ? newRoles : role)),
        );
        messageApi.open({
          type: "success",
          content: "Role updated successfully!",
        });
      }
      if (action === "delete") {
        setRoles((prevRoles) =>
          prevRoles.filter((role) => role.id !== newRoles.id),
        );
        messageApi.open({
          type: "success",
          content: "Role deleted successfully!",
        });
      }
    },
    [messageApi],
  );

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    fetchRoles(currentPage);
  }, [fetchRoles, currentPage]);

  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {contextHolder}
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Roles</h1>
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
            </div>
            <div className="flex items-center gap-4 self-end">
              <FormModal
                table="role"
                type="create"
                onItemChange={handleRoleChange}
              />
            </div>
          </div>
        </div>

        <table className="w-full table-auto text-left">
          <thead className="text-gray-500 text-xs uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="py-4 pl-4">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((item, index: number) => {
              const stt = (currentPage - 1) * itemsPerPage + index + 1;
              return(
              
              <tr
                key={item.id}
                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
              >
                <td className="items-center gap-4 p-4">
                  {stt}
                </td>
                <td className="flex items-center gap-4 p-4">
                  <div className="flex flex-col">
                    <h3 className="font-semibold">{item.role_name}</h3>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <FormModal
                      table="role"
                      type="update"
                      data={item}
                      onItemChange={handleRoleChange}
                    />
                    <FormModal
                      table="role"
                      type="delete"
                      id={item.id}
                      onItemChange={handleRoleChange}
                    />
                  </div>
                </td>
              </tr>
            
            );
            })
          }
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default RolesComponent;
