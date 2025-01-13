"use client";
import React, { useEffect, useState } from "react";
import { getEmployeeCount, getProjectCount } from "../../../api/dashboard";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [employeeCount, setEmployeeCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employees = await getEmployeeCount();
        const projects = await getProjectCount();
        setEmployeeCount(employees);
        setProjectCount(projects);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const data = {
    labels: ["Employees", "Projects"],
    datasets: [
      {
        label: "Count",
        data: [employeeCount, projectCount],
        backgroundColor: ["#4CAF50", "#2196F3"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-md m-4">
      <h1 className="text-lg font-semibold mb-4">Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
