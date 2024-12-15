import "../css/Dashboard.css";
import logo from "../../assets/images/logo.png";

export const Dashboard = () => {
  return (
    <div className="container bg-[#1d2b39]">
      <div className="flex items-center gap-4">
        <div className="w-[6rem] ">
          <img src={logo} alt="" />
        </div>
        <div className=" search-bar">
          <input
            type="text"
            placeholder="Search token or address"
            className="w-[200%] input py-2 px-4 rounded-lg bg-[#293643] border-2 border=[#f5f5f5]"
          />
        </div>
      </div>
    </div>
  );
};
