import "../css/Dashboard.css";
import top from "../../assets/images/top.png";
import image from "../../assets/images/1330515.jpg";
import { MainNavbar } from "./MainNavbar";
import { CustomSlider } from "./CustomSlider";
import { OpinionCard } from "./OpinionCard";
import { RecentActivity } from "./RecentActivity";
import { Footer } from "../Footer";
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
    <div className="dashboard-container">
      <MainNavbar />
      <div className="bg-[#101a23]">
        <div className="flex items-center justify-center gap-20 px-8 py-6">
          <div className="bg-[#3195ff] px-8 py-2 rounded-lg">
            TK2n...CBAQ Sold1,273.8{" "}
            <span className="text-[#e5ff00]">TRX of UNWUKONG</span>
          </div>
          <div className="bg-[#ff56b9] px-8 py-2 rounded-lg">
            TKZu...HKcR{" "}
            <span className="text-[#e5ff00]">Sold 1,121.9 TRX of UNDOG</span>
          </div>
        </div>
        <CustomSlider />
        <div className="px-8 py-6 filters">
          <div className="flex items-center justify-between gap-4">
            <div className="w-[24rem] search-bar">
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
              <ion-icon name="filter-sharp"></ion-icon>
              <span className="text-white">Filters</span>
            </div>
            <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl">
              <span className="text-white">24h</span>
              <ion-icon name="chevron-down-sharp"></ion-icon>
            </div>
            <div className="flex items-center gap-4 bg-[#354350] px-4 py-2 rounded-xl refresh">
              <ion-icon name="refresh-sharp"></ion-icon>
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
        <div>
          <RecentActivity />
        </div>
      </div>
      <Footer />
    </div>
  );
};
