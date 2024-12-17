import pfp from "../../assets/images/1330515.jpg";

export const RecentActivity = () => {
  return (
    <div className="flex max-w-xl gap-4 mt-8">
      <img className="w-[5rem] object-contain rounded-sm" src={pfp} alt="" />
      <div>
        <p>
          TKZu...HKcR <span className="text-cyan-300">Bought</span> 1,059.61 TRX
          of SUNDOG
        </p>
        <p>05a4 bought No at 99c ($35.66)</p>
      </div>
    </div>
  );
};
