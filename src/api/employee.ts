/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 từ thư viện uuid

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

const createEmployee = async (data: any) => {
  try {
    // Sử dụng uuidv4 để tạo ID
    const generatedId = uuidv4();

    // Chèn dữ liệu vào bảng employees
    const { data: insertedData, error } = await supabase
      .from("employees")
      .insert([
        {
          id: generatedId, // ID mới tạo
          name: data.name,
          email: data.email,
          role: data.role,
          joiningDate: data.joiningDate,
        },
      ]);

    // Kiểm tra nếu có lỗi
    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    // Hiển thị thông báo thành công
    alert("Employee created successfully!");
    console.log("Data inserted:", insertedData);
  } catch (error: any) {
    // Xử lý lỗi nếu có
    console.error("Error inserting data:", error);
    alert(error.message || "An error occurred while creating the employee.");
  }
};

const updateEmployee = async (id: string, updatedData: any) => {
  try {
    // Cập nhật dữ liệu trong bảng employees
    const { data, error } = await supabase
      .from("employees")
      .update({
        name: updatedData.name,
        email: updatedData.email,
        role: updatedData.role,
        joiningDate: updatedData.joiningDate,
      })
      .eq("id", id); // Điều kiện để cập nhật theo ID

    // Kiểm tra nếu có lỗi
    if (error) {
      throw new Error(error.message || "Unknown error");
    }

    // Hiển thị thông báo thành công
    alert("Employee updated successfully!");
    console.log("Data updated:", data);
  } catch (error: any) {
    // Xử lý lỗi nếu có
    console.error("Error updating employee:", error);
    alert(error.message || "An error occurred while updating the employee.");
  }
};

export { createEmployee, getAllEmployees, updateEmployee };
