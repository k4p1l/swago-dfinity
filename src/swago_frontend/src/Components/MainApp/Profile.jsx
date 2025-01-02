import { MainNavbar } from "./MainNavbar";
import pfp from "../../assets/images/1330515.jpg";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
export const Profile = () => {
  // const { isConnected, disconnect, principal } = useConnect();
  const { principal, identity } = useAuth();

  return (
    <div className="w-full min-h-screen text-white bg-[#101a23]">
      <MainNavbar />
      <div className="">
        <div className="flex items-center mt-12 px-12 gap-20">
          <img
            src={pfp}
            alt=""
            className="w-[300px] h-[300px] object-cover rounded-full"
          />
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-semibold mt-2">Yogita</h1>
            <p className="text-[#c1c1c1] bg-[#354A63] px-4 py-2 rounded-3xl">
              {principal ? principal.toText() : "No Principal"}
            </p>
          </div>
          <button className="px-8 py-2 border-2 rounded-3xl border-[#ffffff]">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
