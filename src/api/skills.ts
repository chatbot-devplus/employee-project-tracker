import { supabase } from "../config/supabase";

const getAllSkills = async () => {
  const { data, error } = await supabase.from("skills").select("*");
  if (error) {
    throw error;
  }
  return data;
};

export { getAllSkills };
