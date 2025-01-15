"use client";
import React, { useEffect, useState } from "react";
import {
  getEmployeeCount,
  getProjectCount,
  getEmployeesByRole,
  getProjectsByStatus,
} from "../api/dashboard";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [employeesByRole, setEmployeesByRole] = useState([]);
  const [projectsByStatus, setProjectsByStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employees = await getEmployeeCount();
        const projects = await getProjectCount();
        const employeesByRoleData = await getEmployeesByRole();
        const projectData = await getProjectsByStatus();

        setEmployeeCount(employees);
        setProjectCount(projects);
        setEmployeesByRole(employeesByRoleData);
        setProjectsByStatus(projectData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for Bar Chart
  const barChartData = {
    labels: ["Employees", "Projects"],
    datasets: [
      {
        label: "Count",
        data: [employeeCount, projectCount],
        backgroundColor: ["#4CAF50", "#2196F3"],
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Data for Doughnut Chart (Employees by Department)
  const doughnutRoleData = {
    labels: employeesByRole.map((item) => item.role),
    datasets: [
      {
        label: "Employees by Role",
        data: employeesByRole.map((item) => item.count),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#2196F3",
        ],
      },
    ],
  };

  // Data for Doughnut Chart (Projects by Status)
  const doughnutProjectData = {
    labels: projectsByStatus.map((item) => item.status),
    datasets: [
      {
        label: "Projects by Status",
        data: projectsByStatus.map((item) => item.count),
        backgroundColor: ["#FFA726", "#AB47BC", "#29B6F6", "#66BB6A"],
      },
    ],
  };

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-md m-4">
      <h1 className="text-lg font-semibold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>

          <div className="flex flex-wrap justify-between mt-8">
            <div
              className="w-full md:w-1/2 p-4"
              style={{ maxWidth: "300px", margin: "0 auto" }}
            >
              <h2 className="text-md font-semibold mb-2">
                Employees by Department
              </h2>
              <div style={{ height: "250px" }}>
                <Doughnut data={doughnutRoleData} options={doughnutOptions} />
              </div>
            </div>

            <div
              className="w-full md:w-1/2 p-4"
              style={{ maxWidth: "300px", margin: "0 auto" }}
            >
              <h2 className="text-md font-semibold mb-2">Projects by Status</h2>
              <div style={{ height: "250px" }}>
                <Doughnut
                  data={doughnutProjectData}
                  options={doughnutOptions}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
