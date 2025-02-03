// EventResolver.jsx
import React, { useEffect, useState } from "react";
import { swago_backend } from "../../../../declarations/swago_backend";
import { Principal } from "@dfinity/principal";
import Moralis from "moralis";
import { initializeMoralis } from "../../../moralisConfig";

export const EventResolver = ({
  singleEventMode = false,
  eventId = null,
  onResolutionComplete = () => {},
}) => {
  const [unresolvedEvents, setUnresolvedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState({});

  // Initialize Moralis
  useEffect(() => {
    initializeMoralis();
  }, []);

  // Fetch events based on mode
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (singleEventMode && eventId) {
          const event = await swago_backend.get_events_by_id(BigInt(eventId));
          setUnresolvedEvents(event ? [event] : []);
          console.log("Single event:", event);
        } else {
          const events = await swago_backend.unresolved_events();
          setUnresolvedEvents(events);
          console.log("All unresolved events:", events);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    if (!singleEventMode) {
      const interval = setInterval(fetchEvents, 60000);
      return () => clearInterval(interval);
    }
  }, [singleEventMode, eventId]);

  // Fetch current market price using Moralis
  const fetchCurrentMarketPrice = async (mint) => {
    try {
      console.log(`🔍 Fetching price for mint: ${mint}`);

      const response = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: mint,
      });

      console.log("📊 Full API Response:", response);

      if (response?.jsonResponse?.nativePrice?.value) {
        const nativeValue = response.jsonResponse.nativePrice.value;
        console.log("Native Price Found:", nativeValue);
        return parseFloat(nativeValue);
      } else {
        throw new Error("No price data found in response");
      }
    } catch (err) {
      console.error("Error fetching token price:", err);
      throw new Error(`Failed to fetch price for mint ${mint}: ${err.message}`);
    }
  };

  // Resolve a single event
  const resolveEvent = async (event) => {
    try {
      console.log("Starting resolution for event:", event);
      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          status: "processing",
          message: "Starting resolution...",
        },
      }));

      // Get current market price using mint address
      const currentMarketCap = await fetchCurrentMarketPrice(event.coin_mint);
      console.log("Current market cap:", currentMarketCap);
      console.log("Initial market cap:", event.coin_market_sol);

      if (typeof currentMarketCap !== "number" || isNaN(currentMarketCap)) {
        throw new Error(`Invalid market cap value for ${event.coin_nm}`);
      }

      // Get event statistics
      const stats = await swago_backend.getEventStats(event.betting_id);
      console.log("Event stats:", stats);

      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          ...prev[event.betting_id],
          message: "Calculating payouts...",
          stats,
          currentMarketCap,
        },
      }));

      // Calculate payouts with current market cap
      const payoutInfo = await swago_backend.calculatePayout(
        event.betting_id,
        currentMarketCap
      );
      console.log("Payout info:", payoutInfo);

      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          ...prev[event.betting_id],
          message: "Distributing rewards...",
          payoutInfo,
        },
      }));

      // Distribute rewards with current market cap
      const distributionResults = await swago_backend.distributeRewards(
        event.betting_id,
        currentMarketCap
      );
      console.log("Distribution results:", distributionResults);

      const hasErrors = distributionResults.some((result) => "err" in result);
      if (hasErrors) {
        throw new Error("Some rewards failed to distribute");
      }

      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          status: "completed",
          message: "Event resolved successfully",
          stats,
          payoutInfo,
          distributionResults,
          currentMarketCap,
        },
      }));

      // Remove from unresolved events
      setUnresolvedEvents((prev) =>
        prev.filter((e) => e.betting_id !== event.betting_id)
      );

      onResolutionComplete();
    } catch (err) {
      console.error("Error resolving event:", err);
      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          status: "error",
          message: err.message,
        },
      }));
    }
  };

  // Auto-check for events that need resolution
  useEffect(() => {
    const checkForResolution = async () => {
      const now = Math.floor(Date.now() / 1000);

      for (const event of unresolvedEvents) {
        console.log("Checking event:", event.betting_id);
        console.log("Event end time:", Number(event.end_time));
        console.log("Current time:", now);

        if (Number(event.end_time) <= now) {
          console.log("Resolving event:", event.betting_id);
          await resolveEvent(event);
        }
      }
    };

    const interval = setInterval(checkForResolution, 30000);
    return () => clearInterval(interval);
  }, [unresolvedEvents]);

  return (
    <div className={`${singleEventMode ? "w-full" : "max-w-4xl mx-auto"} p-4`}>
      {!singleEventMode && (
        <h2 className="text-2xl font-bold mb-6 text-white">
          Event Resolution Monitor
        </h2>
      )}

      {loading && (
        <div className="text-white text-center">
          {singleEventMode ? "Loading event..." : "Loading events..."}
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="space-y-4">
        {unresolvedEvents.map((event) => (
          <div
            key={event.betting_id}
            className={`bg-[#1e293b] p-6 rounded-lg ${
              singleEventMode ? "border-2 border-[#354A63]" : ""
            }`}
          >
            {!singleEventMode && (
              <>
                <h3 className="text-xl text-white mb-2">{event.name}</h3>
                <p className="text-gray-300 mb-2">{event.question}</p>
              </>
            )}

            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-300">
                End Time:{" "}
                {new Date(Number(event.end_time) * 1000).toLocaleString()}
              </p>
              <p className="text-gray-300">
                Initial Market Cap: {event.coin_market_sol} SOL
              </p>
            </div>

            {resolutionStatus[event.betting_id] && (
              <div className="mt-4">
                <div
                  className={`p-4 rounded ${
                    resolutionStatus[event.betting_id].status === "completed"
                      ? "bg-green-500/20"
                      : resolutionStatus[event.betting_id].status === "error"
                      ? "bg-red-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  <p className="text-white font-semibold mb-2">
                    Resolution Status:{" "}
                    {resolutionStatus[event.betting_id].status}
                  </p>
                  <p className="text-white mb-4">
                    {resolutionStatus[event.betting_id].message}
                  </p>

                  {resolutionStatus[event.betting_id].currentMarketCap && (
                    <div className="bg-[#2a3642] p-4 rounded-lg mb-4">
                      <h4 className="text-white font-semibold mb-2">
                        Market Data
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          Initial Price: {event.coin_market_sol} SOL
                        </p>
                        <p className="text-gray-300">
                          Current Price:{" "}
                          {resolutionStatus[event.betting_id].currentMarketCap}{" "}
                          SOL
                        </p>
                        <p className="text-gray-300">
                          Change:{" "}
                          {((resolutionStatus[event.betting_id]
                            .currentMarketCap -
                            event.coin_market_sol) /
                            event.coin_market_sol) *
                            100}
                          %
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!resolutionStatus[event.betting_id] &&
              Number(event.end_time) <= Date.now() / 1000 && (
                <button
                  onClick={() => resolveEvent(event)}
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Resolve Event
                </button>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};
