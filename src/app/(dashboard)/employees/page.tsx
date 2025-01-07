"use client";
import Image from "next/image";
import Link from "next/link";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import FormModal from "../../../components/FormModal";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllEmployees, searchEmployees } from "../../../api/employee";
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

type Props = {
  searchQuery: string;
};

const employeesListPage = ({ searchQuery }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false); // State to track no results

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setNoResults(false);
      const dataEmployees = await getAllEmployees();
      setEmployees(dataEmployees as Employee[]);
    } catch (error) {
      console.error("Error fetching employees:", error);
      messageApi.open({
        type: "error",
        content: "Failed to fetch employees. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }, [messageApi, setLoading, setEmployees, setNoResults]);

  const fetchSearchEmployees = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        setNoResults(false);
        const dataEmployees = await searchEmployees(query);
        if (dataEmployees && dataEmployees.length === 0) {
          setNoResults(true);
        }
        setEmployees(dataEmployees as Employee[]);
      } catch (error) {
        console.error("Error searching employees:", error);
        messageApi.open({
          type: "error",
          content: "Failed to search employees. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
    [messageApi, setLoading, setEmployees, setNoResults],
  );

  useEffect(() => {
    if (searchQuery) {
      fetchSearchEmployees(searchQuery);
    } else {
      fetchEmployees();
    }
  }, [searchQuery, fetchEmployees, fetchSearchEmployees]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (localSearchQuery) {
      fetchSearchEmployees(localSearchQuery);
    } else {
      fetchEmployees();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleEmployeeChange = useCallback(
    (newEmployee: Employee, action: "create" | "update" | "delete") => {
      if (action === "create") {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee]);
        messageApi.open({
          type: "success",
          content: "Employee created successfully!",
        });
      }
      if (action === "update") {
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === newEmployee.id ? newEmployee : employee,
          ),
        );
        messageApi.open({
          type: "success",
          content: "Employee updated successfully!",
        });
      }
      if (action === "delete") {
        setEmployees((prevEmployees) =>
          prevEmployees.filter((employee) => employee.id !== newEmployee.id),
        );
        messageApi.open({
          type: "success",
          content: "Employee deleted successfully!",
        });
      }
    },
    [messageApi],
  );
  const renderRow = useCallback(
    (item: Employee) => (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
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
            <FormModal
              table="employee"
              type="update"
              data={item}
              onItemChange={handleEmployeeChange}
            />
            <FormModal
              table="employee"
              type="delete"
              id={item.id}
              onItemChange={handleEmployeeChange}
            />
          </div>
        </td>
      </tr>
    ),
    [handleEmployeeChange],
  );

  const memoizedTable = useMemo(() => {
    if (loading) {
      return <Spin />;
    }
    if (noResults) {
      return (
        <div className="p-4 text-center text-gray-500">No employees found.</div>
      );
    }
    return <Table columns={columns} renderRow={renderRow} data={employees} />;
  }, [employees, loading, noResults, renderRow]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {contextHolder}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All employees</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          {/* <TableSearch /> */}
          <div className="flex items-center gap-4 self-end">
            {/* SEARCH BAR */}
            <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
              <Image
                src="/search.png"
                alt="search-icon"
                width={14}
                height={14}
                className="cursor-pointer"
                onClick={handleSearchSubmit}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-[200px] p-2 bg-transparent outline-none"
                value={localSearchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <FormModal
              table="employee"
              type="create"
              onItemChange={handleEmployeeChange}
            />
          </div>
        </div>
      </div>
      {/* LIST */}
      {memoizedTable}
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default employeesListPage;
