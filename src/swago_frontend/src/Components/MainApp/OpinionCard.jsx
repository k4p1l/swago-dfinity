import React, { useState, useEffect } from "react";
import styled from "styled-components";
import doubleArrowUp from "../../assets/images/double arrow.png";
import doubleArrowDown from "../../assets/images/double arrow down.png";
import { useAuth } from "../../use-auth-client";
import { Principal } from "@dfinity/principal";
import { swago_backend } from "../../../../declarations/swago_backend";
import { useNavigate } from "react-router-dom";

// Add this utility function at the top of your file
const arrayBufferToImageUrl = (arrayBuffer) => {
  // Convert the array buffer to base64 in chunks
  const chunk_size = 8192;
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunk_size) {
    const chunk = bytes.slice(i, i + chunk_size);
    binary += String.fromCharCode.apply(null, chunk);
  }

  // Convert to base64
  const base64 = btoa(binary);
  return `data:image/jpeg;base64,${base64}`;
};

// const ImageDisplay = ({ imageData }) => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (imageData) {
//       try {
//         setLoading(true);
//         // Check if imageData is a Uint8Array
//         if (imageData instanceof Uint8Array) {
//           const url = arrayBufferToImageUrl(imageData);
//           setImageUrl(url);
//         } else {
//           // If it's already a blob or other format
//           setImageUrl(URL.createObjectURL(new Blob([imageData])));
//         }
//         setLoading(false);
//       } catch (err) {
//         console.error("Image conversion error:", err);
//         setError("Failed to load image");
//         setLoading(false);
//       }
//     }
//   }, [imageData]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return imageUrl ? (
//     <img
//       src={imageUrl}
//       alt="Betting image"
//       className="w-[50px] h-[50px] rounded-lg object-cover"
//       onError={() => setError("No image")}
//     />
//   ) : null;
// };

// Styled components for styling
const CardContainer = styled.div`
  position: relative;
  background-color: #1e2a3a;
  border: 2px solid #2f9fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: white;
  padding: 20px;
  width: 330px;
  height: 100%;
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  margin-bottom: 4px;
`;

const Timer = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: red;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: bold;
`;

const Title = styled.h4`
  margin: 10px 0;
`;

const ProgressBar = styled.div`
  background-color: red;
  border-radius: 10px;
  height: 10px;
  width: 100%;
  margin: 10px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background-color: ${(props) => props.color || "green"};
  height: 100%;
  width: ${(props) => props.progress || "0%"};
`;

const Button = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 18px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.variant === "yes" ? "green" : "brown")};
  opacity: ${(props) => (props.disabled ? "0.7" : "1")};
  &:hover {
    opacity: ${(props) => (props.disabled ? "0.7" : "0.8")};
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const MetaText = styled.small`
  color: #9aa0b2;
