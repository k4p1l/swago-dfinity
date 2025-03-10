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
        console.log("🔄 Fetching events...", { singleEventMode, eventId });
        if (singleEventMode && eventId) {
          const event = await swago_backend.get_events_by_id(BigInt(eventId));
          console.log("Single event fetched:", event);
          if (event) {
            setUnresolvedEvents([event]);
            // Pre-check if event needs immediate resolution
            const now = Math.floor(Date.now() / 1000);
            if (Number(event.end_time) <= now) {
              console.log("Event needs immediate resolution");
              resolveEvent(event);
            }
          } else {
            setUnresolvedEvents([]);
          }
        } else {
          const events = await swago_backend.unresolved_events();
          console.log("All unresolved events fetched:", events);
          setUnresolvedEvents(events);
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // Set up refresh interval only for non-single mode
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
    if (resolutionStatus[event.betting_id]?.status === "processing") {
      console.log("Event already being resolved:", event.betting_id);
      return;
    }

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
      console.log("Target market cap:", event.coin_market_sol);
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

      if (!hasErrors) {
        // Call the completion callback
        onResolutionComplete();
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

      // onResolutionComplete();
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

  useEffect(() => {
    if (singleEventMode && eventId) {
      const checkAndResolveSingleEvent = async () => {
        try {
          const now = Math.floor(Date.now() / 1000);

          // Fetch the event directly using the ID
          const event = await swago_backend.get_events_by_id(BigInt(eventId));

          if (event) {
            const endTime = Number(event.end_time);
            console.log("Single event check:", {
              eventId: Number(event.betting_id),
              endTime,
              now,
              difference: endTime - now,
              status: resolutionStatus[event.betting_id]?.status,
              event: event, // Log the full event for debugging
            });

            if (endTime <= now && !resolutionStatus[event.betting_id]) {
              console.log(`🚀 Auto-resolving single event ${event.betting_id}`);
              try {
                await resolveEvent(event);
              } catch (error) {
                console.error(
                  `Failed to resolve single event ${event.betting_id}:`,
                  error
                );
              }
            }
          } else {
            console.log("No event found for ID:", eventId);
          }
        } catch (error) {
          console.error("Error in checkAndResolveSingleEvent:", error);
        }
      };

      console.log("Setting up single event resolution for ID:", eventId);

      // Initial check
      checkAndResolveSingleEvent();

      // Set up interval for periodic checks
      const interval = setInterval(checkAndResolveSingleEvent, 5000);

      return () => {
        console.log("Cleaning up single event resolution interval");
        clearInterval(interval);
      };
    }
  }, [singleEventMode, eventId]);

  useEffect(() => {
    if (!singleEventMode) {
      const checkAndResolveEvent = async () => {
        // Check each unresolved event
        for (const event of unresolvedEvents) {
          const now = Math.floor(Date.now() / 1000);
          const endTime = Number(event.end_time);

          // If event has ended and isn't already being resolved
          if (endTime <= now && !resolutionStatus[event.betting_id]) {
            console.log(`Auto-resolving event ${event.betting_id}`);
            await resolveEvent(event);
          } else if (endTime > now) {
            // Calculate time until event ends
            const timeUntilEnd = (endTime - now) * 1000; // Convert to milliseconds
            console.log(
              `Event ${event.betting_id} will resolve in ${
                timeUntilEnd / 1000
              } seconds`
            );

            // Set timeout to resolve when event ends
            setTimeout(async () => {
              if (!resolutionStatus[event.betting_id]) {
                console.log(`Time's up! Resolving event ${event.betting_id}`);
                await resolveEvent(event);
              }
            }, timeUntilEnd);
          }
        }
      };

      // Run initial check
      checkAndResolveEvent();

      // Set up periodic checks (every minute)
      const interval = setInterval(checkAndResolveEvent, 6000);

      // Cleanup
      return () => clearInterval(interval);
    }
  }, [unresolvedEvents]);

  // Auto-check for events that need resolution
  useEffect(() => {
    const checkForResolution = async () => {
      const now = Math.floor(Date.now() / 1000);

      for (const event of unresolvedEvents) {
        if (Number(event.end_time) <= now) {
          console.log("Resolving event:", event.betting_id);
          await resolveEvent(event);
        }
      }
    };

    const interval = setInterval(checkForResolution, 3000);
    return () => clearInterval(interval);
  }, [unresolvedEvents]);

  // useEffect(() => {
  //   console.log("EventResolver mounted with:", {
  //     singleEventMode,
  //     eventId,
  //     unresolvedEvents,
  //   });
  // }, [singleEventMode, eventId, unresolvedEvents]);

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

      {error && (
        <div className="text-red-500 text-center p-4 rounded bg-red-500/20">
          {error}
        </div>
      )}

      {!loading && !error && unresolvedEvents.length === 0 && (
        <div className="text-white text-center">No events to resolve</div>
      )}

      <div className="space-y-4">
        {unresolvedEvents.map((eventData) => {
          // Handle nested array structure if present
          const event = Array.isArray(eventData) ? eventData[0] : eventData;

          // Format dates and values
          const formatEventTime = (timestamp) => {
            try {
              if (!timestamp) return "Invalid Date";
              const timeInMs = Number(timestamp) * 1000;
              if (isNaN(timeInMs)) return "Invalid Date";
              return new Date(timeInMs).toLocaleString();
            } catch (error) {
              console.error("Error formatting time:", error);
              return "Invalid Date";
            }
          };

          const formatMarketCap = (value) => {
            if (!value && value !== 0) return "N/A";
            return `${value} SOL`;
          };

          return (
            <div
              key={event?.betting_id?.toString()}
              className={`bg-[#1e293b] p-6 rounded-lg ${
                singleEventMode ? "border-2 border-[#354A63]" : ""
              }`}
            >
              {!singleEventMode && (
                <>
                  <h3 className="text-xl text-white mb-2">{event?.coin_nm}</h3>
                  <p className="text-gray-300 mb-2">{event?.question}</p>
                </>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="text-gray-300">
                  <span className="font-semibold">End Time:</span>{" "}
                  {formatEventTime(event?.end_time)}
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Target Market Cap:</span>{" "}
                  {formatMarketCap(event?.coin_market_sol)}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <div className="text-gray-300">
                  <span className="font-semibold">Initial Market Cap:</span>{" "}
                  {formatMarketCap(event?.initial_market_sol)}
                </div>
                <div className="text-gray-300">
                  <span className="font-semibold">Direction:</span>{" "}
                  <span
                    className={
                      event?.direction === "increase"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {event?.direction?.toUpperCase()}
                  </span>
                </div>
              </div>

              {resolutionStatus[event?.betting_id] && (
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <p className="text-gray-300">
                            <span className="font-semibold">
                              Initial Price:
                            </span>{" "}
                            {formatMarketCap(event.initial_market_sol)}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-semibold">
                              Current Price:
                            </span>{" "}
                            {formatMarketCap(
                              resolutionStatus[event.betting_id]
                                .currentMarketCap
                            )}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-semibold">Target Price:</span>{" "}
                            {formatMarketCap(event.coin_market_sol)}
                          </p>
                          <p className="text-gray-300">
                            <span className="font-semibold">Change:</span>{" "}
                            {(
                              ((resolutionStatus[event.betting_id]
                                .currentMarketCap -
                                event.initial_market_sol) /
                                event.initial_market_sol) *
                              100
                            ).toFixed(2)}
                            %
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!resolutionStatus[event?.betting_id] &&
                Number(event?.end_time) <= Date.now() / 1000 && (
                  <div className="mt-4 p-4 bg-blue-500/20 rounded">
                    <p className="text-white text-center">
                      Event has ended. Resolution in progress...
                    </p>
                  </div>
                )}
              {resolutionStatus[event?.betting_id] && (
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
                    {/* Rest of your resolution status display */}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
