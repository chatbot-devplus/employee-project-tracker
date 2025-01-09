import { supabase } from "../config/supabase";

const getAllSkills = async () => {
  const { data, error } = await supabase.from("skills").select("*");
  if (error) {
    throw error;
  }
  return data;
};

const getSkillsByProjectId = async (projectId: string) => {
  const { data, error } = await supabase
    .from("project_skills")
    .select("skill_id")
    .eq("project_id", projectId);
  if (error) {
    throw error;
  }
  return data as { skill_id: string }[];
};

export { getAllSkills, getSkillsByProjectId };
