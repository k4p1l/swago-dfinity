import React, { useState, useEffect } from "react";
import styled from "styled-components";

// Styled components for styling
const CardContainer = styled.div`
  position: relative;
  background-color: #1e2a3a;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  color: white;
  padding: 20px;
  width: 300px;
  margin: 10px;
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  padding: 8px 12px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  color: white;
  background-color: ${(props) => (props.variant === "yes" ? "green" : "brown")};

  &:hover {
    opacity: 0.8;
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
  image,
  title,
  timerDuration,
  progressYes,
  progressNo,
  createdBy,
  volume,
}) => {
  const [timer, setTimer] = useState(timerDuration);

  // Timer countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CardContainer>
      {/* Header */}
      <Header>
        <img
          src={image}
          alt="avatar"
          style={{ width: 120, borderRadius: "12px" }}
        />
        <Timer>Timer {String(timer).padStart(2, "0")}:00</Timer>
      </Header>

      {/* Title */}
      <Title>{title}</Title>

      {/* Buy Options */}
      <div className="flex">
        <Button variant="yes">
          Buy Yes
          <ion-icon name="chevron-down-sharp"></ion-icon>
        </Button>
        <Button variant="no">
          Buy No
          <ion-icon name="chevron-up-sharp"></ion-icon>
        </Button>
      </div>

      {/* Progress Bars */}
      <ProgressBar>
        <ProgressFill color="green" progress={progressYes}></ProgressFill>
      </ProgressBar>

      {/* Footer */}
      <Footer>
        <MetaText>Created By {createdBy}</MetaText>
        <MetaText>VOL: ${volume}</MetaText>
      </Footer>
      <div className="flex items-center justify-between op-card-icons">
        <div>
          <span className="text-[#9aa0b2] text-[14px]">1 min ago</span>
        </div>
        <div>
          <ion-icon name="chatbubble-ellipses-sharp"></ion-icon>
          <ion-icon name="timer-sharp"></ion-icon>
        </div>
      </div>
    </CardContainer>
  );
};
