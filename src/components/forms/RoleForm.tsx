"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createRoles, updateRoles, getAllRoles } from "../../api/roles";
import { useEffect, useState } from "react";

const schema = z.object({
    role_name: z
        .string()
        .min(3, { message: "Role name must be at least 3 characters long!" })
        .max(15, { message: "Role name must not exceed 15 characters!" }),
});
type Inputs = z.infer<typeof schema>;

const RoleForm = ({
    type,
    data,
    closeModal,
    onItemChange,
}: {
    type: "create" | "update";
    data?: any;
    closeModal: () => void;
    onItemChange?: (newRoles: any, action: "create" | "update" | "delete") => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            role_name: data?.role_name || "",
        },
    });

    const [roles, setRoles] = useState<{ id: string; role_name: string }[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const dataRoles = await getAllRoles();
                setRoles(dataRoles);
            } catch (error) {
                console.error("Failed to fetch roles:", error);
            }
        };
        fetchRoles();
    }, []);

    const onSubmit = handleSubmit(async (formData) => {
        try {
            let newRoles;
            if (type === "create") {
                newRoles = await createRoles(formData);
            } else if (type === "update" && data?.id) {
                newRoles = await updateRoles(data.id, formData);
            }
            if (onItemChange) {
                onItemChange(newRoles, type);
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
                {type === "create" ? "Create a new role" : "Update role"}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
                {type === "create" ? "Create Role" : "Update Role"}
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <InputField
                        label="Role Name"
                        name="role_name"
                        defaultValue={data?.role_name || ""}
                        register={register}
                        error={errors?.role_name}
                    />
                </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default RoleForm;
