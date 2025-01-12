import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
    createEmployeeProject,
} from "../../api/manage";
import { getAllProject } from "../../api/project";
import { getAllEmployee } from "../../api/employee";
import { getAllRoles } from "../../api/roles";


const schema = z.object({
    project_id: z.string().nonempty("Please select a project!"),
    employee_id: z.string().nonempty("Please select an employee!"),
    role_id: z.string().nonempty("Please select a role!"),
    joining_date: z.string().nonempty("Please select a joining date!"),
});
type Inputs = z.infer<typeof schema>;

const ManageForm = ({
    type,
    closeModal,
    onItemChange,
}: {
    type: "create";
    closeModal: () => void;
    onItemChange?: (newProjects: any, action: "create") => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projectsData, employeesData, rolesData] = await Promise.all([
                    getAllProject(),
                    getAllEmployee(),
                    getAllRoles(),
                ]);
                setProjects(projectsData);
                setEmployees(employeesData);
                setRoles(rolesData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        try {
            const newEmployeeProject = await createEmployeeProject(formData);
            if (onItemChange) {
                onItemChange(newEmployeeProject, "create");
            }
            closeModal();
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message || "An error occurred.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new Employee Project</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <label htmlFor="project_id">Project</label>
                    <select
                        id="project_id"
                        {...register("project_id")}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Select a project</option>
                        {projects
                            .filter((project: any) => !project.is_destroyed) 
                            .map((project: any) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                    </select>
                    {errors.project_id && (
                        <span className="text-red-500 text-sm">{errors.project_id.message}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="employee_id">Employee</label>
                    <select
                        id="employee_id"
                        {...register("employee_id")}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Select an employee</option>
                        {employees
                            .filter((employee: any) => !employee.is_destroyed) 
                            .map((employee: any) => (
                                <option key={employee.id} value={employee.id}>
                                    {employee.name}
                                </option>
                            ))}
                    </select>
                    {errors.employee_id && (
                        <span className="text-red-500 text-sm">{errors.employee_id.message}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="role_id">Role</label>
                    <select
                        id="role_id"
                        {...register("role_id")}
                        className="p-2 border rounded-md"
                    >
                        <option value="">Select a role</option>
                        {roles
                            .filter((role: any) => !role.is_destroyed) 
                            .map((role: any) => (
                                <option key={role.id} value={role.id}>
                                    {role.role_name}
                                </option>
                            ))}
                    </select>
                    {errors.role_id && (
                        <span className="text-red-500 text-sm">{errors.role_id.message}</span>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="joining_date">Joining Date</label>
                    <input
                        type="date"
                        id="joining_date"
                        {...register("joining_date")}
                        className="p-2 border rounded-md"
                    />
                    {errors.joining_date && (
                        <span className="text-red-500 text-sm">{errors.joining_date.message}</span>
                    )}
                </div>

            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">Create</button>
        </form>
    );
};

export default ManageForm;
