import "../css/Dashboard.css";
import logo from "../../assets/images/logo.png";
import activity from "../../assets/images/activity.png";
import leaderboard from "../../assets/images/leaderboard.png";
import { Link as RouterLink } from "react-router-dom";

export const MainNavbar = () => {
  return (
    <div className="w-full px-4 bg-[#1d2b39] border-b-2 border-[#c5e525]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-8 nav">
          <div className="sm:w-[6rem] w-[3rem]">
            <RouterLink to="/">
              <img src={logo} alt="" />
            </RouterLink>
          </div>
          <div className="sm:w-[32rem] w-[140px] search-bar">
            <input
              type="text"
              placeholder="Search token or address"
              className="w-full input py-2 px-4 outline-none rounded-lg text-[#E4E2E2] bg-[#293643] border-2 border-[#f5f5f5]"
            />
          </div>
          <div className="flex flex-col items-center sm:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#f5f5f5"
              class="bi bi-graph-up"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07"
              />
            </svg>
            <span className="text-[#E4E2E2] text-sm sm:block hidden">
              Activity
            </span>
          </div>
          <div className="flex flex-col items-center sm:gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#f5f5f5"
              class="bi bi-bar-chart-line-fill"
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
