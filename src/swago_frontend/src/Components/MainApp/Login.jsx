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
      <div className="container bg-[#101a23] min-h-screen text-white">
        <div className="flex flex-col items-center justify-center gap-4 login-options">
          <h1 className="login-option font-[Inter] sm:text-4xl text-2xl tracking-tighter font-semibold mt-8">
            Sign In with your Internet Identity
          </h1>

          {isAuthenticated ? (
            <div>
              <RouterLink to="/">
                <button onClick={logout}>Logout</button>
              </RouterLink>
            </div>
          ) : (
            <RouterLink to="/">
              <button
                className="px-8 py-2 mt-8 font-semibold bg-[#2f9fff] text-[#101a23] rounded-3xl hover:bg-[#2788dc] hover:text-[#101a23] transition-all duration-200"
                onClick={login}
              >
                Login
              </button>
            </RouterLink>
          )}
        </div>
      </div>
    </div>
  );
};
