import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";
const getAllEmployeeProjects = async (
    page: number,
    pageSize: number,
) => {
    try {
        let baseQuery = supabase
            .from("employee_projects")
            .select(
                `
            *,
            roles (role_name),
            employees (*),  
            projects (*)    
          `
            )
        const { data, error, count } = await baseQuery
            .range((page - 1) * pageSize, page * pageSize - 1);

        if (error) {
            throw error;
        }
        return { data, total: count ?? 0 };
    } catch (error) {
        console.error("Error fetching projects:", error);
        return { data: [], total: 0 };
    }
};

const createEmployeeProject = async (data: any) => {
    const { project_id, employee_id, joining_date, outing_date, role_id } = data;
    const projectGeneratedId = uuidv4();

    try {
        const { data: projectDetails, error: projectDetailsError } = await supabase
            .from("projects")
            .select("id, name, description")
            .eq("id", project_id)
            .single();

        if (projectDetailsError) {
            throw new Error(`Failed to fetch project details: ${projectDetailsError.message}`);
        }
        const { data: roleDetails, error: roleDetailsError } = await supabase
            .from("roles")
            .select("id, role_name")
            .eq("id", role_id)
            .single();

        if (roleDetailsError) {
            throw new Error(`Failed to fetch role details: ${roleDetailsError.message}`);
        }
        const { data: employeeDetails, error: employeeDetailsError } = await supabase
            .from("employees")
            .select("id, name")
            .eq("id", employee_id)
            .single();

        if (employeeDetailsError) {
            throw new Error(`Failed to fetch employee details: ${employeeDetailsError.message}`);
        }
        const { data: employeeProject, error: employeeProjectError } = await supabase
            .from("employee_projects")
            .insert({
                id: projectGeneratedId,
                project_id: projectDetails.id,
                employee_id: employeeDetails.id,
                role_id: roleDetails.id,
                joining_date,
                outing_date,
                is_destroyed: false,
            })
            .select()
            .single();

        if (employeeProjectError) {
            throw new Error(`Failed to create employee project: ${employeeProjectError.message}`);
        }
        const result = {
            id: employeeProject.id,
            joining_date: employeeProject.joining_date,
            outing_date: employeeProject.outing_date,
            roles: {
                role_name: roleDetails.role_name,
            },
            projects: {
                name: projectDetails.name,
                description: projectDetails.description,
            },
            employees: {
                name: employeeDetails.name,
            },
        };

        return result; 
    } catch (error: any) {
        console.error("Error creating employee project:", error.message);
        return null;
    }
};


const deleteEmployeeProject = async (id: string) => {
    try {
        const { data: employee_projects, error } = await supabase
            .from("employee_projects")
            .update({
                is_destroyed: true,
            })
            .eq("id", id)
            .select()
            .single()
        if (error) {
            throw new Error("Error")
        }
        return employee_projects;
    } catch (error) {
        console.error("Error deleting project:", error.message);
        return null;
    }
};

export { getAllEmployeeProjects, deleteEmployeeProject,createEmployeeProject }