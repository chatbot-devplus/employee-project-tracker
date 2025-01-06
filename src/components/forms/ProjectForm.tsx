"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Image from "next/image";

const schema = z.object({
  projectID: z.string().min(1, { message: "Project ID is required!" }),
  name: z
    .string()
    .min(3, { message: "Project name must be at least 3 characters long!" }),
  startDate: z.string().nonempty({ message: "Start date is required!" }),
  endDate: z.string().nonempty({ message: "End date is required!" }),
  status: z.string().nonempty({ message: "Status is required!" }),
  skill: z
    .array(z.string())
    .nonempty({ message: "At least one skill is required!" }),
});

type FormData = z.infer<typeof schema>;

const ProjectForm = ({
  type,
  data,
  closeModal,
}: {
  type: "create" | "update";
  data?: FormData;
  closeModal: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectID: data?.projectID || "",
      name: data?.name || "",
      startDate: data?.startDate || "",
      endDate: data?.endDate || "",
      status: data?.status || "new",
      skill: data?.skill || [],
    },
  });

  const skills = ["React", "Node.js", "TypeScript", "CSS"];

  const onSubmit = (formData: FormData) => {
    console.log(type === "create" ? "Creating..." : "Updating...", formData);
    closeModal();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded shadow-md flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create New Project" : "Update Project"}
      </h2>

      <div>
        <label className="block font-medium">Project ID</label>
        <input
          {...register("projectID")}
          className="w-full border p-2 rounded"
          placeholder="Project ID"
        />
        {errors.projectID && (
          <p className="text-red-500 text-sm">{errors.projectID.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Name</label>
        <input
          {...register("name")}
          className="w-full border p-2 rounded"
          placeholder="Project Name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Start Date</label>
        <input
          type="date"
          {...register("startDate")}
          className="w-full border p-2 rounded"
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">End Date</label>
        <input
          type="date"
          {...register("endDate")}
          className="w-full border p-2 rounded"
        />
        {errors.endDate && (
          <p className="text-red-500 text-sm">{errors.endDate.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium">Status</label>
        <input
          {...register("status")}
          className="w-full border p-2 rounded"
          readOnly
        />
      </div>

      <div>
        <label className="block font-medium">Skills</label>
        <div className="flex flex-wrap gap-4">
          {skills.map((skill) => (
            <label key={skill} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={skill}
                {...register("skill")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
        {errors.skill && (
          <p className="text-red-500 text-sm">{errors.skill.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {type === "create" ? "create" : "update"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
