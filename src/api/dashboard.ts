import { supabase } from "../config/supabase";

// API lấy số lượng nhân viên
export const getEmployeeCount = async () => {
  try {
    const { count, error } = await supabase
      .from("employees")
      .select("*", { count: "exact" });

    if (error) {
      throw error;
    }

    return count ?? 0;
  } catch (error) {
    console.error("Error fetching employee count:", error);
    return 0;
  }
};

// API lấy số lượng dự án
export const getProjectCount = async () => {
  try {
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact" });

    if (error) {
      throw error;
    }

    return count ?? 0;
  } catch (error) {
    console.error("Error fetching project count:", error);
    return 0;
  }
};
