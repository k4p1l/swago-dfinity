import React, { useState, useEffect } from "react";
import { getAllBettings } from "../../utils/actor";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";
import "../css/Dashboard.css";
import top from "../../assets/images/top.png";
import image from "../../assets/images/1330515.jpg";
import wallet from "../../assets/images/wallet.png";
import searchIcon from "../../assets/images/search.png";
import { MainNavbar } from "./MainNavbar";
import { CustomSlider } from "./CustomSlider";
import { OpinionCard } from "./OpinionCard";
import { RecentActivity } from "./RecentActivity";
import { TopVolumeThisWeek } from "./TopVolumeThisWeek";
import { Footer } from "./Footer";
import { TrustedBy } from "./TrustedBy";
import { Link as RouterLink } from "react-router-dom";
export const Dashboard = () => {
  const cardData = [
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },
    {
      image: image,
      title: "How likely is Dogecoin to reach $1 by [specific date]?",
      timerDuration: 5, // Timer in minutes
      progressYes: "65%",
      progressNo: "35%",
      createdBy: "K.John",
      volume: "6.1K",
    },

    // Add more cards here
  ];

  const [bettings, setBettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBettings, setFilteredBettings] = useState([]);

  useEffect(() => {
    const fetchBettings = async () => {
      try {
        const result = await getAllBettings();
        console.log("Fetched bettings:", result);
        setBettings(result);
        setFilteredBettings(result); // Initialize filtered bettings
      } catch (err) {
        console.error("Error fetching bettings:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBettings();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredBettings(bettings);
    } else {
      const filtered = bettings.filter((betting) => {
        return (
          betting.name?.toLowerCase().includes(query) ||
          betting.question?.toLowerCase().includes(query)
        );
      });
      setFilteredBettings(filtered);
    }
  };

  return (
    <div className="overflow-hidden dashboard-container">
      <MainNavbar />
      <div className="flex items-center justify-center gap-4 bg-[#101a23] py-4 px-4 sm:px-0">
        <div className="bg-[#4097F3] py-2 sm:px-8  rounded-md text-xs">
          <p className="text-center">
            TK2n...CBAQ{" "}
            <span className="text-[#FFEA00]">Sold 1,273.8 TRX of UNWUKONG</span>
          </p>
        </div>
        <div className="bg-[#FB84CA] py-2 px-8 text-xs rounded-md">
          <p className="text-center">
            TKZu...HKcR{" "}
            <span className="text-[#FFEA00]">Sold 1,121.9 TRX of UNDOG</span>
          </p>
        </div>
      </div>
      <div className="bg-[#101a23]">
        <CustomSlider />
        <div className="mt-4 sm:px-16 ">
          <div className="filters">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="sm:w-[24rem] w-[180px] search-bar flex relative">
                <img
                  className="absolute left-4 mt-[10px] scale-125"
                  src={searchIcon}
                  alt=""
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search market by name or question..."
                  className="w-full input py-2 px-12  outline-none rounded-lg text-[#E4E2E2] bg-[#293643] border-2 border-[#f5f5f5] text-[14px]"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setFilteredBettings(bettings);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-lg ">
                <img src={top} alt="" />
                <span className="text-white">Top</span>
              </div>
              <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-lg">
                <span className="text-white">New</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#f5f5f5"
                  className="bi bi-filter"
                  viewBox="0 0 16 16"
                >
                  <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
                </svg>
                <span className="text-white">Filters</span>
              </div>
              <div className="flex items-center gap-4 bg-[#354350] px-8 py-2 rounded-xl">
                <span className="text-white">Status</span>
              </div>
              <div className="flex items-center gap-2 bg-[#354350] px-2 py-2 rounded-xl">
                <span className="text-white">15 Min</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="#f5f5f5"
                  className="bi bi-chevron-down sm:w-[20px]"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-4 bg-[#354350] px-2 py-1 rounded-xl refresh border-2 border-[#4fb4f7]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  fill="#f5f5f5"
                  className="bi bi-arrow-clockwise w-[20px]"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                  />
                  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <p className="text-white">Loading bettings...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
                padding: "20px 0px",
                backgroundColor: "#0f172a",
                minHeight: "45vh",
                justifyItems: "center",
              }}
            >
              {filteredBettings.length > 0 ? (
                filteredBettings.map((betting, index) => (
                  <div
                    className="w-fit mx-auto"
                    key={betting?.betting_id?.toString() ?? index}
                  >
                    <RouterLink to={`/bet/${betting?.betting_id}`}>
                      <OpinionCard {...betting} />
                    </RouterLink>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-white">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center py-6">
          <button className="bg-[#00AEEF] text-[#E8F1F5] text-3xl px-8 py-2 rounded-md font-semibold tracking-tighter text-center ">
            Show More
          </button>
        </div>
        <div className="stay-tuned gradient-border max-w-[1400px] mx-auto py-10 pt-6 mt-24">
          <h2 className="text-3xl font-semibold tracking-tighter text-center">
            Stay Tuned
          </h2>
          <p className="mt-2 text-xl text-center text-white/70">
            We are working hard to provide you with the best experience
            possible.
          </p>
          <div className="flex items-center justify-center sm:gap-20 gap-4">
            <input
              type="email"
              placeholder="Enter your Email"
              className="sm:w-[40%] w-full input py-2 px-4 outline-none rounded-xl text-[#0e0e0e] bg-white border-2 border-[#f5f5f5] mt-4 placeholder-[#545454]"
            />
            <div>
              <button className="px-6 py-2 mt-4 font-bold tracking-wider text-black bg-white rounded-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-start gap-12 sm:px-16 my-20 sm:flex-row px-4">
          <div
            id="recent-activity"
            className="text-white border-2 border-[#2f9fff] bg-[#2a3642] sm:pb-10 sm:pt-6 px-6 flex-1 rounded-2xl mt-20 py-6 "
          >
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-medium tracking-tighter sm:text-2xl">
                Recent Activity
              </h2>
              <button className="border-2 border-[#ffffff] rounded-2xl py-1 px-4">
                See All
              </button>
            </div>
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
          </div>
          <div className="text-white bg-[#2a3642] border-2 border-[#2f9fff] sm:py-6 px-4 flex-1 rounded-2xl mt-20 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-medium tracking-tighter sm:text-2xl">
                Top Volume This Week
              </h2>
              <button className="border-2 border-[#ffffff] rounded-2xl py-1 px-4 ">
                See All
              </button>
            </div>
            <TopVolumeThisWeek />
          </div>
        </div>
        <TrustedBy />
        <div className="relative">
          <div className="flex items-center justify-center gap-4 mt-20 bg-[#EBEBEB] py-4 absolute top-[-200px] right-[calc(50%-390px)] px-16 rounded-xl">
            <img className="w-[100px]" src={wallet} alt="" />
            <p className="text-2xl font-bold">
              Please <span className="text-[#0638ff]">Connect</span> your Wallet
              First
            </p>
            <button className="connect-btn">
              <ConnectButton />
            </button>
            <ConnectDialog />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
