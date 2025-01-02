import { MainNavbar } from "./MainNavbar";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";
import "../css/connect2ic.css";
import { useAuth } from "../../use-auth-client";
import { Link as RouterLink } from "react-router-dom";

export const Login = () => {
  const { isAuthenticated, identity, login, logout } = useAuth();
  return (
    <div>
      <MainNavbar />
      <div className="container">
        <h2 className="text-2xl font-bold tracking-tighter text-center sm:text-4xl">
          Login
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 mt-8 login-options">
          <label className="login-option">Web3 Wallet</label>

          {isAuthenticated ? (
            <RouterLink to="/">
              <button onClick={logout}>Logout</button>
            </RouterLink>
          ) : (
            <RouterLink to="/">
              <button onClick={login}>Login</button>
            </RouterLink>
          )}

          {/* <ConnectButton /> */}
        </div>
        {/* <ConnectDialog /> */}
      </div>
    </div>
  );
};
