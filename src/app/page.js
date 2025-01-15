"use client";
import React, { useEffect, useState } from "react";
import {
  getEmployeeCount,
  getProjectCount,
  getEmployeesByRole,
  getProjectsByStatus,
} from "../api/dashboard";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

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
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Data for the donut chart (Employees by role)
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

  // Data for the donut chart (Projects by status)
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

  // Donut chart options
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
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {loading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : (
        <div className="w-full max-w-4xl">
          {/* Summary cards */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Total Employees
              </h2>
              <p className="text-5xl font-bold text-green-500">
                {employeeCount}
              </p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Total Projects
              </h2>
              <p className="text-5xl font-bold text-blue-500">{projectCount}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Employees by Role
              </h2>
              <div style={{ height: "300px" }}>
                <Doughnut data={doughnutRoleData} options={doughnutOptions} />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Projects by Status
              </h2>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={doughnutProjectData}
                  options={doughnutOptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
