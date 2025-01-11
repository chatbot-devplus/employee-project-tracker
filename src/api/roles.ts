import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";
const getAllRoles = async () => {
    try {
        const { data, error } = await supabase
            .from("roles")
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

const getIDAllRole = async (id) => {
  try {
    const {data,error} = await supabase
    .from ("roles")
    .select("*")
    .eq("id",id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching employees:",error);
    return [];
  }
}

const getAllRole = async (page: number, pageSize: number) => {
    try {
      const { data, error, count } = await supabase
        .from("roles")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1);
  
      if (error) {
        throw error;
      }
  
      return {
        data: data.map((role) => ({
          id: role.id,
          role_name: role.role_name,
        })),
        total: count ?? 0,
      };
    } catch (error) {
      console.error("Error fetching roles:", error);
      return { data: [], total: 0 };
    }
  };

  const createRoles = async (data: any) => {
    try {
        const generatedId = uuidv4();
        const { data: insertedData, error } = await supabase
          .from("roles")
          .insert([
            {
              id: generatedId,
              role_name: data.role_name, 
            },
          ])
          .select("*")
          .single(); 
        if (error) {
          throw new Error(error.message || "Unknown error");
        }
        return {
          ...insertedData,
          roles: insertedData?.role_name ? { name: insertedData.role_name } : null,
        };
      } catch (error: any) {
        console.error("Error inserting data:", error);
        throw new Error(
          error.message || "An error occurred while creating the role."
        );
      }
  }

  const updateRoles = async (id: number, formData: any) => {
    const { role_name } = formData; 
    try {
      const { data: updatedRole, error } = await supabase
        .from("roles")
        .update({ role_name })
        .eq("id", id) 
        .select("*")
        .single(); 
      if (error) {
        throw new Error(error.message || "An error occurred while updating the role.");
      }
      return updatedRole;
    } catch (error: any) {
      console.error("Error updating role:", error);
      throw new Error(error.message || "Failed to update the role. Please try again.");
    }
  };
  
  
  const deleteRole = async (id: string) => {
    try {
        const { data: role, error } = await supabase
        .from("roles")
        .update({
          is_destroyed: true,
        })
        .eq("id", id)
          .select()
        .single()
        if(error) {
            throw new Error("Error")
        }
        return role;
    } catch (error) {
      console.error("Error deleting role:", error.message);
        return null;
    }
  };


export { getAllRoles,updateRoles,deleteRole,createRoles,getAllRole,getIDAllRole }