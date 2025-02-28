import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import { getBetting } from "../../utils/actor";
import { useAuth } from "../../use-auth-client";
import { Principal } from "@dfinity/principal";
import { swago_backend } from "../../../../declarations/swago_backend";
import { MarketGraph } from "./MarketGraph";
import { EventResolver } from "./EventResolver";
import { ResolveSingleEvent } from "./ResolveSingleEvent";
import { BetConfirmationDialog } from "./BetConfirmationDialog";

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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingBet, setPendingBet] = useState(null);
  const [eventResult, setEventResult] = useState(null);
  const [isLoadingResult, setIsLoadingResult] = useState(false);

  const [voteStats, setVoteStats] = useState({
    yesVotes: 0n,
    noVotes: 0n,
    yesAmount: 0n,
    noAmount: 0n,
  });

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

  const fetchEventAndBalance = async () => {
    try {
      const bettingId = BigInt(id);
      const result = await getBetting(bettingId);
      console.log("Raw event data:", result);
      setEvent(result);

      // Fetch vote counts
      const votes = await swago_backend.getEventStats(bettingId);
      console.log("Vote stats:", votes);
      setVoteStats({
        yesVotes: votes.yes_bets || 0n,
        noVotes: votes.no_bets || 0n,
        yesAmount: Number(votes.yes_amount || 0),
        noAmount: Number(votes.no_amount || 0),
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

  // Use fetchEventAndBalance in useEffect
  useEffect(() => {
    fetchEventAndBalance();
  }, [id, whoami]);

  useEffect(() => {
    const fetchEventResult = async () => {
      if (!isBettingActive && event?.betting_id) {
        try {
          setIsLoadingResult(true);
          const payoutInfo = await swago_backend.calculatePayout(
            event.betting_id,
            event.coin_market_sol
          );

          setEventResult({
            winning_choice: payoutInfo.winning_choice,
            target_price: event.coin_market_sol,
            final_price: payoutInfo.current_market_cap,
          });
        } catch (error) {
          console.error("Error fetching result:", error);
        } finally {
          setIsLoadingResult(false);
        }
      }
    };

    fetchEventResult();
  }, [isBettingActive, event]);

  useEffect(() => {
    let intervalId;

    const pollVotes = async () => {
      if (!id || !isBettingActive) return;

      try {
        const votes = await swago_backend.get_no_of_Votes(BigInt(id));
        setVoteStats(votes);
      } catch (err) {
        console.error("Error polling votes:", err);
      }
    };

    // Initial poll
    pollVotes();

    // Set up polling interval if betting is active
    if (isBettingActive) {
      intervalId = setInterval(pollVotes, 5000);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [id, isBettingActive]);

  const handleBet = async (betType) => {
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

    setPendingBet(betType);
    setShowConfirmDialog(true);
  };

  const handleConfirmBet = async () => {
    try {
      setIsProcessing(true);
      setBetStatus(null);
      setError(null);

      const betData = {
        principal: whoami,
        event_id: BigInt(id),
        yes_or_no: pendingBet,
        amount: BigInt(betAmount),
      };

      const betResult = await swago_backend.Yes_or_no_fun(betData);

      if (betResult === "OK") {
        const transferResult = await swago_backend.transfer(
          whoami,
          HOUSE_WALLET,
          BigInt(betAmount)
        );

        if (transferResult !== "Transfered successfully") {
          throw new Error(transferResult);
        }

        const newBalance = await swago_backend.balanceOf(whoami);
        setUserBalance(Number(newBalance));

        setBetStatus(
          `Successfully placed bet on ${pendingBet} with ${betAmount} SWAG`
        );
      } else {
        throw new Error(betResult);
      }
    } catch (err) {
      console.error("Error placing bet:", err);
      setError(err.message || "Failed to place bet");
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setPendingBet(null);
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
        <div className="flex flex-col sm:flex-row sm:gap-8 gap-12 justify-between items-start px-4 py-4 max-w-7xl mx-auto">
          <div className="flex-1">
            <div>
              {event && (
                <div className="flex flex-col gap-8">
                  <h2 className="text-4xl font-bold">{event.name}</h2>
                  <div className="flex gap-12 items-center">
                    {event.image && (
                      <img
                        src={event.image}
                        alt="Event"
                        className="rounded-lg max-w-40 h-auto"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/50x50?text=No+Image";
                        }}
                      />
                    )}
                    <p className="text-xl">{event.question}</p>
                  </div>
                  <div className="flex flex-col items-center bg-[#1e293b] px-6 py-3 rounded-lg">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-2xl font-bold text-white">
                      {Number(voteStats.yesAmount || 0) +
                        Number(voteStats.noAmount || 0)}{" "}
                      SWAG
                    </span>
                  </div>

                  <p className="text-lg">
                    Start Time:{" "}
                    {new Date(Number(event.start_time) * 1000).toLocaleString()}
                  </p>
                  <p className="text-lg">
                    End Time:{" "}
                    {new Date(Number(event.end_time) * 1000).toLocaleString()}
                  </p>
                  <p className="text-lg">
                    Initial Market Cap: {event.initial_market_sol} SOL
                  </p>
                  <p className="text-lg">
                    Target Market Cap: {event.coin_market_sol} SOL
                  </p>
                </div>
              )}
            </div>
            <MarketGraph eventId={id} startTime={Number(event.start_time)} />
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

              {/* progress bar */}
              {(() => {
                const percentages = calculatePercentages(
                  voteStats.yesVotes,
                  voteStats.noVotes
                );

                if (percentages.total === 0) {
                  return (
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                      <div className="text-center text-sm text-gray-500 mt-3">
                        No votes yet
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="space-y-2">
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden relative">
                      <div className="flex h-full">
                        <div
                          className="h-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentages.yesPercentage}%`,
                            background:
                              "linear-gradient(90deg, #34d399 0%, #10b981 100%)",
                            boxShadow: "0 0 10px rgba(52, 211, 153, 0.5)",
                          }}
                        />
                        <div
                          className="h-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentages.noPercentage}%`,
                            background:
                              "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)",
                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.5)",
                          }}
                        />
                      </div>

                      {/* Percentage labels overlaid on the progress bar */}
                      <div className="absolute inset-0 flex justify-between items-center px-2">
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {percentages.yesPercentage}%
                        </span>
                        <span className="text-xs font-bold text-white drop-shadow-md">
                          {percentages.noPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Vote counts */}
                    <div className="flex justify-between text-xs">
                      <span className="text-green-400">
                        {Number(voteStats.yesVotes)} Yes votes
                      </span>
                      <span className="text-red-400">
                        {Number(voteStats.noVotes)} No votes
                      </span>
                    </div>
                  </div>
                );
              })()}
              <p>Outcome:</p>
              <div className="flex gap-4">
                <button
                  className={`${
                    !isBettingActive || isProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white text-lg px-14 py-2 rounded-lg transition-colors`}
                  onClick={() => handleBet("yes")}
                  disabled={!isBettingActive || isProcessing}
                >
                  Yes
                </button>
                <button
                  className={`${
                    !isBettingActive || isProcessing
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white text-lg px-14 py-2 rounded-lg transition-colors`}
                  onClick={() => handleBet("no")}
                  disabled={!isBettingActive || isProcessing}
                >
                  No
                </button>
              </div>
              {!isBettingActive && (
                <p className="text-red-500 text-center">
                  Betting period has ended <br />
                </p>
              )}
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
        {/* Event Resolution Section */}
        {event && (
          <>
            {event.status == 1 &&
            Number(event.end_time) <= Date.now() / 1000 ? (
              <div className="mt-8">
                <h3 className="text-2xl font-bold mb-4 text-center">
                  Event Resolution
                </h3>
                <ResolveSingleEvent
                  eventId={Number(event.betting_id)}
                  onResolutionComplete={() => {
                    fetchEventAndBalance();
                  }}
                />
              </div>
            ) : event.status == 0 ? (
              <div className="mt-8 text-center p-4 bg-green-500/20 rounded-lg max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-2">Event Resolved</h3>
                <p className="text-lg">
                  Rewards have been successfully processed and distributed to
                  participants.
                </p>
                <div className="max-w-2xl mx-auto">
                  <ResolutionResult event={event} userPrincipal={whoami} />
                </div>
              </div>
            ) : null}
          </>
        )}

        <BetConfirmationDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setPendingBet(null);
          }}
          onConfirm={handleConfirmBet}
          betAmount={betAmount}
          betType={pendingBet}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
};

