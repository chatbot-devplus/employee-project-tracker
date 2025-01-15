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
    // Lấy danh sách tất cả vai trò (role_name) từ bảng roles
    const { data: rolesData, error: rolesError } = await supabase
      .from("roles")
      .select("id, role_name")
      .eq("is_destroyed", false);

    if (rolesError) {
      throw rolesError;
    }

    if (!rolesData) {
      return [];
    }

    // Tạo một bản đồ để ánh xạ role_id -> role_name
    const roleMap = rolesData.reduce((acc, role) => {
      acc[role.id] = role.role_name;
      return acc;
    }, {});

    // Lấy danh sách nhân viên với role_id
    const { data: employeesData, error: employeesError } = await supabase
      .from("employees")
      .select("role_id")
      .eq("is_destroyed", false);

    if (employeesError) {
      throw employeesError;
    }

    // Nhóm nhân viên theo role_id và đếm số lượng
    const groupedData = (employeesData || []).reduce((acc, employee) => {
      const roleId = employee.role_id || "Unknown"; // Xử lý role_id null
      acc[roleId] = (acc[roleId] || 0) + 1;
      return acc;
    }, {});

    // Định dạng dữ liệu: ánh xạ role_id thành role_name và thêm số lượng
    const formattedData = Object.entries(groupedData).map(
      ([roleId, count]) => ({
        role: roleMap[roleId] || "Unknown", // Lấy tên vai trò, nếu không có thì gán "Unknown"
        count,
      })
    );

    // Đảm bảo tất cả các vai trò từ bảng roles đều có mặt trong kết quả
    rolesData.forEach((role) => {
      if (!formattedData.find((data) => data.role === role.role_name)) {
        formattedData.push({ role: role.role_name, count: 0 });
      }
    });

    // Sắp xếp dữ liệu theo tên vai trò (role)
    formattedData.sort((a, b) => a.role.localeCompare(b.role));

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
