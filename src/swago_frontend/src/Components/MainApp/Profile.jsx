import { MainNavbar } from "./MainNavbar";
import pfp from "../../assets/images/1330515.jpg";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
import transactionIcon from "../../assets/icons/transaction.png";
import leaderboardIcon from "../../assets/icons/leaderboard.png";
import eventsIcons from "../../assets/icons/events.png";
import eventsCreatedIcon from "../../assets/icons/Rectangle.png";
import { Link as RouterLink } from "react-router-dom";
export const Profile = () => {
  // const { isConnected, disconnect, principal } = useConnect();
  const { principal, identity } = useAuth();

  return (
    <div className="w-full min-h-screen text-white bg-[#101a23]">
      <MainNavbar />
      <div className="">
        <div className="flex items-center mt-12 px-12 gap-20">
          <img
            src={pfp}
            alt=""
            className="w-[250px] h-[250px] object-cover rounded-full"
          />
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold mt-2">Yogita</h1>
            <p className="text-[#c1c1c1] bg-[#354A63] px-4 py-2 rounded-3xl">
              {principal ? principal.toText() : "No Principal"}
            </p>
          </div>
          <button className="px-8 py-2 border-2 rounded-3xl border-[#ffffff]">
            Edit Profile
          </button>
        </div>
        <div className="flex justify-center items-center gap-20 mt-8">
          <RouterLink to="/transaction-history">
            <div className="w-[200px] h-[200px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white">
              <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
                <img className="" src={transactionIcon} alt="" />
              </div>
              <p>Transaction History</p>
            </div>
          </RouterLink>
          <div className="w-[200px] h-[200px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img src={eventsIcons} alt="" />
            </div>
            <p>Events Participated</p>
          </div>
          <div className="w-[200px] h-[200px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img src={eventsCreatedIcon} alt="" />
            </div>
            <p>Events Created</p>
          </div>
          <div className="w-[200px] h-[200px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img src={leaderboardIcon} alt="" />
            </div>
            <p>Leaderboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};
