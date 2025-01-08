import { MainNavbar } from "./MainNavbar";
import pfp from "../../assets/images/1330515.jpg";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
import transactionIcon from "../../assets/icons/transaction.svg";
import leaderboardIcon from "../../assets/icons/leaderboard.svg";
import eventsIcons from "../../assets/icons/participated.svg";
import eventsCreatedIcon from "../../assets/icons/created.svg";
import { Link as RouterLink } from "react-router-dom";
export const Profile = () => {
  const { isConnected, principal, activeProvider } = useConnect();
  const { principal: whoami, identity } = useAuth();

  return (
    <div className="w-full min-h-screen text-white bg-[#101a23]">
      <MainNavbar />
      <div className="">
        <div className="flex items-center justify-between mt-12 px-12 ">
          <div className="flex items-center gap-20">
            <img
              src={pfp}
              alt=""
              className="w-[250px] h-[250px] object-cover rounded-full"
            />
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold mt-2">User</h1>
              <div className="flex gap-8">
                <div className="flex flex-col gap-4">
                  <p className="px-4">Internet Identity Address</p>
                  <p className="text-[#c1c1c1] bg-[#354A63] px-4 py-2 rounded-3xl">
                    {whoami
                      ? whoami.toText().slice(0, 20) + "..."
                      : "No Principal"}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="px-4">Connected Provider</p>
                  <p className="text-[#c1c1c1] bg-[#354A63] px-4 py-2 rounded-3xl">
                    {activeProvider?.meta?.name
                      ? activeProvider?.meta?.name
                      : "No Provider"}
                  </p>
                  <p className="text-[#c1c1c1] bg-[#354A63] px-4 py-2 rounded-3xl">
                    {principal ? principal : "No Wallet Address"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button className="px-8 py-2 border-2 rounded-3xl border-[#ffffff]">
            Edit Profile
          </button>
        </div>
        <div className="flex justify-center items-center gap-20 mt-8">
          <RouterLink to="/transaction-history">
            <div className="w-[250px] h-[250px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white border-2 border-[#ffffff]">
              <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center ">
                <img
                  className="w-[32px] h-[32px]"
                  src={transactionIcon}
                  alt=""
                />
              </div>
              <p>Transaction History</p>
            </div>
          </RouterLink>
          <div className="w-[250px] h-[250px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white border-2 border-[#ffffff]">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img src={eventsIcons} className="w-[32px] h-[32px]" alt="" />
            </div>
            <p>Events Participated</p>
          </div>
          <div className="w-[250px] h-[250px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white border-2 border-[#ffffff]">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img
                src={eventsCreatedIcon}
                className="w-[32px] h-[32px]"
                alt=""
              />
            </div>
            <p>Events Created</p>
          </div>
          <div className="w-[250px] h-[250px]  rounded-lg flex justify-center items-center flex-col gap-4 text-white border-2 border-[#ffffff]">
            <div className="w-[90px] h-[90px] bg-[#ffffff] rounded-full flex justify-center items-center">
              <img src={leaderboardIcon} className="w-[32px] h-[32px]" alt="" />
            </div>
            <p>Leaderboard</p>
          </div>
        </div>
      </div>
    </div>
  );
};
