"use client";
import Image from "next/image";
import Link from "next/link";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import FormModal from "../../components/FormModal";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getAllProjects, searchProjects } from "../../api/project";
import { Spin, message } from "antd";

type Project = {
    id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
};

const columns = [
    {
        label: "STT",
        key: "stt",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Name",
        key: "info",
        className: "hidden md:table-cell p-4",
    },
    {
        label: "Description",
        key: "description",
        className: "hidden md:table-cell",
    },
    {
        label: "Start Date",
        key: "startdate",
        className: "hidden lg:table-cell",
    },
    {
        label: "End Date",
        key: "enddate",
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

const projectsListPage = ({ searchQuery }: Props) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [localSearchQuery, setLocalSearchQuery] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const fetchProjects = useCallback(
        async (page: number) => {
            try {
                setLoading(true);
                setNoResults(false);
                const { data: dataProjects, total } = await getAllProjects(
                    page,
                    itemsPerPage,
                );
                setTotalItems(total);
                setProjects(dataProjects as Project[]);
            } catch (error) {
                console.error("Error fetching projects:", error);
                messageApi.open({
                    type: "error",
                    content: "Failed to fetch projects. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        },
        [messageApi, setLoading, setProjects, setNoResults, itemsPerPage],
    );

    const fetchSearchProjects = useCallback(
        async (query: string, page: number) => {
            try {
                setLoading(true);
                setNoResults(false);
                const { data: dataProjects, total } = await searchProjects(
                    query,
                    page,
                    itemsPerPage,
                );
                setTotalItems(total);
                if (dataProjects && dataProjects.length === 0) {
                    setNoResults(true);
                }
                setProjects(dataProjects as Project[]);
            } catch (error) {
                console.error("Error searching projects:", error);
                messageApi.open({
                    type: "error",
                    content: "Failed to search projects. Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        },
        [messageApi, setLoading, setProjects, setNoResults, itemsPerPage],
    );

    useEffect(() => {
        if (debouncedSearchQuery) {
            fetchSearchProjects(debouncedSearchQuery, 1);
        } else {
            fetchProjects(1);
        }
    }, [debouncedSearchQuery, fetchProjects, fetchSearchProjects]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setLocalSearchQuery(query);

        const timer = setTimeout(() => {
            setDebouncedSearchQuery(query);
        }, 500);

        return () => clearTimeout(timer);
    };

    const handleProjectChange = useCallback(
        (newProject: Project, action: "create" | "update" | "delete", data?: Project) => {
             if (action === "create" && newProject) {
                setProjects((prevProjects) => [...prevProjects, newProject]);
                messageApi.open({
                    type: "success",
                    content: "Project created successfully!",
                });
            }
            if (action === "update" && newProject) {
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
             if (action === "delete" && data) {
                setProjects((prevProjects) =>
                    prevProjects.filter((project) => project.id !== data.id),
                );
                messageApi.open({
                type: "success",
                content: "Project deleted successfully!",
                });
            }
               if (debouncedSearchQuery) {
                    fetchSearchProjects(debouncedSearchQuery, currentPage)
                } else {
                    fetchProjects(currentPage);
                }

        },
        [messageApi, currentPage, debouncedSearchQuery, fetchProjects, fetchSearchProjects],
    );


    const renderRow = useCallback(
        (item: Project, index: number) => {
            const stt = (currentPage - 1) * itemsPerPage + index + 1;
            return (
                <tr
                    key={item.id}
                    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaGreenLight"
                >
                    <td className="hidden md:table-cell p-4">{stt}</td>
                    <td className="flex items-center gap-4 p-4">
                        <div className="flex flex-col">
                            <h3 className="font-semibold">{item.name}</h3>
                        </div>
                    </td>
                    <td className="hidden md:table-cell">{item.description}</td>
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
                                data={item}
                                id={item.id}
                                onItemChange={handleProjectChange}
                            />
                        </div>
                    </td>
                </tr>
            );
        },
        [currentPage, itemsPerPage, handleProjectChange],
    );

    const memoizedTable = useMemo(() => {
        if (loading) {
            return <Spin />;
        }
        if (noResults) {
            return (
                <div className="p-4 text-center text-gray-500">No projects found.</div>
            );
        }
        return (
            <Table
                renderRow={(item) => renderRow(item, projects.indexOf(item))}
                data={projects}
            />
        );
    }, [projects, loading, noResults, renderRow]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
         if (debouncedSearchQuery) {
            fetchSearchProjects(debouncedSearchQuery, newPage);
        } else {
            fetchProjects(newPage);
        }
    };

    const handleItemsPerPageChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        const newItemsPerPage = parseInt(e.target.value);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
         if (debouncedSearchQuery) {
            fetchSearchProjects(debouncedSearchQuery, 1);
        } else {
            fetchProjects(1);
        }
    };

    const totalPages = useMemo(() => {
        return Math.ceil(totalItems / itemsPerPage);
    }, [totalItems, itemsPerPage]);

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {contextHolder}
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All projects</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* <TableSearch /> */}
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
                        {/* SEARCH BAR */}
                        <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
                            <Image
                                src="/search.png"
                                alt="search-icon"
                                width={14}
                                height={14}
                                className="cursor-pointer"
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-[200px] p-2 bg-transparent outline-none"
                                value={localSearchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
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
                            <th key={column.key} className={`py-4 ${column.className || ""}`}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{memoizedTable}</tbody>
            </table>
            {/* PAGINATION */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default projectsListPage;