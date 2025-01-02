import dfinity from "../../assets/images/dfinity logo 1.png";
import icp from "../../assets/images/download 1.png";
import icp_in from "../../assets/images/icp in 1.png";
import "../css/TrustedBy.css";

export const TrustedBy = () => {
  return (
    <div className="text-white bg-[#101a23] py-12 pb-40">
      <div className="container trusted-by">
        <h2 className="mb-10 text-3xl text-center">Trusted By</h2>
        <div className="flex flex-wrap items-center justify-center gap-16 images">
          <img src={dfinity} alt="dfinity logo" />
          <img src={icp} alt="icp logo" />
          <img src={icp_in} alt="icp india logo" />
        </div>
      </div>
    </div>
  );
};
