import { supabase } from "../config/supabase";

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
    const { data, error } = await supabase
      .from("employees")
      .select("id, roles(role_name)")
      .eq("is_destroyed", false); // Lọc nhân viên không bị xóa

    if (error) {
      throw error;
    }

    // Nhóm dữ liệu theo role_name
    const groupedData = data.reduce((acc, employee) => {
      const roleName = employee.roles?.[0]?.role_name || "Unknown"; // Lấy role_name hoặc đặt giá trị mặc định là "Unknown"
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {});

    // Định dạng dữ liệu trả về
    return Object.entries(groupedData).map(([role, count]) => ({
      role,
      count,
    }));
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
