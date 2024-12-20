import "../css/Dashboard.css";
import top from "../../assets/images/top.png";
import image from "../../assets/images/1330515.jpg";
import { MainNavbar } from "./MainNavbar";
import { CustomSlider } from "./CustomSlider";
import { OpinionCard } from "./OpinionCard";
import { RecentActivity } from "./RecentActivity";
import { TopVolumeThisWeek } from "./TopVolumeThisWeek";
import { Footer } from "../Footer";
import { TrustedBy } from "../TrustedBy";
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
  return (
    <div className="overflow-hidden dashboard-container">
      <MainNavbar />
      <div className="bg-[#101a23] pt-6">
        <CustomSlider />
        <div className="sm:py-6 sm:px-8 filters">
          <div className="flex flex-row items-center justify-between gap-4">
            <div className="sm:w-[24rem] w-[180px] search-bar">
              <input
                type="text"
                placeholder="Search token or address"
                className="w-full input py-2 px-4 outline-none rounded-lg text-[#E4E2E2] bg-[#293643] border-2 border-[#f5f5f5]"
              />
            </div>
            <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl">
              <img src={top} alt="" />
              <span className="text-white">Top</span>
            </div>
            <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl">
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
            <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl">
              <span className="text-white">24h</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="#f5f5f5"
                className="bi bi-chevron-down sm:w-[30px] w-[20px]"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"
                />
              </svg>
            </div>
            <div className="flex items-center gap-4 bg-[#354350] px-2 py-2 rounded-xl refresh">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="#f5f5f5"
                className="bi bi-arrow-clockwise sm:w-[30px] w-[24px]"
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            padding: "20px",
            backgroundColor: "#0f172a",
            minHeight: "45vh",
          }}
        >
          {cardData.map((data, index) => (
            <OpinionCard key={index} {...data} />
          ))}
        </div>
        <div className="flex items-center justify-center py-6">
          <button className="bg-[#00AEEF] text-[#E8F1F5] text-4xl px-6 py-2 rounded-md font-bold tracking-tighter text-center ">
            Show More
          </button>
        </div>
        <div className="stay-tuned gradient-border max-w-[1000px] mx-auto mt-24">
          <h2 className="text-2xl font-medium tracking-tighter text-center">
            Stay Tuned
          </h2>
          <p className="mt-2 text-xl text-center text-white/70">
            We are working hard to provide you with the best experience
            possible.
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-[62%] input py-2 px-4 outline-none rounded-lg text-[#f5f5f5] bg-transparent border-2 border-[#f5f5f5] mt-4 placeholder-white"
            />
            <div>
              <button className="px-6 py-2 font-medium text-black bg-white rounded-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-8 sm:flex-row">
          <div
            id="recent-activity"
            className="text-white bg-[#101a23] py-[72px] sm:py-24 px-4"
          >
            <h2 className="text-xl font-medium tracking-tighter sm:text-2xl">
              Recent Activity
            </h2>
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
            <RecentActivity />
          </div>
          <div className="text-white bg-[#101a23] py-[72px] sm:py-24 px-4">
            <h2 className="text-xl font-medium tracking-tighter sm:text-2xl">
              Top Volume This Week
            </h2>
            <TopVolumeThisWeek />
          </div>
        </div>
        <TrustedBy />
      </div>
      <Footer />
    </div>
  );
};
