import { supabase } from "../config/supabase";

// API to get the total count of skills
export const getSkillCount = async () => {
  try {
    const { count, error } = await supabase
      .from("skills")
      .select("*", { count: "exact" }); // Xoá điều kiện is_destroyed

    if (error) {
      throw error;
    }
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching skill count:", error);
    return 0;
  }
};

// API to get the total count of employees
export const getEmployeeCount = async () => {
  try {
    const { count, error } = await supabase
      .from("employees")
      .select("*", { count: "exact" })
      .eq("is_destroyed", false);

    if (error) {
      throw error;
    }
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching employee count:", error);
    return 0;
  }
};

// API to get the total count of projects
export const getProjectCount = async () => {
  try {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact" })
      .eq("is_destroyed", false);

    if (error) {
      throw error;
    }
    return count ?? 0;
  } catch (error) {
    console.error("Error fetching project count:", error);
    return 0;
  }
};
// API to get employees grouped by department (role_name)
export const getEmployeesByRole = async () => {
  try {
    // Lấy danh sách vai trò và đếm số nhân viên theo từng vai trò
    const { data, error } = await supabase
      .from("roles")
      .select(
        `
        id,
        role_name,
        employees(id) 
      `
      )
      .eq("is_destroyed", false);

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Định dạng dữ liệu: Đếm số lượng nhân viên cho từng vai trò
    const formattedData = data.map((role) => ({
      role: role.role_name,
      count: role.employees ? role.employees.length : 0,
    }));

    return formattedData;
  } catch (error) {
    console.error("Error fetching employees by role:", error);
    return [];
  }
};
// API to get projects grouped by status
export const getProjectsByStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("status")
      .eq("is_destroyed", false);

    if (error) {
      throw error;
    }

    // Group data by status
    const groupedData = data.reduce((acc, project) => {
      const status = project.status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(groupedData).map(([status, count]) => ({
      status,
      count,
    }));
  } catch (error) {
    console.error("Error fetching projects by status:", error);
    return [];
  }
};
