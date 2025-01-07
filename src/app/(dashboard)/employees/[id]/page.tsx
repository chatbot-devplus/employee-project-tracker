'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getIDEmployees, getInforFromProject } from "../../../../api/employee";
import { useParams } from "next/navigation";

type Employee = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  joiningDate: string;
  isDestroy: boolean;
};
type EmployeeProject = {
  id: string;
  employeeId: string;
  projectId: string;
  joiningDate: string;
  outingDate: string;
  role: string;
  projects: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  employees: {
    email: string;
    name: string;
    role: string;
    joiningDate: string;
  }
}

const SingleEmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employee_project, setEmployeesProject] = useState<EmployeeProject[]>([]);
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
  }

  useEffect(() => {
    if (id) {
      fetchIDEmployees();
      fetchIDEmployeesProject();
    }
  }, [id]);

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-zinc-300 py-6 px-4 rounded-md flex-1 flex gap-4  ">
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
                  className="w-2/3 flex flex-col justify-between gap-4"
                >
                  <h1 className="text-xl font-semibold text-gray-500">{employee.name}</h1>
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <Image src="/date.png" alt="Joining Date" width={14} height={14} />
                      <span className="text-gray-500 text-sm ">{employee.joiningDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src="/mail.png" alt="Email" width={14} height={14} />
                    <span className="text-gray-500 text-sm truncate max-w-[150px]">
                      {employee.email}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                    <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                      <Image src="/task.png" alt="Email" width={14} height={14} />
                      <span className="text-gray-500 text-sm ">Career : {employee.role}</span>
                    </div>
                  </div>

                </div>
              ))
            ) : (
              <p>Không tìm thấy nhân viên với ID này.</p>
            )}
          </div>
        </div>
        <div className="flex-1 flex gap-4 justify-between flex-wrap mt-10">
          {loading ? (
            <p>Đang tải...</p>
          ) : employee_project.length > 0 ? (
            employee_project.map((employee_project) => (
              <div className="bg-lamaPurple p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]" key={employee_project.id}>
                <Image
                  src="/task.png"
                  alt=""
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                <div className="w-3/6">
                  <h1 className="text-xl font-semibold text-gray-500">{employee_project.projects.name}</h1>
                  <h6 className="text-sm font-semibold mt-1 mb-1 text-gray-500">Description</h6>
                  <span className="text-sm text-gray-400">{employee_project.projects.description}</span>
                  <h6 className="text-sm font-semibold mt-1 mb-1 text-gray-500">Time in the project</h6>
                  <div className="flex items-center gap-2">
                    <Image src="/date.png" alt="Task Status" width={14} height={14} />
                    <span className="text-gray-500 text-sm">
                      {employee_project.joiningDate}
                    </span>
                  </div>
                  <div className=" flex items-center gap-2 mt-2">
                    <Image src="/logout.png" alt="Task Status" width={14} height={14} />
                    <span className="text-gray-500 text-sm">
                      {employee_project.outingDate ?? "Chưa kết thúc"}
                    </span>
                  </div>
                  <h6 className="text-sm font-semibold mt-1 mb-1 text-gray-500">Join date</h6>
                  <div className="flex items-center gap-2">
                    <Image src="/date.png" alt="Task Status" width={14} height={14} />
                    <span className="text-gray-500 text-sm">
                      {employee_project.employees.joiningDate}
                    </span>
                  </div>
                  <h6 className="text-sm font-semibold mt-1 mb-1 text-gray-500">Role</h6>
                  <span className="text-gray-500 text-sm">
                    {employee_project.role}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy nhân viên với ID này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleEmployeePage;
