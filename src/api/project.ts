/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid"; // Import uuidv4 từ thư viện uuid

const getAllProjects = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("createdAt", { ascending: false }).match({isDestroyed: false});
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
};

const createProject = async (data: any) => {
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
  } catch (error) {
    console.error("Error creating project:", error.message);
  }
};

const updateProject = async (data: any) => {
  const { id, name, description, startDate, endDate, status, skills } = data;

  try {
    // Update the project details
    const { error: projectError } = await supabase
      .from("projects")
      .update({
        name,
        description,
        startDate,
        endDate: endDate || null,
        status,
      })
      .eq("id", id);

    if (projectError) throw projectError;

    // Remove existing skills for the project
    const { error: deleteSkillsError } = await supabase
      .from("project_skills")
      .delete()
      .eq("projectId", id);

    if (deleteSkillsError) throw deleteSkillsError;

    // Link new skills to the project
    const projectSkills = skills.map((skillId) => {
      const skillMappingId = uuidv4();
      return {
        id: skillMappingId,
        projectId: id,
        skillId: skillId,
      };
    });

    const { error: insertSkillsError } = await supabase
      .from("project_skills")
      .insert(projectSkills);

    if (insertSkillsError) throw insertSkillsError;
  } catch (error) {
    console.error("Error updating project:", error.message);
  }
};


const deleteProject = async (id: string) => {
  try {
    await supabase
      .from("projects")
      .update({
        isDestroyed: true
      })
      .eq("id", id);
  } catch (error) {
    console.error("Error deleting project:", error.message);
  }
};

export { createProject, getAllProjects, updateProject, deleteProject };
