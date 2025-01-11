import * as swago_backend from "declarations/swago_backend";
import React, { useEffect } from "react";
import { Dashboard } from "./Components/MainApp/Dashboard";
import { Login } from "./Components/MainApp/Login";
import { Form } from "./Components/MainApp/Form";
import { Profile } from "./Components/MainApp/Profile";
import { MakeBet } from "./Components/MainApp/MakeBet";
import { TransactionHistory } from "./Components/MainApp/TransactionHistory";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AstroX } from "@connect2ic/core/providers/astrox";
import { PlugWallet } from "@connect2ic/core/providers/plug-wallet";
import { StoicWallet } from "@connect2ic/core/providers/stoic-wallet";

import { createClient } from "@connect2ic/core";
import { Connect2ICProvider } from "@connect2ic/react";
import { AuthProvider } from "./use-auth-client";
import Lenis from "lenis";
import "./index.css";
import "./input.css";

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 3.2,
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<Form />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/bet/:id" element={<MakeBet />} />
        </Routes>
      </Router>
    </>
  );
}

const LOCAL_HOST = "http://localhost:4943";
const IC_HOST = "https://mainnet.dfinity.network";
const isLocal = process.env.DFX_NETWORK === "local";

const client = createClient({
  canisters: {
    swago_backend,
  },
  providers: [
    new PlugWallet({
      host: isLocal ? LOCAL_HOST : IC_HOST,
      whitelist: [process.env.CANISTER_ID_SWAGO_BACKEND], // Add your canister ID
    }),
    new AstroX({
      host: isLocal ? LOCAL_HOST : IC_HOST,
      dev: isLocal,
    }),
    new StoicWallet({
      host: isLocal ? LOCAL_HOST : IC_HOST,
      dev: isLocal,
    }),
  ],
  globalProviderConfig: {
    host: isLocal ? LOCAL_HOST : IC_HOST,
  },
});

export default () => (
  <AuthProvider>
    <Connect2ICProvider client={client}>
      <App />
    </Connect2ICProvider>
  </AuthProvider>
);
