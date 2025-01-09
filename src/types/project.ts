type ProjectData = {
  name: string;
  description: string;
  start_date: string;
  end_date?: string;
  status: string;
  skills: string[]; // Mảng chứa id của skill
};
