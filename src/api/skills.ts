import { supabase } from "../config/supabase";
import { v4 as uuidv4 } from "uuid";

const getAllSkills = async () => {
    try {
        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .eq("is_destroyed", false);
        if (error) {
            throw error;
        }
        return data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};
const getSkills = async (page: number, pageSize: number) => {
    try {
        const { data, error, count } = await supabase
            .from("skills")
            .select("*", { count: "exact" })
             .eq("is_destroyed", false)
            .range((page - 1) * pageSize, page * pageSize - 1);
        if (error) {
            throw error;
        }
        return {
            data: data.map((skill) => ({
                id: skill.id,
                name: skill.name,
            })),
            total: count ?? 0,
        };
    } catch (error) {
        console.error("Error fetching skills:", error);
        return { data: [], total: 0 };
    }
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

const createSkills = async (data: any) => {
    try {
        const generatedId = uuidv4();
        const { data: insertedData, error } = await supabase
            .from("skills")
            .insert([
                {
                    id: generatedId,
                    name: data.name,
                    is_destroyed: false,
                },
            ])
            .select("*")
            .single();
        if (error) {
            throw new Error(error.message || "Unknown error");
        }
        return {
            ...insertedData,
            roles: insertedData?.name ? { name: insertedData.name } : null,
        };
    } catch (error: any) {
        console.error("Error inserting data:", error);
        throw new Error(
            error.message || "An error occurred while creating the role.",
        );
    }
};

const updateSkills = async (id: number, formData: any) => {
    const { name } = formData;
    try {
        const { data: updatedSkills, error } = await supabase
            .from("skills")
            .update({ name })
            .eq("id", id)
            .select("*")
            .single();
        if (error) {
            throw new Error(
                error.message || "An error occurred while updating the role.",
            );
        }
        return updatedSkills;
    } catch (error: any) {
        console.error("Error updating role:", error);
        throw new Error(
            error.message || "Failed to update the role. Please try again.",
        );
    }
};

const deleteSkill = async (id: string) => {
    try {
        const { data: skills, error } = await supabase
            .from("skills")
            .update({
                is_destroyed: true,
            })
            .eq("id", id)
            .select()
            .single();
        if (error) {
            throw new Error("Error");
        }
        return skills;
    } catch (error) {
        console.error("Error deleting role:", error.message);
        return null;
    }
};

export {
    getAllSkills,
    getSkillsByProjectId,
    getSkills,
    createSkills,
    updateSkills,
    deleteSkill,
};