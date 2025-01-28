// EventResolver.jsx
import React, { useEffect, useState } from "react";
import { swago_backend } from "../../../../declarations/swago_backend";
import { Principal } from "@dfinity/principal";

export const EventResolver = ({
  singleEventMode = false,
  eventId = null,
  onResolutionComplete = () => {},
}) => {
  const [unresolvedEvents, setUnresolvedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState({});

  // Fetch events based on mode
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (singleEventMode && eventId) {
          // Fetch single event
          const event = await swago_backend.get_events_by_id(BigInt(eventId));
          setUnresolvedEvents(event ? [event] : []);
          console.log("Single event:", event);
        } else {
          // Fetch all unresolved events
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

  const fetchCurrentMarketData = async (symbol) => {
    try {
      const response = await fetch("http://localhost:3001/api/trades");
      if (!response.ok) {
        throw new Error("Failed to fetch market data");
      }
      const trades = await response.json();

      // Log sample trade data
      console.log("Sample trade structure:", trades[0]);
      console.log(
        "All available symbols:",
        trades.map((t) => t.symbol)
      );
      console.log(
        "All available names:",
        trades.map((t) => t.name)
      );

      // Try different variations of the symbol
      const symbolNormalized = symbol.toUpperCase().trim();
      console.log("Looking for symbol:", symbolNormalized);

      const currentData = trades.find((trade) => {
        console.log("Comparing with trade:", {
          symbol: trade.symbol,
          name: trade.name,
          normalized: trade.symbol?.toUpperCase().trim(),
        });
        return trade.symbol?.toUpperCase().trim() === symbolNormalized;
      });

      if (!currentData) {
        // Try fuzzy matching
        const possibleMatches = trades.filter(
          (trade) =>
            trade.symbol?.toUpperCase().includes(symbolNormalized) ||
            symbolNormalized.includes(trade.symbol?.toUpperCase())
        );
        console.log("Possible matches:", possibleMatches);
      }

      return currentData;
    } catch (err) {
      console.error("Error fetching market data:", err);
      throw new Error(`Failed to fetch market data for ${symbol}`);
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

      // Get current market data
      const currentMarketData = await fetchCurrentMarketData(event.coin_nm);
      console.log("Fetched market data:", currentMarketData);

      if (!currentMarketData) {
        throw new Error(`No market data found for ${event.coin_nm}`);
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
        },
      }));

      // Calculate payouts
      const payoutInfo = await swago_backend.calculatePayout(event.betting_id);
      console.log("Payout info:", payoutInfo);

      setResolutionStatus((prev) => ({
        ...prev,
        [event.betting_id]: {
          ...prev[event.betting_id],
          message: "Distributing rewards...",
          payoutInfo,
        },
      }));

      // Distribute rewards
      const distributionResults = await swago_backend.distributeRewards(
        event.betting_id
      );
      console.log("Distribution results:", distributionResults);
      // Check for errors in distribution
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
        },
      }));

      // Remove from unresolved events
      setUnresolvedEvents((prev) =>
        prev.filter((e) => e.betting_id !== event.betting_id)
      );
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

  // Check for events that need resolution
  useEffect(() => {
    const checkForResolution = async () => {
      if (!unresolvedEvents.length) return;

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

    checkForResolution();
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
              {/* <p className="text-gray-300">
                Status: {event.status === 1 ? "Unresolved" : "Resolved"}
              </p> */}
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

                  {resolutionStatus[event.betting_id].stats && (
                    <div className="bg-[#2a3642] p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">
                        Event Statistics
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-300">
                            Total Bets:{" "}
                            {
                              resolutionStatus[event.betting_id].stats
                                .total_bets
                            }
                          </p>
                          <p className="text-gray-300">
                            Yes Bets:{" "}
                            {resolutionStatus[event.betting_id].stats.yes_bets}
                          </p>
                          <p className="text-gray-300">
                            No Bets:{" "}
                            {resolutionStatus[event.betting_id].stats.no_bets}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300">
                            Total Amount:{" "}
                            {
                              resolutionStatus[event.betting_id].stats
                                .total_amount
                            }{" "}
                            SWAG
                          </p>
                          <p className="text-gray-300">
                            Yes Amount:{" "}
                            {
                              resolutionStatus[event.betting_id].stats
                                .yes_amount
                            }{" "}
                            SWAG
                          </p>
                          <p className="text-gray-300">
                            No Amount:{" "}
                            {resolutionStatus[event.betting_id].stats.no_amount}{" "}
                            SWAG
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {resolutionStatus[event.betting_id].payoutInfo && (
                    <div className="bg-[#2a3642] p-4 rounded-lg mt-4">
                      <h4 className="text-white font-semibold mb-2">
                        Payout Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-300">
                          Total Pool:{" "}
                          {
                            resolutionStatus[event.betting_id].payoutInfo
                              .total_pool
                          }{" "}
                          SWAG
                        </p>
                        <p className="text-gray-300">
                          Platform Fee:{" "}
                          {
                            resolutionStatus[event.betting_id].payoutInfo
                              .platform_fee
                          }{" "}
                          SWAG
                        </p>
                        <p className="text-gray-300">
                          Creator Reward:{" "}
                          {
                            resolutionStatus[event.betting_id].payoutInfo
                              .creator_reward
                          }{" "}
                          SWAG
                        </p>
                        <p className="text-gray-300">
                          Winning Side:{" "}
                          {
                            resolutionStatus[event.betting_id].payoutInfo
                              .winning_choice
                          }
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
