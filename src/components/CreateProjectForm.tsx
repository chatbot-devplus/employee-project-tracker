import React, { useState } from "react";

type Props = {
  onSubmit: (project: any) => void; // Callback để gửi dữ liệu form
  onClose: () => void; // Callback để đóng form
};

const CreateProjectForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    projectID: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-96"
      >
        <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
        <div className="flex flex-col gap-4">
          <input
            name="projectID"
            placeholder="Project ID"
            value={formData.projectID}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="endDate"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
          <input
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
