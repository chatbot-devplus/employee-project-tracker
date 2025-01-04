/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 từ thư viện uuid

const getAllProjects = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

const createProject = async (data: ProjectData) => {
  const { name, description, startDate, endDate, status, skills } = data;
  const projectGeneratedId = uuidv4();

  try {
    // Bắt đầu transaction
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        id: projectGeneratedId,
        name,
        description,
        startDate: startDate,
        endDate: endDate || null,
        status,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Liên kết skills với project
    const projectSkills = skills.map((skillId) => {
      const id = uuidv4();
      return {
        id,
        projectId: project.id,
        skillId: skillId,
      };
    });

    const { error: skillsError } = await supabase
      .from("project_skills")
      .insert(projectSkills);

    if (skillsError) throw skillsError;

    console.log("Project created and skills linked successfully!");
  } catch (error) {
    console.error("Error creating project:", error.message);
  }
};

export { createProject, getAllProjects };
