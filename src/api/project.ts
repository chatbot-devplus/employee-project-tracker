/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";
const getAllProject = async () => {
  try {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
};

const getAllProjects = async (
  page: number,
  pageSize: number,
  query: string = "",
  startDate: string = "",
  endDate: string = "",
) => {
  try {
    let baseQuery = supabase
      .from("projects")
      .select(
        `
          *,
          project_skills(
            skill_id,
            skills(name)
          )
        `,
      )
      .eq("is_destroyed", false)
      .order("created_at", { ascending: false });

    if (query) {
      baseQuery = baseQuery.ilike("name", `%${query}%`);
    }

    if (startDate && endDate) {
      baseQuery = baseQuery
        .gte("start_date", startDate)
        .lte("start_date", endDate);
    } else if (startDate) {
      baseQuery = baseQuery.gte("start_date", startDate);
    } else if (endDate) {
      baseQuery = baseQuery.lte("start_date", endDate);
    }

    const { data, error, count } = await baseQuery.range(
      (page - 1) * pageSize,
      page * pageSize - 1,
    );

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

    const { error: historyError } = await supabase
      .from("project_history")
      .insert([
        {
          action_type: "Add",
          name: name,
          description: `The project "${name}" has been added.`,
          update_time: new Date(),
        },
      ]);
    if (historyError) throw historyError;

    if (skillsError) throw skillsError;
    return project;
  } catch (error) {
    console.error("Error creating project:", error.message);
    return null;
  }
};

const updateProject = async (data: any) => {
  const { id, name, description, start_date, end_date, status, skills } = data;

  try {
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
    const { error: deleteSkillsError } = await supabase
      .from("project_skills")
      .delete()
      .eq("project_id", id);

    if (deleteSkillsError) throw deleteSkillsError;

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

    await supabase.from("project_history").insert([
      {
        action_type: "Edit",
        name: name,
        description: `The project "${name}" has been updated.`,
        update_time: new Date(),
      },
    ]);

    if (insertSkillsError) throw insertSkillsError;
    return project;
  } catch (error) {
    console.error("Error updating project:", error.message);
    return null;
  }
};

const deleteProject = async (id: string) => {
  try {
    const { data: project, error: updateError } = await supabase
      .from("projects")
      .update({
        is_destroyed: true,
      })
      .eq("id", id);

    if (updateError) {
      throw new Error("There was an error updating project status.");
    }
    const { error: updateError2 } = await supabase
      .from("project_history")
      .insert([
        {
          action_type: "Remove",
          name: "Anonymous",
          description: `The project anonymous has been deleted.`,
          update_time: new Date(),
        },
      ]);

    if (updateError2) {
      throw new Error("There was an error updating project history.");
    }

    return project;
  } catch (error) {
    console.error("Error deleting project:", error.message);
    return null;
  }
};

const getIDDetailProject = async (id) => {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
          *,
          project_skills(
            skill_id,
            skills(name)
          )
        `,
      )
      .eq("id", id);

    if (error) {
      throw error;
    }
    console.log("Data của employee project: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching employee projects:", error);
    return [];
  }
};

const getProjectHistory = async () => {
  try {
    const { data, error } = await supabase.from("project_history").select("*");

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching project history:", error);
  }
};

export {
  getIDDetailProject,
  createProject,
  getAllProject,
  getAllProjects,
  updateProject,
  deleteProject,
  getProjectHistory,
};
