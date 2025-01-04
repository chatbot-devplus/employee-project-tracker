/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";

// Get All Employees
const getAllEmployees = async () => {
  try {
    const { data, error } = await supabase.from("employees").select("*");
    if (error) {
      throw error;
    }
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
          role: data.role,
          joiningDate: data.joiningDate,
        },
      ])
      .select("*"); // Select the inserted row to return it

    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    return insertedData ? insertedData[0] : null; // Return the inserted employee
  } catch (error: any) {
    console.error("Error inserting data:", error);
    throw new Error(error.message || "An error occurred while creating the employee.");
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
        role: updatedData.role,
        joiningDate: updatedData.joiningDate,
      })
      .eq("id", id)
      .select("*"); // Select the updated row to return it

    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    return data ? data[0] : null; // Return the updated employee
  } catch (error: any) {
    console.error("Error updating employee:", error);
    throw new Error(error.message || "An error occurred while updating the employee.");
  }
};


// Delete Employee
const deleteEmployee = async (id: string) => {
    try {
      const { error } = await supabase.from("employees").delete().eq("id", id);

      if (error) {
          throw new Error(error.message || "Unknown error");
      }

    // Return true if the delete was successful (no error)
    return true;
    } catch (error: any) {
        console.error("Error deleting employee:", error);
        throw new Error(error.message || "An error occurred while deleting the employee.");
    }
};

export { createEmployee, getAllEmployees, updateEmployee, deleteEmployee };