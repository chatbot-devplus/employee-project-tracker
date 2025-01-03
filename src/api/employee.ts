import { supabase } from "../config/supabase";

const createEmployee = async (data: any) => {
  try {
    const { error } = await supabase.from("employees").insert([
      {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        role: data.role,
        joiningDate: data.joiningDate,
      },
    ]);

    if (error) {
      throw error;
    }

    alert("Employee created successfully!");
    console.log("Data inserted:", data);
  } catch (error) {
    console.error("Error inserting data:", error);
    alert(error.details);
  }
};

export { createEmployee };