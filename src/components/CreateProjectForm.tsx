import React, { useState } from "react";
import { project } from "../app/(dashboard)/projects/page";

type ProjectCreateData = Omit<project, "id" | "is_destroy">;

type Props = {
  onSubmit: (project: ProjectCreateData) => void; // Callback để gửi dữ liệu form
  onClose: () => void; // Callback để đóng form
};

const CreateProjectForm: React.FC<Props> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState<ProjectCreateData>({
    projectID: "",
    name: "",
    startDate: "",
    endDate: "",
    status: "",
    skill:[] as string [],
  });  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value, checked, type } = e.target;

  if (type === "checkbox" && name === "skill") {
    // Nếu là checkbox "skill", thêm hoặc xóa kỹ năng khỏi mảng
    setFormData((prev) => {
      const newSkills = checked
        ? [...prev.skill, value]  // Thêm kỹ năng vào mảng nếu được chọn
        : prev.skill.filter((skill) => skill !== value);  // Bỏ kỹ năng ra khỏi mảng nếu không được chọn
      return { ...prev, [name]: newSkills };
    });
    } else {
      // Các input khác, cập nhật giá trị thông thường
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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
          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm ">Project ID</label>
            <input
              name="projectID"
              placeholder="Project ID"
              value={formData.projectID}
              onChange={handleChange}
              className="w-full border p-2 rounded block"
              required
            />
          </div >
          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm ">Name</label>
            <input
              name="name"
              placeholder="Project Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded block"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm ">Start Date</label>
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-1/4 block font-medium text-sm">End Date</label>
            <input
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center gap-4">
          <label className="w-1/4 block font-medium text-sm">Status</label>
          <input
            name="status"
            placeholder="Status"
            value= "new"
            onChange={handleChange}
            className="w-full border p-2 rounded outline-none"
            required
            readOnly
          />
          </div>
          <div>
          <label className="block font-medium text-sm mb-2">Skills</label>
          <div className="flex flex-wrap gap-4">
            {["React", "Node.js", "TypeScript", "CSS"].map((skill) => (
              <label key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="skill"
                  value={skill}
                  checked={formData.skill.includes(skill)}  // Kiểm tra nếu kỹ năng đã được chọn
                  onChange={handleChange}  // Xử lý thay đổi
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span>{skill}</span>
              </label>
            ))}
          </div>
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
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
