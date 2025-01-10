/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";

const getAllProjects = async (
  page: number,
  pageSize: number,
  query: string = "",
  startDate: string = "",
  endDate: string = ""
) => {
  try {
    let baseQuery = supabase
      .from("projects")
      .select("*", { count: "exact" })
      .eq("is_destroyed", false)
        .order("created_at", { ascending: false })

    if (query) {
      baseQuery = baseQuery.ilike("name", `%${query}%`);
    }

    if (startDate && endDate) {
      baseQuery = baseQuery.gte("start_date", startDate).lte("start_date", endDate);
      } else if (startDate) {
          baseQuery = baseQuery.gte("start_date", startDate);
      }else if(endDate) {
         baseQuery = baseQuery.lte("start_date", endDate);
        }



    const { data, error, count } = await baseQuery
        .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }
    return { data, total: count ?? 0 };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { data: [], total: 0 };
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
        start_date: startDate,
        end_date: endDate || null,
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
        project_id: project.id,
        skill_id: skillId,
      };
    });

    const { error: skillsError } = await supabase
      .from("project_skills")
      .insert(projectSkills);

    if (skillsError) throw skillsError;
    return project
  } catch (error) {
    console.error("Error creating project:", error.message);
     return null
  }
};

const updateProject = async (data: any) => {
  const { id, name, description, start_date, end_date, status, skills } = data;

  try {
    // Update the project details
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .update({
        name,
        description,
        start_date,
        end_date: end_date || null,
        status,
      })
      .eq("id", id)
       .select()
      .single();

    if (projectError) throw projectError;

    // Remove existing skills for the project
    const { error: deleteSkillsError } = await supabase
      .from("project_skills")
      .delete()
      .eq("project_id", id);

    if (deleteSkillsError) throw deleteSkillsError;

    // Link new skills to the project
    const projectSkills = skills.map((skillId) => {
      const skillMappingId = uuidv4();
      return {
        id: skillMappingId,
        project_id: id,
        skill_id: skillId,
      };
    });

    const { error: insertSkillsError } = await supabase
      .from("project_skills")
      .insert(projectSkills);

    if (insertSkillsError) throw insertSkillsError;
     return project;
  } catch (error) {
    console.error("Error updating project:", error.message);
      return null;
  }
};

const deleteProject = async (id: string) => {
  try {
      const { data: project, error } = await supabase
      .from("projects")
      .update({
        is_destroyed: true,
      })
      .eq("id", id)
        .select()
      .single()
      if(error) {
          throw new Error("Error")
      }
      return project;
  } catch (error) {
    console.error("Error deleting project:", error.message);
      return null;
  }
};

export { createProject, getAllProjects, updateProject, deleteProject };