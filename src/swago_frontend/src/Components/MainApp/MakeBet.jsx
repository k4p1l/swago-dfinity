import { useParams } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";

export const MakeBet = () => {
  const { id } = useParams();
  return (
    <div>
      <MainNavbar />
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="container make-bet">
          <h2 className="mb-10 text-3xl text-center">Make Bet</h2>
          <h3>Bet id: {id}</h3>
        </div>
      </div>
    </div>
  );
};
