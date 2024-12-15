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
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
