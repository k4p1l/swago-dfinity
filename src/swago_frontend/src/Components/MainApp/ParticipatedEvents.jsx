// UserParticipations.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../use-auth-client";
import { swago_backend } from "../../../../declarations/swago_backend";
import { MainNavbar } from "./MainNavbar";

export const UserParticipations = () => {
  const { principal: whoami } = useAuth();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        if (!whoami) return;
        const data = await swago_backend.getUserParticipatedEventsWithBets(
          whoami
        );
        console.log("Participations data:", data);
        setParticipations(data);
      } catch (err) {
        console.error("Error fetching participations:", err);
        setError("Failed to fetch your betting history");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, [whoami]);

  const formatTime = (nanoseconds) => {
    const milliseconds = Number(nanoseconds) / 1_000_000;
    return new Date(milliseconds).toLocaleString();
  };

  const formatStatus = (status) => {
    switch (status) {
      case 0:
        return "Resolved";
      case 1:
        return "Active";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white bg-[#101a23]  min-h-screen">
      <MainNavbar />
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mt-12 mb-8">
          Your Betting History
        </h2>

        {error ? (
          <div className="text-red-500 text-center p-4 bg-red-500/20 rounded">
            {error}
          </div>
        ) : participations.length === 0 ? (
          <div className="text-center text-gray-400">
            You haven't participated in any bets yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {participations.map((participation, index) => (
              <div
                key={index}
                className="bg-[#1e293b] rounded-lg p-6 border border-[#354A63]"
              >
                <div className="flex items-start gap-6">
                  {participation.event.image && (
                    <img
                      src={participation.event.image}
                      alt="Event"
                      className="w-24 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/96x96?text=No+Image";
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2">
                        {participation.event.coin_nm}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          participation.event.status === 0
                            ? "bg-green-500/20 text-green-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {formatStatus(participation.event.status)}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">
                      {participation.event.question}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-400">Your Bet:</span>
                        <span
                          className={`ml-2 font-semibold ${
                            participation.user_bet.choice === "yes"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {participation.user_bet.choice.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Amount:</span>
                        <span className="ml-2 font-semibold">
                          {participation.user_bet.amount} SWAG
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Target Price:</span>
                        <span className="ml-2">
                          {participation.event.coin_market_sol} SOL
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Initial Price:</span>
                        <span className="ml-2">
                          {participation.event.initial_market_sol} SOL
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                      <div>
                        <span>Bet Time:</span>
                        <span className="ml-2">
                          {formatTime(participation.user_bet.timestamp)}
                        </span>
                      </div>
                      <div>
                        <span>End Time:</span>
                        <span className="ml-2">
                          {new Date(
                            Number(participation.event.end_time) * 1000
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {participation.event.status === 0 && (
                      <div className="mt-4 p-3 bg-[#2a3642] rounded">
                        <h4 className="font-semibold mb-2">Result</h4>
                        <div className="flex gap-4">
                          <span className="text-gray-400">Direction:</span>
                          <span className="font-semibold">
                            {participation.event.direction.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
