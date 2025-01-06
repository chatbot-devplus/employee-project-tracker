"use client"
import Image from "next/image";
import Link from "next/link";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import FormModal from "../../../components/FormModal";
import { useEffect, useState } from "react";
import { getAllEmployees } from "../../../api/employee";
import { Spin, message } from "antd";

type Employee = {
  id: string;
  name: string;
  email?: string;
  role?: string;
  joiningDate: string;
};

const columns = [
  {
    label: "Name",
    key: "info",
  },
  {
    label: "Email",
    key: "email",
    className: "hidden md:table-cell",
  },
  {
    label: "Joining Date",
    key: "joiningdate",
    className: "hidden lg:table-cell",
  },
  {
    label: "Role",
    key: "role",
    className: "hidden lg:table-cell",
  },
  {
    label: "Actions",
    key: "action",
  },
];

const employeesListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading,setLoading] = useState(false);
  const messageApi=message;
  useEffect(()=>{
    const fetchEmployees = async() =>{
      try {
        setLoading(true);
        const dataEmployees = await getAllEmployees();
        setEmployees(dataEmployees as Employee[]);
      } catch (error) {
        console.error("Error fetching employees:", error);
        // Hiển thị thông báo lỗi cho người dùng
        messageApi.open({
          type: "error",
          content: "Failed to fetch employees. Please try again later.",
        });
      } finally {
        setLoading(false);
      }

    };
    fetchEmployees();
  },[])
  const renderRow = (item: Employee) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.email}</td>
      <td className="hidden md:table-cell">{item.joiningDate}</td>
      <td className="hidden md:table-cell">{item.role}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/employees/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="employee" type="delete" id={item.id} />
          <FormModal table="employee" type="update" id={item.id} />
        </div>
      </td>
    </tr>
  );
  if (loading) {
    return <Spin/>;
  }
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All employees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            <FormModal table="employee" type="create" />
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={employees} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default employeesListPage;
