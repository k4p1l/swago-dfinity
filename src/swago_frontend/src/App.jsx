import * as swago_backend from "declarations/swago_backend";
import React, { useEffect } from "react";
import { Banner } from "./Components/Banner";
import { Navbar } from "./Components/Navbar";
import { Hero } from "./Components/Hero";
import { TrustedBy } from "./Components/TrustedBy";
import { Features } from "./Components/Features";
import { ProductShowcase } from "./Components/ProductShowcase";
import { FAQs } from "./Components/FAQs";
import { Footer } from "./Components/Footer";
import { Dashboard } from "./Components/MainApp/Dashboard";
import { Login } from "./Components/MainApp/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { defaultProviders } from "@connect2ic/core/providers";
import { createClient } from "@connect2ic/core";
import { Connect2ICProvider } from "@connect2ic/react";
import Lenis from "lenis";
import "./index.css";
import "./input.css";

function LandingPage() {
  return (
    <div>
      <Banner />
      <Navbar />
      <Hero />
      <TrustedBy />
      <Features />
      <ProductShowcase />
      <FAQs />
      <Footer />
    </div>
  );
}

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
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
);