const ResolutionResult = ({ event, userPrincipal }) => {
  const [userResult, setUserResult] = useState(null);
  const [payoutInfo, setPayoutInfo] = useState(null);

  useEffect(() => {
    const fetchUserResult = async () => {
      if (userPrincipal && event?.betting_id) {
        try {
          const payout = await swago_backend.calculatePayout(
            event.betting_id,
            event.coin_market_sol
          );
          setPayoutInfo(payout);
          // Get user bet result
          const userBetResult = await swago_backend.getUserBetResult(
            event.betting_id,
            userPrincipal
          );

          if (userBetResult) {
            setUserResult(userBetResult[0]);
            console.log("User bet result:", userBetResult[0]);
          }
        } catch (error) {
          console.error("Error fetching user result:", error);
        }
      }
    };

    fetchUserResult();
  }, [userPrincipal, event]);

  return (
    <div className="bg-[#2a3642] p-6 rounded-lg mt-4">
      <h4 className="text-xl font-bold text-white mb-4">Resolution Results</h4>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Winning Choice:</span>
          <span
            className={`font-bold ${
              payoutInfo?.winning_choice === "yes"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {payoutInfo?.winning_choice.toUpperCase()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Target Price:</span>
          <span className="text-white">{event.coin_market_sol} SOL</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400">Final Price:</span>
          <span className="text-white">
            {payoutInfo?.current_market_cap} SOL
          </span>
        </div>

        {userResult && (
          <div className="mt-6 p-4 bg-[#1e293b] rounded-lg">
            <h5 className="text-lg font-semibold text-white mb-3">
              Your Result
            </h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Your Choice:</span>
                <span
                  className={`font-bold ${
                    userResult.choice === "yes"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {userResult.choice.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bet Amount:</span>
                <span className="text-white">
                  {Number(userResult.bet_amount)} SWAG
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Outcome:</span>
                <span
                  className={`font-bold ${
                    userResult.won ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {userResult.won ? "WON" : "LOST"}
                </span>
              </div>
              {userResult.won && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Payout:</span>
                  <span className="text-green-500 font-bold">
                    +{userResult.payout_amount} SWAG
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
