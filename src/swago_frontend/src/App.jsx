import * as swago_backend from "declarations/swago_backend";
import React, { useEffect } from "react";
import { Dashboard } from "./Components/MainApp/Dashboard";
import { Login } from "./Components/MainApp/Login";
import { Form } from "./Components/MainApp/Form";
import { Profile } from "./Components/MainApp/Profile";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { defaultProviders } from "@connect2ic/core/providers";
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
        </Routes>
      </Router>
    </>
  );
}

const client = createClient({
  canisters: {
    swago_backend,
  },
  providers: defaultProviders,
});

export default () => (
  <AuthProvider>
    <Connect2ICProvider client={client}>
      <App />
    </Connect2ICProvider>
  </AuthProvider>
);
