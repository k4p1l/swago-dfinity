import { MainNavbar } from "./MainNavbar";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";
import "../css/connect2ic.css";
export const Login = () => {
  return (
    <div>
      <MainNavbar />
      <div className="container">
        <h2 className="text-2xl font-bold tracking-tighter text-center sm:text-4xl">
          Login
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 mt-8 login-options">
          <label className="login-option">Web3 Wallet</label>
          <ConnectButton />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 mt-8 login-options">
          <label className="login-option">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[272px] input py-2 px-4 outline-[#3d0083] rounded-lg text-[#1a1a1a] bg-transparent border-2 border-[#1a1a1a] placeholder-[#1a1a1a]"
          />
        </div>
        <ConnectDialog />
      </div>
    </div>
  );
};
