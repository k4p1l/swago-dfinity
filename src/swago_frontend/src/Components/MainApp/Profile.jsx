import { useEffect, useState } from "react";
import { MainNavbar } from "./MainNavbar";
import pfp from "../../assets/images/1330515.jpg";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
import { swago_backend } from "../../../../declarations/swago_backend";
import { Principal } from "@dfinity/principal"; // Add this import
import transactionIcon from "../../assets/icons/transaction.svg";
import leaderboardIcon from "../../assets/icons/leaderboard.svg";
import eventsIcons from "../../assets/icons/participated.svg";
import eventsCreatedIcon from "../../assets/icons/created.svg";
import { Link as RouterLink } from "react-router-dom";

export const Profile = () => {
  const {
    isConnected,
    principal: connectPrincipal,
    activeProvider,
  } = useConnect();
  const { principal: whoami, identity } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [mintStatus, setMintStatus] = useState("");
  const [hasMinted, setHasMinted] = useState(false);

  // useEffect(() => {
  //   console.log("Connect Principal:", connectPrincipal?.toString());
  //   console.log("Whoami Principal:", whoami?.toString());
  //   console.log("Active Provider:", activeProvider?.meta?.name);
  // }, [connectPrincipal, whoami, activeProvider]);

  const mintInitialTokens = async (principal) => {
    try {
      // Check if we've already minted tokens in this session
      if (hasMinted) {
        console.log("Already minted tokens in this session");
        return;
      }

      console.log("Checking balance for principal:", principal.toString());
      const currentBalance = await swago_backend.balanceOf(principal);
      console.log("Current balance:", currentBalance.toString());

      if (currentBalance === BigInt(0)) {
        console.log("Minting tokens...");
        const mintResult = await swago_backend.mint(principal, BigInt(100));
        console.log("Mint result:", mintResult);
        setHasMinted(true); // Mark as minted

        // Fetch updated balance
        const newBalance = await swago_backend.balanceOf(principal);
        console.log("New balance after minting:", newBalance.toString());
        setTokenBalance(Number(newBalance));
      } else {
        console.log("Account already has tokens");
        setTokenBalance(Number(currentBalance));
      }
    } catch (error) {
      console.error("Error in mintInitialTokens:", error);
    }
  };

  const fetchTokenBalance = async (principal) => {
    try {
      console.log("Fetching balance for:", principal.toString());
      const balance = await swago_backend.balanceOf(principal);
      console.log("Fetched balance:", balance.toString());
      setTokenBalance(Number(balance));
    } catch (error) {
      console.error("Error fetching token balance:", error);
    }
  };

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

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (whoami && !hasMinted) {
          // Add hasMinted check
          console.log("Initializing user with principal:", whoami.toString());
          await mintInitialTokens(whoami);
          // Check final balance
          await fetchTokenBalance(whoami);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [whoami, hasMinted]);

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
    <div className="w-full min-h-screen text-white bg-[#101a23]">
      <MainNavbar />
      <div className="">
        <div className="flex items-center justify-between mt-12 px-12 ">
          <div className="flex items-center gap-20">
            <img
              src={
                profileData?.display_ppicture
                  ? `data:image/jpeg;base64,${arrayBufferToBase64(
                      profileData.display_ppicture
                    )}`
                  : pfp
              }
              alt=""
              className="w-[250px] h-[250px] object-cover rounded-full"
            />
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-semibold mt-2">
                {profileData?.name || "User"}
              </h1>
              {profileData?.bio && (
                <p className="text-gray-300">{profileData.bio}</p>
              )}
              <div className="bg-[#2f9fff] px-6 py-3 rounded-xl">
                <p className="text-xl font-semibold">Token Balance</p>
                <p className="text-2xl">{tokenBalance.toString()} SWAG</p>
                {mintStatus && <p className="text-sm">{mintStatus}</p>}
              </div>
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
                    {connectPrincipal ? connectPrincipal : "No Wallet Address"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <RouterLink to="/edit-profile">
            <button className="px-8 py-2 border-2 rounded-3xl border-[#ffffff]">
              Edit Profile
            </button>
          </RouterLink>
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
