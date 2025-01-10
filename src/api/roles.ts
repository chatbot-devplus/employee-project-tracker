import { supabase } from "../config/supabase";

const getAllRoles = async () => {
    try {
        const { data, error } = await supabase
            .from("roles")
            .select("*");
        if (error) {
            throw error;
        }
         return data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
};


export { getAllRoles }