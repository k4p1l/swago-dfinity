import pfp from "../../assets/images/1330515.jpg";

export const RecentActivity = () => {
  return (
    <div className="flex max-w-xl mt-8 sm:gap-4">
      <img
        className="sm:w-[5rem] w-[3rem] object-contain rounded-sm"
        src={pfp}
        alt=""
      />
      <div className="border-[#fff] border-b-2">
        <p>
          TKZu...HKcR <span className="text-cyan-300">Bought</span> 1,059.61 TRX
          of SUNDOG
        </p>
        <p>05a4 bought No at 99c ($35.66)</p>
      </div>
    </div>
  );
};
