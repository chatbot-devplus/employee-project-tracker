"use client";
import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import Pagination from "../../components/Pagination";
import FormModal from "../../components/FormModal";
import { getSkills } from "../../api/skills";

type Skill = {
  id: string;
  name: string;
};

const columns = [
  {
    label: "STT",
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

const SkillComponent = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

  const fetchSkills = useCallback(
    async (page: number) => {
      try {
        setLoading(true);

        const { data: dataRoles, total } = await getSkills(page, itemsPerPage);

        setTotalItems(total);
        setSkills(dataRoles as Skill[]);
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
  const handleSkillChange = useCallback(
        (newSkills: Skill, action: "create" | "update" | "delete", data?: Skill) => {
      if (action === "create" && newSkills) {
        setSkills((prevSkills) => [...prevSkills, newSkills]);
        messageApi.open({
          type: "success",
          content: "Skills created successfully!",
        });
      }
      if (action === "update" && newSkills) {
        setSkills((prevSkills) =>
          prevSkills.map((skill) =>
            skill.id === newSkills.id ? newSkills : skill,
          ),
        );
        messageApi.open({
          type: "success",
          content: "Skills updated successfully!",
        });
      }
         if (action === "delete" && data) {
        setSkills((prevSkills) =>
          prevSkills.filter((skill) => skill.id !== data.id),
        );
        messageApi.open({
          type: "success",
          content: "Skills deleted successfully!",
        });
            }
        fetchSkills(currentPage);
        
    },
    [messageApi, currentPage, fetchSkills],
  );
  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
      fetchSkills(page)
  };
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    fetchSkills(currentPage);
  }, [fetchSkills, currentPage]);
  return (
    <>
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {contextHolder}
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">All Skills</h1>
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
                table="skill"
                type="create"
                onItemChange={handleSkillChange}
              />
            </div>
          </div>
        </div>

        <table className="w-full table-auto text-left">
          <thead className="text-gray-500 text-xs uppercase">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="py-4 pl-4 ">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skills.map((item, index: number) => {
              const stt = (currentPage - 1) * itemsPerPage + index + 1;
              return (
                <tr
                  key={item.id}
                  className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
                >
                  <td className="items-center gap-4 p-4">{stt}</td>
                  <td className="flex items-center gap-4 p-4">
                    <div className="flex flex-col">
                      <h3 className="font-semibold">{item.name}</h3>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <FormModal
                        table="skill"
                        type="update"
                        data={item}
                        onItemChange={handleSkillChange}
                      />
                      <FormModal
                        table="skill"
                        type="delete"
                        id={item.id}
                        data={item}
                        onItemChange={handleSkillChange}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
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

export default SkillComponent;