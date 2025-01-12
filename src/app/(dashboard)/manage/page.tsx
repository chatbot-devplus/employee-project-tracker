"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Pagination from "../../../components/Pagination";
import FormModal from "../../../components/FormModal";
import { message, Spin } from "antd";
import Table from "../../../components/Table";
import { getAllEmployeeProjects } from "../../../api/manage";

type EmployeeProject = {
    id: string;
    joining_date: string;
    outing_date: string;
    roles: {
        role_name: string;
    }
    projects: {
        name: string;
        description: string;
    }
    employees: {
        name: string;
    };
};

const columns = [
    {
        label: "Name Project",
        key: "project_name",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Description",
        key: "description",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Name Employee",
        key: "employee_name",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Role",
        key: "role",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Joining Date",
        key: "joining_date",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Outing Date",
        key: "outing_date",
        className: "hidden md:table-cell p-4",
    },
    {
        title: "Actions",
        key: "action",
        className: "hidden md:table-cell p-4",
    }

];

const EmployeeProjectComponent = () => {
    const [loading, setLoading] = useState(false);
    const [employeeProject, setEmployeeProject] = useState<EmployeeProject[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [totalItems, setTotalItems] = useState(0);
    const [messageApi, contextHolder] = message.useMessage();

    const fetchEmployeeProject = useCallback(
        async (page: number) => {
            try {
                const { data: dataRoles, total } = await getAllEmployeeProjects(page, itemsPerPage);
                setTotalItems(total);
                setEmployeeProject(dataRoles as EmployeeProject[]);
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
        [itemsPerPage, messageApi]
    );
    const handleEmployeeProjectChange = useCallback(
        (newEmployeeProject: EmployeeProject, action: "create" | "delete") => {
            if (action === "create") {
                setEmployeeProject((prevRoles) => [...prevRoles, newEmployeeProject]);
                messageApi.open({
                    type: "success",
                    content: "Created successfully!",
                });
            }
        },
        [messageApi]
    );
    const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    const renderRow = useCallback(
        (item: EmployeeProject) => (
            <tr
                key={item.id}
                className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
            >
                <td className="hidden md:table-cell">{item.projects.name}</td>
                <td className="hidden md:table-cell">{item.projects.description}</td>
                <td className="hidden md:table-cell">{item.employees.name}</td>
                <td className="hidden md:table-cell">{item.roles.role_name}</td>
                <td className="hidden md:table-cell">{item.joining_date}</td>
                <td className="hidden md:table-cell">
                    {item.outing_date ? (
                        <button className="bg-red-500 text-white px-2 py-1 rounded">
                            Finish
                        </button>
                    ) : (
                        <button className="bg-green-500 text-white px-2 py-1 rounded">
                            Not yet
                        </button>
                    )}
                </td>
                <td>
                    <div className="flex items-center gap-2">
                        <FormModal
                            table="manage"
                            type="delete"
                            id={item.id}
                            onItemChange={handleEmployeeProjectChange}
                        />
                    </div>
                </td>
            </tr>
        ),
        [handleEmployeeProjectChange],
    );

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    useEffect(() => {
        console.log('Fetching data for page:', currentPage);
        fetchEmployeeProject(currentPage);
    }, [currentPage, fetchEmployeeProject]);
    


    const memoizedTable = useMemo(() => {
        if (loading) {
            return <Spin />;
        }
        return <Table renderRow={renderRow} data={employeeProject} />;
    }, [employeeProject, renderRow, loading])
    return (
        <>
            <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
                {contextHolder}
                <div className="flex items-center justify-between">
                    <h1 className="hidden md:block text-lg font-semibold">All Employee Project</h1>
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
                                table="manage"
                                type="create"
                                onItemChange={handleEmployeeProjectChange}
                            />
                        </div>
                    </div>
                </div>

                <table className="w-full table-auto text-left">
                    <thead className="text-gray-500 text-xs uppercase">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`p-4 ${column.className || ""}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {memoizedTable}
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
}

export default EmployeeProjectComponent;

