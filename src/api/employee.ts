/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";
const getAllEmployee = async () => {
  try {
      const { data, error } = await supabase
          .from("employees")
          .select("*");
      if (error) {
          throw error;
      }
       return data;
  } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
  }
};
// Get All Employees
const getAllEmployees = async (page: number, pageSize: number) => {
  try {
    const { data, error, count } = await supabase
      .from("employees")
      .select(
        `
            *,
            roles (
              role_name
            ),
              employee_skills(
          *,
          skills(name)
        )
          `,
        { count: "exact" },
      )
      .eq("is_destroyed", false)
      .range((page - 1) * pageSize, page * pageSize - 1);
    if (error) {
      throw error;
    }
    return {
      data: data.map((employee) => ({
        ...employee,
        roles: employee.roles ? { name: employee.roles.role_name } : undefined,
      })),
      total: count ?? 0,
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return { data: [], total: 0 };
  }
};

const getInforFromProject = async (id) => {
  try {
    const { data, error } = await supabase
      .from("employee_projects")
      .select(
        `
        *,
        employees (*),  
        projects (*)    
      `,
      )
      .eq("employee_id", id);

    if (error) {
      throw error;
    }

    console.log("Data của employee project: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching employee projects:", error);
    return [];
  }
};

const getIDEmployees = async (id) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        *,
        roles(*),
         employee_skills(
          *,
          skills(name)
        )
      `)
      .eq("id", id);

    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};


// Create Employee
const createEmployee = async (data: any) => {
  try {
    const generatedId = uuidv4();
    const { data: insertedData, error } = await supabase
      .from("employees")
      .insert([
        {
          id: generatedId,
          name: data.name,
          email: data.email,
          role_id: data.role,
          joining_date: data.joiningDate,
        },
      ])
      .select(
        `
        *,
        roles (
          role_name
        )
      `,
      )
      .single();

    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    return {
      ...insertedData,
      roles: insertedData.roles ? { name: insertedData.roles.role_name } : null,
    };
  } catch (error: any) {
    console.error("Error inserting data:", error);
    throw new Error(
      error.message || "An error occurred while creating the employee.",
    );
  }
};

// Update Employee
const updateEmployee = async (id: string, updatedData: any) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .update({
        name: updatedData.name,
        email: updatedData.email,
        role_id: updatedData.role,
        joining_date: updatedData.joiningDate,
      })
      .eq("id", id)
      .select(
        `
        *,
        roles (
          role_name
        )
      `,
      )
      .single();

    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    return {
      ...data,
      roles: data.roles ? { name: data.roles.role_name } : null,
    };
  } catch (error: any) {
    console.error("Error updating employee:", error);
    throw new Error(
      error.message || "An error occurred while updating the employee.",
    );
  }
};

// Soft Delete Employee (update isDestroy to true)
const deleteEmployee = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .update({ is_destroyed: true })
      .eq("id", id)
      .select(
        `
        *,
        roles (
          role_name
        )
      `,
      )
      .single();
    if (error) {
      throw new Error(error.message || "Unknown error");
    }
    return {
      ...data,
      roles: data.roles ? { name: data.roles.role_name } : null,
    };
  } catch (error: any) {
    console.error("Error updating employee:", error);
    throw new Error(
      error.message || "An error occurred while soft deleting the employee.",
    );
  }
};
// Search Employees
const searchEmployees = async (query: string, page: number, pageSize: number) => {
  try {
    const { data, error, count } = await supabase
      .from("employees")
      .select(
        `
                *,
                roles (
                    role_name
                )
            `,
        { count: "exact" },
      )
      .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
      .eq("is_destroyed", false)
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }
    return {
      data: data.map((employee) => ({
        ...employee,
        roles: employee.roles ? { name: employee.roles.role_name } : null,
      })),
      total: count ?? 0,
    };
  } catch (error) {
    console.error("Error searching employees:", error);
    return { data: [], total: 0 };
  }
};
export {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  searchEmployees,
  getIDEmployees,
  getInforFromProject,
  getAllEmployee
};