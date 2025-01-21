import React, { useEffect, useState } from "react";
import "../css/Dashboard.css";
import "../css/Navbar.css";
import logo from "../../assets/images/logo.png";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";
import activity from "../../assets/images/activity.png";
import leaderboard from "../../assets/images/leaderboard.png";
import { Link as RouterLink } from "react-router-dom";
import searchIcon from "../../assets/images/search.png";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";

export const MainNavbar = () => {
  const { isConnected, disconnect } = useConnect();
  const { isAuthenticated, identity, login, logout } = useAuth();

  //for dropdown menu
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  useEffect(() => {
    if (isConnected) {
      const randomAvatar = `https://robohash.org/${Math.random()}.png?size=50x50`;
      setAvatarUrl(randomAvatar);
    }
  }, [isConnected]);

  return (
    <div className="w-full flex flex-col sm:px-4 bg-[#101a23] border-b-4 border-[#2f9fff]">
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-2 sm:gap-8 nav">
          <div className="sm:w-[6rem]">
            <RouterLink to="/">
              <img className="sm:w-[70%]" src={logo} alt="" />
            </RouterLink>
          </div>
          <div className="sm:w-[32rem] w-[140px] search-bar relative hidden sm:flex">
            <img
              className="absolute left-1 mt-[8px] w-[28px]"
              src={searchIcon}
              alt=""
            />
            <input
              type="text"
              placeholder="Search token or address"
              className="w-full input py-1 px-1 sm:py-2 sm:px-8 outline-none rounded-lg text-[#E4E2E2] bg-[#293643] border-2 border-[#f5f5f5]"
            />
          </div>
          <div className=" flex-col items-center sm:flex hidden gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#f5f5f5"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
              />
            </svg>
            <span className="text-[#E4E2E2] text-sm sm:block hidden">
              Activity
            </span>
          </div>
          <div className="sm:flex flex-col items-center sm:gap-1 hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#f5f5f5"
              viewBox="0 0 16 16"
            >
              <path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1z" />
            </svg>
            <span className="text-[#E4E2E2] text-sm sm:block hidden">
              Leaderboard
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-8">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <RouterLink to="/">
                <button className="login-btn" onClick={logout}>
                  Logout
                </button>
              </RouterLink>
              <ConnectButton />
              <ConnectDialog />
              <div className="flex ">
                <img
                  src={avatarUrl}
                  alt="avatar"
                  style={{ width: 40, borderRadius: "12px" }}
                />
                <svg
                  onClick={() => setIsOpen(!isOpen)}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="#FFFFFF"
                  className="cursor-pointer dropdown sm:w-[38px] w-[30px]"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
                <div className={`dropdown-content ${isOpen ? "show" : ""}`}>
                  <RouterLink to="/profile">Profile</RouterLink>
                  <a href="">Settings</a>
                  <a href="">WatchList</a>
                  <a href="">Learn</a>
                  <a href="">Documentation</a>
                  <a href="">Terms of Use</a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <RouterLink to="/login">
                <button className="login-btn">Login</button>
              </RouterLink>
            </div>
          )}

          {/* <div>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div> */}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 py-2 text-white rounded-xl text-[14px]">
            <a href="#" className="flex items-center gap-2 text-red-500 ">
              <span className="text-[8px]">🔴</span>Live
            </a>
            <a href="#">All</a> <a href="#">Sort Time</a>
            <a href="#">Market Cap</a>
          </div>
          <div className="sm:flex items-center gap-4 px-4 py-1 text-white rounded-xl hidden">
            Support
            <a
              href="https://x.com/TheSwago_"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-[#f5f5f5] rounded-lg px-[10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-twitter-x w-[16px] h-[32px]"
                viewBox="0 0 16 16"
              >
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
              </svg>
            </a>
            <a
              href="https://t.me/theswago"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-[#f5f5f5] rounded-lg px-[10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                fill="currentColor"
                className="bi bi-telegram w-[18px] h-[32px]"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
              </svg>
            </a>
            <a
              href="https://discord.com/invite/3R2z9Bat"
              target="_blank"
              rel="noreferrer"
              className="border-2 border-[#f5f5f5] rounded-lg px-[10px]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                fill="currentColor"
                className="bi bi-discord w-[16px] h-[32px]"
                viewBox="0 0 16 16"
              >
                <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
