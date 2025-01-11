import { useParams } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import betImage from "../../assets/images/1330515.jpg";

export const MakeBet = () => {
  const { id } = useParams();

  return (
    <div>
      <MainNavbar />
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="container make-bet">
          <div>
            <img
              src={betImage}
              alt=""
              className="w-[300px] h-[220px] object-cover rounded-lg"
            />
          </div>
          <h3>Bet id: {id}</h3>
        </div>
      </div>
    </div>
  );
};
