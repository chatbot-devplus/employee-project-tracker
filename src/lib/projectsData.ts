import { format, add } from "date-fns";
const startDate = Date.now();
const formattedDate = format(Date.now(), "MM/dd/yyyy");
const endDate = add(new Date(startDate), { days: 2 });
const formateEndDate = format(endDate,"MM/dd/yyyy");

export const projectsData = [
    {
      id: 1,
      projectID: "1234567890",
      name: "John Doe",
      status: "Done",
      startDate: formattedDate,
      endDate: formateEndDate,
    },
    {
      id: 2,
      projectID: "1234567890",
      name: "Jane Doe",
      status: "Inprogress",
      startDate: formattedDate,
      endDate: formateEndDate,
    },
    {
      id: 3,
      projectID: "1234567890",
      name: "Mike Geller",
      status: "To-Do",
      startDate: formattedDate,     
      endDate: formateEndDate,
    },
  ];