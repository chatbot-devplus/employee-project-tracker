import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

type Props = {
  onSubmit: (data: FormData) => void; // Callback to handle form submission
  onClose: () => void; // Callback to close the form
};

const CreateProjectForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectID: "",
      name: "",
      startDate: "",
      endDate: "",
      status: "new",
      skill: [],
    },
  });

  const skills = ["React", "Node.js", "TypeScript", "CSS"];

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="bg-white p-6 rounded shadow-lg w-96"
      >
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">
              Project ID
            </label>
            <input
              {...register("projectID")}
              className="w-full border p-2 rounded"
              placeholder="Project ID"
            />
            {errors.projectID && (
              <p className="text-red-500 text-sm">{errors.projectID.message}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">Name</label>
            <input
              {...register("name")}
              className="w-full border p-2 rounded"
              placeholder="Project Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full border p-2 rounded"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate.message}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">End Date</label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full border p-2 rounded"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate.message}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">Status</label>
            <input
              {...register("status")}
              className="w-full border p-2 rounded"
              value="new"
              readOnly
            />
          </div>

          <div>
            <label className="block font-medium text-sm mb-2">Skills</label>
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
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
