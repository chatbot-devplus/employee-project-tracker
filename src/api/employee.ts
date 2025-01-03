/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 từ thư viện uuid

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

export { createEmployee };
