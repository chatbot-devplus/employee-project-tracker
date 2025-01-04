import { supabase } from "../config/supabase";

const getAllSkills = async () => {
  try {
    const { data, error } = await supabase.from("skills").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

export { getAllSkills };
