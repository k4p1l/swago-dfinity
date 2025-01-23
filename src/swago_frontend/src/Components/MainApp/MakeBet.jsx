import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import { getBetting } from "../../utils/actor";
import { useAuth } from "../../use-auth-client";
import { Principal } from "@dfinity/principal";
import { swago_backend } from "../../../../declarations/swago_backend";

export const MakeBet = () => {
  const { id } = useParams();
  const { principal: whoami } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [betAmount, setBetAmount] = useState(1);
  const [betStatus, setBetStatus] = useState(null);
  const [userBalance, setUserBalance] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isBettingActive, setIsBettingActive] = useState(true);
  const [voteStats, setVoteStats] = useState({ yesVotes: 0n, noVotes: 0n });

  const HOUSE_WALLET = Principal.fromText(
    "elieq-ev22i-d7yya-vgih3-bdohe-bj5qc-aoc55-rd4or-nuvef-rqhsz-mqe"
  );

  useEffect(() => {
    if (!event) return;

    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      const endTimeNumber = Number(event.end_time);
      const remaining = endTimeNumber - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setIsBettingActive(false);
        return false;
      }

      setTimeRemaining(remaining);
      return true;
    };

    // Initial calculation
    const isActive = calculateTimeRemaining();
    // Update every second if betting is still active
    if (isActive) {
      const interval = setInterval(() => {
        const isStillActive = calculateTimeRemaining();
        if (!isStillActive) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [event]);

  const formatTime = (seconds) => {
    if (!seconds) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchEventAndBalance = async () => {
      try {
        console.log("Fetching event with ID:", id);
        const bettingId = BigInt(id);
        const result = await getBetting(bettingId);
        console.log("Raw event data:", result);
        setEvent(result);

        // Fetch vote counts
        const votes = await swago_backend.get_no_of_Votes(bettingId);
        console.log("Vote stats:", votes); // Add this log
        setVoteStats({
          yesVotes: votes.yesVotes || 0n,
          noVotes: votes.noVotes || 0n,
        });

        // Fetch user balance
        if (whoami) {
          const balance = await swago_backend.balanceOf(whoami);
          setUserBalance(Number(balance));
        }
      } catch (err) {
        console.error("Detailed error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndBalance();
  }, [id, whoami]);

  const handleBet = async (betType) => {
    try {
      // Check if user is connected
      if (!whoami) {
        throw new Error("Please connect your wallet first");
      }
      if (!isBettingActive) {
        throw new Error("Betting period has ended");
      }

      // Check if betting is still active
      const now = Math.floor(Date.now() / 1000);
      if (now >= Number(event.end_time)) {
        throw new Error("Betting period has ended");
      }
      if (!betAmount || betAmount <= 0) {
        throw new Error("Please enter a valid bet amount");
      }

      // Check balance
      if (userBalance < betAmount) {
        throw new Error(
          `Insufficient balance. You need ${betAmount} SWAG tokens to bet.`
        );
      }

      // Ask for confirmation
      const confirmed = window.confirm(
        `Are you sure you want to bet 5 SWAG tokens on ${betType.toUpperCase()}?`
      );

      if (!confirmed) {
        return;
      }

      setIsProcessing(true);
      setBetStatus(null);
      setError(null);

      // Transfer tokens to house wallet
      const transferResult = await swago_backend.transfer(
        whoami,
        HOUSE_WALLET,
        BigInt(betAmount)
      );

      if (transferResult !== "Transfered successfully") {
        throw new Error(transferResult);
      }

      // Record the bet
      const betData = {
        principal: whoami,
        event_id: BigInt(id),
        yes_or_no: betType,
        amount: BigInt(betAmount),
      };

      const betResult = await swago_backend.Yes_or_no_fun(betData);

      if (betResult === "OK") {
        setBetStatus(`Successfully placed ${betType} bet of ${betAmount} SWAG`);
        // Update user balance
        const newBalance = await swago_backend.balanceOf(whoami);
        setUserBalance(Number(newBalance));
      } else {
        throw new Error("Failed to record bet");
      }
    } catch (err) {
      console.error("Betting error:", err);
      setError(err.message || "Failed to place bet");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculatePercentages = (yesVotes, noVotes) => {
    const total = Number(yesVotes) + Number(noVotes);

    // Return 0% for both if there are no votes
    if (total === 0) {
      return {
        yesPercentage: 0,
        noPercentage: 0,
        total: 0,
      };
    }

    const yesPercentage = Math.round((Number(yesVotes) / total) * 100);
    const noPercentage = Math.round((Number(noVotes) / total) * 100);

    return {
      yesPercentage,
      noPercentage,
      total,
    };
  };

  useEffect(() => {
    const pollVotes = async () => {
      if (!id) return;

      try {
        const votes = await swago_backend.get_no_of_Votes(BigInt(id));
        setVoteStats(votes);
      } catch (err) {
        console.error("Error polling votes:", err);
      }
    };

    const interval = setInterval(pollVotes, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="text-white bg-[#101a23] min-h-screen">
        <MainNavbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white bg-[#101a23] min-h-screen">
        <MainNavbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // Convert Uint8Array to base64 string for image display
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div>
      <MainNavbar />
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="flex flex-col sm:flex-row sm:gap-0 gap-12 justify-between items-center px-4 py-4 max-w-6xl mx-auto">
          <div className="flex-1">
            <div>
              {event && (
                <div className="flex flex-col gap-8">
                  <h2 className="text-4xl font-bold">{event.name}</h2>
                  <div className="flex gap-12 items-center">
                    {event.image && (
                      <img
                        src={`data:image/jpeg;base64,${arrayBufferToBase64(
                          event.image
                        )}`}
                        alt="Event"
                        className="rounded-lg max-w-40 h-auto"
                      />
                    )}
                    <p className="text-xl">{event.question}</p>
                  </div>

                  <p className="text-lg">
                    Start Time:{" "}
                    {new Date(Number(event.start_time) * 1000).toLocaleString()}
                  </p>
                  <p className="text-lg">
                    End Time:{" "}
                    {new Date(Number(event.end_time) * 1000).toLocaleString()}
                  </p>
                  {/* <p>
                    Yes <br />{" "}
                    <span className="text-cyan-300 text-3xl">21% chance</span>
                  </p> */}
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4 border-2 border-[#354A63] rounded-lg p-4 px-8 w-full">
              <p className="text-lg">
                Time Remaining: {formatTime(timeRemaining)}
              </p>
              <p className="text-lg">Your Balance: {userBalance} SWAG</p>
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-500">
                    {
                      calculatePercentages(
                        voteStats.yesVotes,
                        voteStats.noVotes
                      ).yesPercentage
                    }
                    %
                  </p>
                  <p className="text-sm text-gray-400">
                    Yes Votes: {Number(voteStats.yesVotes)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-500">
                    {
                      calculatePercentages(
                        voteStats.yesVotes,
                        voteStats.noVotes
                      ).noPercentage
                    }
                    %
                  </p>
                  <p className="text-sm text-gray-400">
                    No Votes: {Number(voteStats.noVotes)}
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                {calculatePercentages(voteStats.yesVotes, voteStats.noVotes)
                  .total > 0 ? (
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-300"
                    style={{
                      width: `${
                        calculatePercentages(
                          voteStats.yesVotes,
                          voteStats.noVotes
                        ).yesPercentage
                      }%`,
                    }}
                  />
                ) : (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    No votes yet
                  </div>
                )}
              </div>
              <p>Outcome:</p>
              <div className="flex gap-4">
                <button
                  className={`${
                    isProcessing
                      ? "bg-gray-500"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white text-lg px-14 py-2 rounded-lg transition-colors`}
                  onClick={() => handleBet("yes")}
                  disabled={isProcessing}
                >
                  Yes
                </button>
                <button
                  className={`${
                    isProcessing ? "bg-gray-500" : "bg-red-500 hover:bg-red-600"
                  } text-white text-lg px-14 py-2 rounded-lg transition-colors`}
                  onClick={() => handleBet("no")}
                  disabled={isProcessing}
                >
                  No
                </button>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Amount (SWAG Tokens):
                </label>
                <input
                  type="number"
                  min="1"
                  value={betAmount}
                  onChange={(e) =>
                    setBetAmount(Math.max(1, parseInt(e.target.value) || 0))
                  }
                  className="w-full px-3 py-2 bg-[#1F2937] border border-[#354A63] rounded-lg text-white"
                  placeholder="Enter amount"
                />
              </div>
              <p className="text-sm mt-4 text-gray-500">
                By trading you agree to our Terms of Use
              </p>
            </div>
            {betStatus && (
              <div className="text-green-500 text-center p-2 bg-green-500/20 rounded mt-4">
                {betStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
