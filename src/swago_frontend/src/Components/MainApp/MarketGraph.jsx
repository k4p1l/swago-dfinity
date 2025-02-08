import React, { useEffect, useState } from "react";
import { swago_backend } from "../../../../declarations/swago_backend";
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
  const formatTimestamp = (timestamp) => {
    // Convert nanoseconds to milliseconds and create Date object
    // Add 5 hours and 30 minutes for Indian time (IST)
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

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
    const labels = [];
    let currentTime = Math.floor(startTime);
    const now = Math.floor(Date.now() / 1000);

    // Create time intervals (every minute)
    while (currentTime <= now) {
      labels.push(new Date(currentTime * 1000).toLocaleTimeString());
      currentTime += 60; // Add one minute
    }

    const fetchDataPoints = async () => {
      try {
        const history = await swago_backend.getVoteHistory(BigInt(eventId));
        console.log("Raw history:", history);

        if (history.length > 0) {
          const processedHistory = history.map((h) => ({
            timestamp: Number(h.timestamp),
            yesPercentage: Number(h.yesPercentage),
            totalVotes: Number(h.totalVotes),
          }));

          const sortedHistory = processedHistory.sort(
            (a, b) => a.timestamp - b.timestamp
          );

          const data = {
            labels: sortedHistory.map((h) => formatTimestamp(h.timestamp)),
            datasets: [
              {
                label: "Yes Percentage",
                data: sortedHistory.map((h) => ({
                  x: h.timestamp / 1_000_000_000, // Convert to seconds
                  y: h.yesPercentage,
                })),
                borderColor: "rgb(75, 192, 192)",
                tension: 0.1,
              },
            ],
          };
          setChartData(data);
        }
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchDataPoints();
    const interval = setInterval(fetchDataPoints, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [eventId]);

  if (!chartData) return null;

  return (
    <div className="bg-[#1e293b] p-4 rounded-lg mt-8">
      <Line options={options} data={chartData} />
    </div>
  );
};
