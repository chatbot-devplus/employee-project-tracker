/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createEmployee, updateEmployee } from "../../api/employee";
import { getAllRoles } from "../../api/roles";
import { useEffect, useState } from "react";

const schema = z.object({
    name: z
      .string()
      .min(3, { message: "Username must be at least 3 characters long!" })
      .max(20, { message: "Username must be at most 20 characters long!" }),
    email: z.string().email({ message: "Invalid email address!" }),
    role: z.string(),
    joiningDate: z.string(),
  });

type Inputs = z.infer<typeof schema>;

const EmployeeForm = ({
    type,
    data,
    closeModal,
    onItemChange,
}: {
    type: "create" | "update";
    data?: any;
    closeModal: () => void;
    onItemChange?: (newEmployee: any, action: "create" | "update" | "delete") => void;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
         setValue
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: data?.name || "",
            email: data?.email || "",
            role: data?.role || "",
            joiningDate: data?.joiningDate || "",
        },
    });
  const [roles, setRoles] = useState<{id: string; role_name: string}[]>([]);
  
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
    
     useEffect(() => {
      if (type === 'update' && data?.role_id) {
            setValue('role', data.role_id)
        }
    }, [data, setValue, type]);


    const onSubmit = handleSubmit(async (formData) => {
        try {
            let newEmployee;
            if (type === "create") {
                 newEmployee = await createEmployee(formData);
              if (newEmployee) {
                   const mappedEmployee = { ...newEmployee, joining_date: newEmployee.joining_date ? new Date(newEmployee.joining_date).toLocaleDateString('en-CA') : "" };
                onItemChange && onItemChange(mappedEmployee, "create");
              }
            } else if (type === "update" && data?.id) {
                 newEmployee = await updateEmployee(data.id, formData);
                 if (newEmployee) {
                       const mappedEmployee = { ...newEmployee, joining_date: newEmployee.joining_date ? new Date(newEmployee.joining_date).toLocaleDateString('en-CA') : "" };
                 onItemChange && onItemChange(mappedEmployee, "update");
              }
            }
            closeModal();
        } catch (error: any) {
            console.error("Error:", error);
            alert(
                error.message || "An error occurred while performing the operation.",
            );
        }
    });

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">
                {type === "create" ? "Create a new employee" : "Update employee"}
            </h1>
            <span className="text-xs text-gray-400 font-medium">
                Personal Information
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <InputField
                        label="Name"
                        name="name"
                        defaultValue={data?.name || ""}
                        register={register}
                        error={errors?.name}
                    />

                    <div className="flex flex-col">
                        <label htmlFor="role" className="block font-medium">
                            Role
                        </label>
                        <select
                            id="role"
                            {...register("role")}
                             className="w-full border p-2 rounded"
                        >
                           {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                {role.role_name}
                               </option>
                             ))}
                         </select>
                        {errors?.role && (
                            <p className="text-red-500 text-sm">
                                {errors.role.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <InputField
                        label="Email"
                        name="email"
                        defaultValue={data?.email || ""}
                        register={register}
                        error={errors?.email}
                        type="email"
                    />
                    <InputField
                        label="Start Day"
                        name="joiningDate"
                        defaultValue={data?.joiningDate || ""}
                        register={register}
                        error={errors.joiningDate}
                        type="date"
                    />
                </div>
            </div>

            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === "create" ? "Create" : "Update"}
            </button>
        </form>
    );
};

export default EmployeeForm;