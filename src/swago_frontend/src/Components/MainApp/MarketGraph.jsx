import React, { useEffect, useState } from "react";
import { swago_backend } from "../../../../declarations/swago_backend";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const MarketGraph = ({ eventId, startTime }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedOption, setSelectedOption] = useState("yes");
  const [totalVolume, setTotalVolume] = useState(0);

  const formatTimestamp = (timestamp) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const fetchDataPoints = async () => {
      try {
        const [history, stats] = await Promise.all([
          swago_backend.getVoteHistory(BigInt(eventId)),
          swago_backend.getEventStats(BigInt(eventId)),
        ]);

        if (history.length > 0) {
          const processedHistory = history.map((h) => ({
            timestamp: Number(h.timestamp),
            yesPercentage: Number(h.yesPercentage),
            noPercentage: Number(h.noPercentage),
            totalVotes: Number(h.totalVotes),
            yesAmount: Number(h.yesAmount),
            noAmount: Number(h.noAmount),
          }));

          const sortedHistory = processedHistory.sort(
            (a, b) => a.timestamp - b.timestamp
          );

          if (sortedHistory.length === 0) {
            sortedHistory.push({
              timestamp: startTime,
              yesPercentage: 0,
              noPercentage: 0,
              yesAmount: 0,
              noAmount: 0,
              totalVotes: 0,
            });
          }

          setTotalVolume(
            selectedOption === "yes"
              ? Number(stats.yes_amount)
              : Number(stats.no_amount)
          );

          const data = {
            labels: sortedHistory.map((h) => formatTimestamp(h.timestamp)),
            datasets: [
              // Show only the selected option's line
              {
                label: `${selectedOption.toUpperCase()} %`,
                data: sortedHistory.map((h) => ({
                  x: h.timestamp / 1_000_000_000,
                  y:
                    selectedOption === "yes" ? h.yesPercentage : h.noPercentage,
                })),
                borderColor:
                  selectedOption === "yes"
                    ? "rgb(75, 192, 192)"
                    : "rgb(255, 99, 132)",
                tension: 0.1,
                yAxisID: "y",
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
    const interval = setInterval(fetchDataPoints, 3000);

    return () => clearInterval(interval);
  }, [eventId, selectedOption]); // Add selectedOption to dependencies

  // Update options to reflect selected option
  const options = {
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: `${selectedOption.toUpperCase()} Probability Over Time`,
        color: "white",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            if (label.includes("Volume")) {
              return `${label}: ${context.parsed.y} SWAG`;
            }
            return `${label}: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "white",
          callback: function (value) {
            return value + "%";
          },
        },
        title: {
          display: true,
          text: `${selectedOption.toUpperCase()} Percentage`,
          color: "white",
        },
      },
    },
  };

  return (
    <div className="bg-[#1e293b] p-4 rounded-lg mt-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              selectedOption === "yes"
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedOption("yes")}
          >
            Yes
          </button>
          <button
            className={`px-4 py-2 rounded transition-colors duration-200 ${
              selectedOption === "no"
                ? "bg-red-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setSelectedOption("no")}
          >
            No
          </button>
        </div>
        <div className="text-white bg-gray-700 px-4 py-2 rounded">
          {selectedOption.toUpperCase()} Volume: {totalVolume} SWAG
        </div>
      </div>
      <Line options={options} data={chartData} />
    </div>
  );
};
