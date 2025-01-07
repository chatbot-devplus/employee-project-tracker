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
  } catch (error) {
    console.error("Error creating project:", error.message);
  }
};

const deleteProjectSoft = async (projectId: string) => {
  try {
    // Đánh dấu xóa mềm cho project
    const { error: projectError } = await supabase
      .from("projects")
      .update({ isDestroy: true })
      .eq("id", projectId);

    if (projectError) {
      throw new Error("Error soft deleting project: " + projectError.message);
    }

    return {
      success: true,
      message: "Project soft deleted successfully",
    };
  } catch (error) {
    console.error("Error soft deleting project:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export { createProject, getAllProjects, deleteProjectSoft};
