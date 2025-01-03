/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { createEmployee } from "../../api/employee";

const schema = z.object({
  name: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  role: z
    .string()
    .min(3, { message: "Role must be at least 3 characters long!" }),
  joiningDate: z.string(),
});

type Inputs = z.infer<typeof schema>;

const EmployeeForm = ({
  type,
  data,
  closeModal,
}: {
  type: "create" | "update";
  data?: any;
  closeModal:() =>void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    createEmployee(data);
    closeModal();
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">{type === "create" ? "Create a new employee" : "Update employee"}</h1>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <InputField
            label="Name"
            name="name"
            defaultValue={data?.name}
            register={register}
            error={errors?.name}
          />
          <InputField
            label="Role"
            name="role"
            defaultValue={data?.role}
            register={register}
            error={errors?.role}
          />
        </div>
        <div className="flex flex-col">
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
            type="email"
          />
          <InputField
            label="Start Day"
            name="joiningDate"
            defaultValue={data?.joiningDate}
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
