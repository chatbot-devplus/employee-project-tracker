"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useEffect, useState } from "react";
import { createSkills, getAllSkills, updateSkills } from "../../api/skills";

const schema = z.object({
    name: z
        .string()
        .min(3, { message: "Skill name must be at least 3 characters long!" })
        .max(15, { message: "Skill name must not exceed 15 characters!" }),
});

type Inputs = z.infer<typeof schema>;

const SkillForm = ({
    type,
    data,
    closeModal,
    onItemChange,
}: {
    type: "create" | "update";
    data?: any;
    closeModal: () => void;
    onItemChange?: (newSkills: any, action: "create" | "update" | "delete") => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || "",
        },
    });

    const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);

    useEffect(() => {
        const fetchSkill = async () => {
            try {
                const dataSkill = await getAllSkills();
                setSkills(dataSkill);
            } catch (error) {
                console.error("Failed to fetch Skill:", error);
            }
        };
        fetchSkill();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        try {
            let newSkills
;
            if (type === "create") {
                newSkills
     = await createSkills(formData);
            } else if (type === "update" && data?.id) {
                newSkills
     = await updateSkills(data.id, formData);
            }
            if (onItemChange) {
                onItemChange(newSkills
        , type);
            }
            closeModal();
        } catch (error: any) {
            console.error("Error:", error);
            alert(error.message || "An error occurred while performing the operation.");
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new skill" : "Update skill"}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
                {type === "create" ? "Create skill" : "Update skill"}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <InputField
                        label="Skill Name"
                        name="name"
                        defaultValue={data?.name || ""}
                        register={register}
                        error={errors?.name}
                    />
                </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default SkillForm;
