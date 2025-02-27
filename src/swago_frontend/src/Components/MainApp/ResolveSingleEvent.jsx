// ResolveSingleEvent.jsx
import React, { useEffect, useState } from "react";
import { swago_backend } from "../../../../declarations/swago_backend";
import Moralis from "moralis";
import { initializeMoralis } from "../../../moralisConfig";

export const ResolveSingleEvent = ({ eventId, onResolutionComplete }) => {
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState(null);
  const [event, setEvent] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState({});

  useEffect(() => {
    console.log("ResolveSingleEvent mounted with eventId:", eventId);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing Moralis...");
        await initializeMoralis();
        console.log("Moralis initialized successfully");
        await checkAndResolveEvent();
      } catch (err) {
        console.error("Initialization error:", err);
        setError("Failed to initialize: " + err.message);
      }
    };

    init();
  }, [eventId]);

  const formatMarketCap = (value) => {
    if (!value && value !== 0) return "N/A";
    return `${value} SOL`;
  };

  const fetchCurrentMarketPrice = async (mint) => {
    try {
      const response = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: mint,
      });

      if (response?.jsonResponse?.nativePrice?.value) {
        return parseFloat(response.jsonResponse.nativePrice.value);
      }
      throw new Error("No price data found");
    } catch (err) {
      throw new Error(`Failed to fetch price: ${err.message}`);
    }
  };

  const resolveEvent = async (eventData) => {
    console.log("Starting event resolution for:", eventData);
    try {
      setIsResolving(true);
      setError(null);
      setEvent(eventData);

      // Update initial status
      const initialStatus = {
        status: "processing",
        message: "Starting resolution...",
      };
      console.log("Setting initial status:", initialStatus);
      setResolutionStatus((prev) => ({
        ...prev,
        [eventData.betting_id]: initialStatus,
      }));

      // Get current market price
      console.log("Fetching current market price...");
      const currentMarketCap = await fetchCurrentMarketPrice(
        eventData.coin_mint
      );
      console.log("Current market cap:", currentMarketCap);

      // Update status with market cap
      setResolutionStatus((prev) => ({
        ...prev,
        [eventData.betting_id]: {
          ...prev[eventData.betting_id],
          currentMarketCap,
          message: "Calculating payouts...",
        },
      }));

      // Get event statistics
      console.log("Fetching event stats...");
      const stats = await swago_backend.getEventStats(eventData.betting_id);
      console.log("Event stats:", stats);

      // Calculate payouts
      console.log("Calculating payouts...");
      const payoutInfo = await swago_backend.calculatePayout(
        eventData.betting_id,
        currentMarketCap
      );
      console.log("Payout info:", payoutInfo);

      // Update status with stats and payout info
      setResolutionStatus((prev) => ({
        ...prev,
        [eventData.betting_id]: {
          ...prev[eventData.betting_id],
          stats,
          payoutInfo,
          message: "Distributing rewards...",
        },
      }));

      // Distribute rewards
      console.log("Distributing rewards...");
      const distributionResults = await swago_backend.distributeRewards(
        eventData.betting_id,
        currentMarketCap
      );
      console.log("Distribution results:", distributionResults);

      const hasErrors = distributionResults.some((result) => "err" in result);
      if (hasErrors) {
        throw new Error("Failed to distribute some rewards");
      }

      // Final status update
      const finalStatus = {
        status: "completed",
        message: "Event resolved successfully",
        stats,
        payoutInfo,
        distributionResults,
        currentMarketCap,
      };
      console.log("Setting final status:", finalStatus);
      setResolutionStatus((prev) => ({
        ...prev,
        [eventData.betting_id]: finalStatus,
      }));

      if (onResolutionComplete) {
        onResolutionComplete();
      }
    } catch (err) {
      console.error("Resolution error:", err);
      setError(err.message);
      setResolutionStatus((prev) => ({
        ...prev,
        [eventData.betting_id]: {
          status: "error",
          message: err.message,
        },
      }));
    } finally {
      setIsResolving(false);
    }
  };

  const checkAndResolveEvent = async () => {
    console.log("Checking event status...");
    try {
      const eventResponse = await swago_backend.get_events_by_id(
        BigInt(eventId)
      );
      console.log("Fetched event data:", eventResponse);

      // Handle array response - take the first element
      const eventData = Array.isArray(eventResponse)
        ? eventResponse[0]
        : eventResponse;
      console.log("Processed event data:", eventData);

      if (!eventData) {
        throw new Error("Event not found");
      }

      setEvent(eventData);
      const now = Math.floor(Date.now() / 1000);
      const endTime = Number(eventData.end_time);

      console.log("Event details:", {
        now,
        endTime,
        status: eventData.status,
        needsResolution: endTime <= now && eventData.status === 1n,
      });

      if (!isNaN(endTime) && endTime <= now && eventData.status === 1n) {
        console.log("Event needs resolution, starting resolution process...");
        await resolveEvent(eventData);
      } else {
        console.log("Event does not need resolution yet because:", {
          isEndTimeValid: !isNaN(endTime),
          hasEnded: endTime <= now,
          hasCorrectStatus: eventData.status === 1n,
        });
      }
    } catch (err) {
      console.error("Check and resolve error:", err);
      setError("Failed to check event: " + err.message);
    }
  };

  useEffect(() => {
    console.log("Current state:", {
      event,
      isResolving,
      error,
      resolutionStatus,
    });
  }, [event, isResolving, error, resolutionStatus]);

  if (!event) {
    console.log("No event data, returning null");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-[#1e293b] p-6 rounded-lg border-2 border-[#354A63]">
        <h2 className="text-2xl font-bold mb-6 text-white">
          Event Resolution Status
        </h2>

        {isResolving && (
          <div className="text-white text-center p-4 bg-blue-500/20 rounded mb-4">
            Resolving event...
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-500/20 rounded mb-4">
            {error}
          </div>
        )}

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
                Resolution Status: {resolutionStatus[event.betting_id].status}
              </p>
              <p className="text-white mb-4">
                {resolutionStatus[event.betting_id].message}
              </p>

              {resolutionStatus[event.betting_id] && (
                <div className="bg-[#2a3642] p-4 rounded-lg mb-4">
                  <h4 className="text-white font-semibold mb-2">Market Data</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-300">
                      <span className="font-semibold">Initial Price:</span>{" "}
                      {formatMarketCap(event.initial_market_sol)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Current Price:</span>{" "}
                      {formatMarketCap(
                        resolutionStatus[event.betting_id].currentMarketCap
                      )}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Target Price:</span>{" "}
                      {formatMarketCap(event.coin_market_sol)}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Change:</span>{" "}
                      {(
                        ((resolutionStatus[event.betting_id].currentMarketCap -
                          event.initial_market_sol) /
                          event.initial_market_sol) *
                        100
                      ).toFixed(2)}
                      %
                    </p>
                  </div>
                </div>
              )}

              {resolutionStatus[event.betting_id].stats && (
                <div className="bg-[#2a3642] p-4 rounded-lg mb-4">
                  <h4 className="text-white font-semibold mb-2">Event Stats</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p className="text-gray-300">
                      <span className="font-semibold">Total Bets:</span>{" "}
                      {Number(
                        resolutionStatus[event.betting_id].stats.total_bets
                      )}
                    </p>
                    <p className="text-gray-300">
                      <span className="font-semibold">Total Amount:</span>{" "}
                      {Number(
                        resolutionStatus[event.betting_id].stats.total_amount
                      )}{" "}
                      SWAG
                    </p>
                  </div>
                </div>
              )}

              {resolutionStatus[event.betting_id].payoutInfo && (
                <div className="bg-[#2a3642] p-4 rounded-lg">
                  <h4 className="text-white font-semibold mb-2">Payout Info</h4>
                  <p className="text-gray-300">
                    <span className="font-semibold">Winning Choice:</span>{" "}
                    <span
                      className={
                        resolutionStatus[event.betting_id].payoutInfo
                          .winning_choice === "yes"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {resolutionStatus[
                        event.betting_id
                      ].payoutInfo.winning_choice.toUpperCase()}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
