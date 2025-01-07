"use client";

import React, { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getAllSkills, getSkillsByProjectId } from "../../api/skills";
import { createProject, updateProject } from "../../api/project";

const schema = z
  .object({
    id: z.string().optional(),
    name: z
      .string()
      .min(3, { message: "Project name must be at least 3 characters long!" }),
    description: z.string().nonempty({ message: "Description is required!" }),
    startDate: z.string().nonempty({ message: "Start date is required!" }),
    endDate: z.string().nullable(),
    status: z.string().nonempty({ message: "Status is required!" }),
    skills: z
      .array(z.string())
      .nonempty({ message: "At least one skill is required!" }),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      path: ["endDate"],
      message: "End date must be after start date!",
    }
  );

type FormData = z.infer<typeof schema>;
type Skill = { id: string; name: string };

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
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: type === "update" ? data : { ...schema.parse({}) },
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectSkills, setProjectSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getAllSkills();
        if (Array.isArray(data)) setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    if (type === "update" && data) {
      const fetchProjectSkills = async () => {
        try {
          const projectSkillsData = await getSkillsByProjectId(data.id);
          if (Array.isArray(projectSkillsData)) {
            setProjectSkills(projectSkillsData.map((s) => s.skillId));
          }
        } catch (error) {
          console.error("Failed to fetch project skills:", error);
        }
      };
      fetchProjectSkills();
    }

    fetchSkills();
  }, [type, data]);

  useEffect(() => {
    if (type === "update" && projectSkills.length > 0) {
      setValue("skills", [projectSkills[0], ...projectSkills.slice(1)]);
    }
  }, [projectSkills, type, setValue]);

  const onSubmit = async (formData: FormData) => {
    setIsLoading(true);
    if (type === "update") {
      try {
        await updateProject(formData);
        closeModal();
      } catch (error) {
        console.error("Failed to update project:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    } else {
      try {
        await createProject(formData);
        closeModal();
      } catch (error) {
        console.error("Failed to create/update project:", error);
        alert("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const skillsCheckboxes = useMemo(
    () =>
      skills.map((skill) => (
        <label key={skill.id} className="flex items-center space-x-2">
          <input
            type="checkbox"
            value={skill.id}
            {...register("skills")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>{skill.name}</span>
        </label>
      )),
    [skills, register]
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded shadow-md flex flex-col gap-4"
    >
      <h2 className="text-lg font-semibold">
        {type === "create" ? "Create New Project" : "Update Project"}
      </h2>

      <div>
        <label htmlFor="name" className="block font-medium text-sm">
          Project Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full border p-2 rounded"
          placeholder="Project name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-medium">
          Description
        </label>
        <input
          id="description"
          {...register("description")}
          className="w-full border p-2 rounded"
          placeholder="Project Description"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate" className="block font-medium">
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          {...register("startDate")}
          className="w-full border p-2 rounded"
        />
        {errors.startDate && (
          <p className="text-red-500 text-sm">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="endDate" className="block font-medium">
          End Date
        </label>
        <input
          id="endDate"
          type="date"
          {...register("endDate")}
          className="w-full border p-2 rounded"
        />
        {errors.endDate && (
          <p className="text-red-500 text-sm">{errors.endDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block font-medium">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full border p-2 rounded"
        >
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="block font-medium text-sm mb-2">Skills</label>
        <div className="flex flex-wrap gap-4">{skillsCheckboxes}</div>
        {errors.skills && (
          <p className="text-red-500 text-sm">{errors.skills.message}</p>
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
          disabled={isLoading}
        >
          {isLoading
            ? "Processing..."
            : type === "create"
              ? "Create"
              : "Update"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
