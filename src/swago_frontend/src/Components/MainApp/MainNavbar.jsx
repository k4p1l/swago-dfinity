import "../css/Dashboard.css";
import logo from "../../assets/images/logo.png";
import activity from "../../assets/images/activity.png";
import leaderboard from "../../assets/images/leaderboard.png";
import { Link as RouterLink } from "react-router-dom";

export const MainNavbar = () => {
  return (
    <div className="w-full px-4 bg-[#1d2b39] border-b-2 border-[#c5e525]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <div className="w-[6rem]">
            <RouterLink to="/">
              <img src={logo} alt="" />
            </RouterLink>
          </div>
          <div className="sm:w-[32rem] w-[4rem] search-bar">
            <input
              type="text"
              placeholder="Search token or address"
              className="w-full input py-2 px-4 outline-none rounded-lg text-[#E4E2E2] bg-[#293643] border-2 border-[#f5f5f5]"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <img src={activity} alt="" />
            <span className="text-[#E4E2E2] text-sm">Activity</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <img className="w-[30%]" src={leaderboard} alt="" />
            <span className="text-[#E4E2E2] text-sm">Leaderboard</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div>
            <RouterLink to="/login">
              <button className="login-btn">Login</button>
            </RouterLink>
          </div>
          <div>
            <div className="hamburger">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
