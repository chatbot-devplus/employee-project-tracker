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
    .select("skillId")
    .eq("projectId", projectId);
  if (error) {
    throw error;
  }
  return data as { skillId: string }[];
};

export { getAllSkills, getSkillsByProjectId };
