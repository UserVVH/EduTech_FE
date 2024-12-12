import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import NavBar from "../../components/Admin/NavBar/NavBar";
import "./css/index.css";
import HeaderAdmin from "../../components/Admin/HeaderAdmin/HeaderAdmin";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function HomeAdmin() {
  const [data, setData] = useState(null); // State to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      const authToken = localStorage.getItem("authToken"); // Assuming auth token is stored in localStorage

      const response = await fetch(
        "http://localhost:8080/api/admin/statistics",
        {
          method: "GET",
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  if (!data) return null;
  const doughnutChartData = {
    labels: [
      "Phần trăm tài liệu được duyệt",
      "Phần trăm tài liệu chờ duyệt",
      "Phần trăm tài liệu bị từ chối",
    ],
    datasets: [
      {
        data: [
          data.verifiedPercentage,
          data.createdPercentage,
          data.rejectedPercentage,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  const totalUsersChartData = {
    labels: ["Tổng người dùng"],
    datasets: [
      {
        label: "Người dùng",
        data: [data.totalUsers],
        backgroundColor: "#FFCE56",
        borderColor: "#FFCE56",
        borderWidth: 1,
      },
    ],
  };

  const totalDocumentChartData = {
    labels: ["Tổng tài liệu"],
    datasets: [
      {
        label: "Tài liệu",
        data: [data.totalDocuments],
        backgroundColor: "#FFCE56",
        borderColor: "#FFCE56",
        borderWidth: 1,
      },
    ],
  };

  const usersByRoleChartData = {
    labels: ["ADMIN", "Giảng viên", "Sinh viên", "Người dùng"],
    datasets: [
      {
        label: "Vai trò",
        data: [
          data.totalAdmins,
          data.totalTeachers,
          data.totalStudents,
          data.totalUsersRole,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "greenyellow"],
        borderColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "greenyellow"],
        borderWidth: 1,
      },
    ],
  };

  const documentCountsChartData = {
    labels: [
      "Tài liệu đã được duyệt",
      "Tài liệu chờ duyệt",
      "Tài liệu bị từ chối",
    ],
    datasets: [
      {
        label: "Số tài liệu",
        data: [
          data.verifiedDocuments,
          data.createdDocuments,
          data.rejectedDocuments,
        ],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderColor: ["#36A2EB", "#4BC0C0", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     tooltip: {
  //       mode: "index",
  //       intersect: false,
  //     },
  //   },
  //   scales: {
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  // };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        titleFont: {
          size: 18,
        },
        bodyFont: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 16,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 16,
          },
        },
      },
    },

    plugins: {
      legend: {
        labels: {
          font: {
            size: 16,
          },
        },
      },
    },
  };

  return (
    <div className="containerHomeAdmin">
      <div className="leftHomeAdmin">
        <NavBar />
      </div>
      <div className="rightHomeAdmin">
        <HeaderAdmin />

        <div className="containerChartAdminTop">
          <div className="chartContainer">
            <h1 className="titleChartAdmin">Phần trăm tài liệu</h1>
            <Doughnut data={doughnutChartData} options={options} />
          </div>

          <div className="chartContainer">
            <h1 className="titleChartAdmin">Tổng tài liệu</h1>
            <Bar data={documentCountsChartData} options={options} />
          </div>
        </div>
        <div className="containerChartAdminBottom">
          <div className="chartContainer">
            <h1 className="titleChartAdmin">Vai trò</h1>
            <Bar data={usersByRoleChartData} options={options} />
          </div>
          <div className="chartContainer">
            <h1 className="titleChartAdmin">Tổng người dùng</h1>
            <Bar data={totalUsersChartData} options={options} />
          </div>
        </div>
        <div className="chartContainer">
          <h1 className="titleChartAdmin">Tổng tài liệu</h1>
          <Bar data={totalDocumentChartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default HomeAdmin;
