import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const MarketGraph = ({ eventId, startTime }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Yes Probability Over Time",
        color: "white",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  useEffect(() => {
    const dataPoints = [];
    const labels = [];
    let currentTime = Math.floor(startTime);
    const now = Math.floor(Date.now() / 1000);

    // Create time intervals (every minute)
    while (currentTime <= now) {
      labels.push(new Date(currentTime * 1000).toLocaleTimeString());
      currentTime += 60; // Add one minute
    }

    // Simulate data points (replace this with actual data from your backend)
    const fetchDataPoints = async () => {
      try {
        // Here you would fetch historical voting data from your backend
        // For now, we'll generate random data
        const points = labels.map((_, index) => {
          return Math.random() * 100;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: "Yes Probability (%)",
              data: points,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
              fill: false,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchDataPoints();
  }, [eventId, startTime]);

  return (
    <div className="bg-[#1e293b] p-4 rounded-lg mt-8">
      <Line options={options} data={chartData} />
    </div>
  );
};
