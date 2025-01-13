"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getIDEmployees, getInforFromProject } from "../../../../api/employee";
import { useParams } from "next/navigation";
import { Table } from 'antd';
import type { TableProps } from 'antd';


type Employee = {
  id: string;
  name: string;
  email: string;
  joining_date: string;
  isDestroy: boolean;
  role_id:string;
  roles: {
    role_name: string;
  };
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


const columns: TableProps<EmployeeProject>['columns'] = [
  {
    title: 'Project Name',
    dataIndex: ['projects', 'name'],
    key: 'projectName',
  },
  {
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
  },
  {
    title: 'Project Description',
    dataIndex: ['projects', 'description'],
    key: 'projectDescription',
  },
  {
    title: 'Project Start Date',
    dataIndex: ['projects', 'start_date'],
    key: 'projectEndDate',
  },
  {
    title: 'Project End Date',
    dataIndex: ['projects', 'end_date'],
    key: 'projectStartDate',
  },
  {
    title: 'Employee Joining Date',
    dataIndex: 'joining_date',
    key: 'employeeJoiningDate',
  },

  {
    title: 'Status',
    key: 'status',
    render: (_, record) => (
      <button
        className={`px-4 py-2 text-white rounded ${record.outing_date ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
      >
        {record.outing_date ? 'Leave' : 'Not yet'}
      </button>
    ),
  }
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
  
      // Gán dữ liệu vào state, đảm bảo khớp kiểu Employee[]
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
        <div className="flex flex-col lg:flex-row gap-4 xl:w-2/3">
          <div className="bg-lamaGreenLight py-6 px-4 rounded-md flex-1 flex gap-4  ">
            <div className="w-1/3">
              <Image
                src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Employee"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            {loading ? (
              <p>Đang tải...</p>
            ) : employees.length > 0 ? (
              employees.map((employee) => (
                <div
                  key={employee.id}
                  className="w-2/3 flex flex-col justify-between gap-4 "
                >
                  <h1 className="text-xl font-semibold text-gray-500">
                    {employee.name}
                  </h1>
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <Image
                        src="/date.png"
                        alt="Joining Date"
                        width={14}
                        height={14}
                      />
                      <span className="text-gray-500 text-sm ">
                        {employee.joining_date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                    <span className="text-gray-500 text-sm truncate max-w-[300px]">
                      {employee.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <Image
                        src="/task.png"
                        alt="Email"
                        width={14}
                        height={14}
                      />
                      {employee.roles && employee.roles.role_name ? (
                        <span className="text-gray-500 text-sm">
                          Career: {employee.roles.role_name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No role assigned
                        </span>
                      )}

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy nhân viên với ID này.</p>
            )}
          </div>
        </div>

        <div className="flex-1 mt-10">
          {loading ? (
            <p>Đang tải...</p>
          ) : employee_project.length > 0 ? (
            <Table<EmployeeProject>
              columns={columns}
              dataSource={employee_project}
              rowKey="id"
              pagination={{ pageSize: 3, position: ['bottomCenter'], }}
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