`;

export const OpinionCard = ({
  name,
  question,
  set_Time,
  start_time,
  end_time,
  image,
  betting_id,
}) => {
  const { principal: whoami } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isBettingActive, setIsBettingActive] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [betStatus, setBetStatus] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const HOUSE_WALLET = Principal.fromText(
    "elieq-ev22i-d7yya-vgih3-bdohe-bj5qc-aoc55-rd4or-nuvef-rqhsz-mqe"
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (whoami) {
          console.log("Fetching profile for principal:", whoami.toString());
          const result = await swago_backend.get_profile_details(whoami);
          console.log("Profile fetch result:", result);
          if (result) {
            // Remove .length check as result might be an optional
            setProfileData(result[0]);
            console.log("Profile data:", profileData);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [whoami]);

  // Format time to MM:SS
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const checkBalance = async () => {
    try {
      if (!whoami) return 0;
      const balance = await swago_backend.balanceOf(whoami);
      return Number(balance);
    } catch (error) {
      console.error("Error checking balance:", error);
      return 0;
    }
  };

  const handleBet = async (betType) => {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to bet 5 SWAG tokens on ${betType.toUpperCase()}?`
      );

      if (!confirmed) {
        return;
      }

      setIsProcessing(true);
      setError(null);
      setBetStatus(null);

      if (!whoami) {
        throw new Error("Please connect your wallet first");
      }

      const balance = await checkBalance();
      if (balance < 5) {
        throw new Error("Insufficient balance. You need 5 SWAG tokens to bet.");
      }

      // First, transfer tokens to house wallet
      const transferResult = await swago_backend.transfer(
        whoami,
        HOUSE_WALLET,
        BigInt(5)
      );

      if (transferResult !== "Transfered successfully") {
        throw new Error(transferResult);
      }

      // Then record the bet
      const betData = {
        principal: whoami,
        event_id: betting_id,
        yes_or_no: betType,
        amount: BigInt(5),
      };

      const betResult = await swago_backend.Yes_or_no_fun(betData);

      if (betResult === "OK") {
        setBetStatus(`Successfully placed ${betType} bet`);
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

  const getTimeAgo = (startTime) => {
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const startTimeNumber = Number(startTime); // Convert BigInt to Number
    const diffInSeconds = now - startTimeNumber;

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "min" : "mins"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  const handleCardClick = () => {
    navigate(`/bet/${betting_id}`);
  };

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = Math.floor(Date.now() / 1000); // Current time in seconds
      // Convert BigInt to Number before subtraction
      const endTimeNumber = Number(end_time);
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
  }, [end_time]);

  return (
    <CardContainer>
      {/* Header */}
      <Header>
        {/* <ImageDisplay imageData={image} /> */}
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-[50px] h-[50px] rounded-lg object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/50x50?text=No+Image";
            }}
          />
        ) : (
          <div className="w-[50px] h-[50px] rounded-lg bg-gray-600 flex items-center justify-center">
            <span className="text-xs text-gray-300">No Image</span>
          </div>
        )}
        <Timer timeLeft={timeRemaining}>
          Timer {formatTime(timeRemaining)}
        </Timer>
        <Title>{name}</Title>
      </Header>
      <p className="py-2">{question}</p>

      {/* Buy Options */}
      <div className="flex justify-between">
        {isBettingActive ? (
          <>
            <Button
              variant="yes"
              onClick={handleCardClick}
              disabled={isProcessing}
            >
              Buy Yes
              <img
                className="w-[28px] ml-2"
                src={doubleArrowUp}
                alt="double arrow"
              />
            </Button>
            <Button
              variant="no"
              onClick={handleCardClick}
              disabled={isProcessing}
            >
              Buy No
              <img
                className="w-[28px] ml-2"
                src={doubleArrowDown}
                alt="double arrow"
              />
            </Button>
          </>
        ) : (
          <div>
            <div className="text-red-500 w-full text-center py-2">
              Market has ended. Your rewards will be processed soon.
            </div>
            <div className="flex justify-between">
              <Button variant="yes" disabled>
                {isProcessing ? "Processing..." : "Buy Yes"}
                <img
                  className="w-[28px] ml-2"
                  src={doubleArrowUp}
                  alt="double arrow"
                />
              </Button>
              <Button variant="no" disabled>
                {isProcessing ? "Processing..." : "Buy No"}
                <img
                  className="w-[28px] ml-2"
                  src={doubleArrowDown}
                  alt="double arrow"
                />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && <div className="text-red-500 text-center text-sm">{error}</div>}
      {betStatus && (
        <div className="text-green-500 text-center text-sm">{betStatus}</div>
      )}

      {/* Progress Bars */}
      {/* <ProgressBar>
        <ProgressFill color="green" progress={progressYes}></ProgressFill>
      </ProgressBar> */}

      {/* Footer */}
      <Footer>
        <MetaText>Created By {profileData?.name || "User"}</MetaText>
        <MetaText>VOL: ${betting_id}</MetaText>
      </Footer>
      <div className="flex items-center justify-between op-card-icons bg-[#375066] rounded-xl p-2 mt-2">
        <div>
          <span className="text-[#9aa0b2] text-[14px]">
            {" "}
            {getTimeAgo(start_time)}
          </span>
        </div>
        <div className="flex gap-2">
          <ion-icon name="chatbubble-ellipses-sharp"></ion-icon>
          <ion-icon name="timer-sharp"></ion-icon>
        </div>
      </div>
    </CardContainer>
  );
};
