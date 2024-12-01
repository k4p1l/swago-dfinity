import dfinity from "../assets/images/dfinity logo 1.png";
import icp from "../assets/images/download 1.png";
import icp_in from "../assets/images/icp in 1.png";
import "./css/TrustedBy.css";

export const TrustedBy = () => {
  return (
    <div className="text-white bg-black py-[20px] ">
      <div className="container trusted-by">
        <h2 className="text-xl text-center">Trusted By</h2>
        <div className="flex flex-wrap items-center justify-center gap-16 images">
          <img src={dfinity} alt="dfinity logo" />
          <img src={icp} alt="icp logo" />
          <img src={icp_in} alt="icp india logo" />
        </div>
      </div>
    </div>
  );
};
