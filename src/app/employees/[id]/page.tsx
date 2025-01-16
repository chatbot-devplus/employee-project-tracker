"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getIDEmployees, getInforFromProject } from "../../../api/employee";
import { useParams } from "next/navigation";
import { Table } from "antd";
import type { TableProps } from "antd";
import { CiCalendar } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { IoBriefcaseOutline } from "react-icons/io5";
import { BsAward } from "react-icons/bs";

type Employee = {
  id: string;
  name: string;
  email: string;
  joining_date: string;
  isDestroy: boolean;
  role_id: string;
  roles: {
    role_name: string;
  };
  employee_skills: {
    skill_id: string;
    skills: {
      name: string;
    };
  }[];
};

type EmployeeProject = {
  id: string;
  joining_date: string;
  outing_date: string;
  role: string;
  projects: {
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: string;
  };
  employees: {
    name: string;
    joining_date: string;
  };
};

const columns: TableProps<EmployeeProject>["columns"] = [
  {
    title: "Project Name",
    dataIndex: ["projects", "name"],
    key: "projectName",
  },
  {
    title: "Project Description",
    dataIndex: ["projects", "description"],
    key: "projectDescription",
  },
  {
    title: "Project Start Date",
    dataIndex: ["projects", "start_date"],
    key: "projectEndDate",
  },
  {
    title: "Project End Date",
    dataIndex: ["projects", "end_date"],
    key: "projectStartDate",
  },
  {
    title: "Employee Joining Date",
    dataIndex: "joining_date",
    key: "employeeJoiningDate",
  },

  {
    title: "Status",
    key: "status",
    render: (_, record) => (
      <button
        className={`px-4 py-2 text-white rounded ${
          record.outing_date
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {record.outing_date ? "Exited" : "On-going"}
      </button>
    ),
  },
];

const SingleEmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee_project, setEmployeesProject] = useState<EmployeeProject[]>(
    [],
  );
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
      const dataEmployees = await getIDEmployees(id);

      if (!dataEmployees || !Array.isArray(dataEmployees)) {
        console.error("Dữ liệu trả về không hợp lệ:", dataEmployees);
        setEmployees([]);
        return;
      }
      setEmployees(dataEmployees as Employee[]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIDEmployeesProject = async () => {
    try {
      setLoading(true);
      const dataEmployeesProject = await getInforFromProject(id);
      setEmployeesProject(dataEmployeesProject as EmployeeProject[]);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchIDEmployees();
      fetchIDEmployeesProject();
    }
  }, [id]);
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full">
        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden max-w-2xl mx-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Đang tải...</div>
          ) : employees.length > 0 ? (
            employees.map((employee) => (
              <div key={employee.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-8">
                  <div className="shrink-0">
                    <Image
                      src="https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3408.jpg"
                      alt="Employee"
                      width={144}
                      height={144}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                  </div>
                  <div className="flex-1 space-y-4 text-center sm:text-left">
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
                      {employee.name}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <CiCalendar className="h-5 w-5 text-emerald-600" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {employee.joining_date}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <AiOutlineMail className="h-5 w-5 text-emerald-600" />
                        <span className="text-gray-600 text-sm sm:text-base truncate max-w-[200px] sm:max-w-full">
                          {employee.email}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <IoBriefcaseOutline className="h-5 w-5 text-emerald-600" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {employee.roles?.role_name
                            ? `Career: ${employee.roles.role_name}`
                            : "No role assigned"}
                        </span>
                      </div>

                      <div className="flex items-center justify-center sm:justify-start gap-3">
                        <BsAward className="h-5 w-5 text-emerald-600" />
                        <span className="text-gray-600 text-sm sm:text-base">
                          {employee.employee_skills?.length
                            ? `Skills: ${employee.employee_skills
                                .map((skill) => skill.skills?.name)
                                .filter((name) => name)
                                .join(", ")}`
                            : "No skills assigned"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Không tìm thấy nhân viên với ID này.
            </div>
          )}

          <div className="h-2 bg-emerald-500 bg-opacity-50"></div>
        </div>

        <div className="flex-1 mt-10">
          {loading ? (
            <p>Đang tải...</p>
          ) : employee_project.length > 0 ? (
            <Table<EmployeeProject>
              columns={columns}
              dataSource={employee_project}
              rowKey="id"
              pagination={{ pageSize: 3, position: ["bottomCenter"] }}
            />
          ) : (
            <h2 className="text-2xl font-bold uppercase text-gray-800 border-b-2 border-blue-500 pb-2 mb-5">
              This employee has not participated in any projects
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleEmployeePage;
