import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Slider.css";
import logo from "../../assets/images/logo.png";

export const CustomSlider = () => {
  const settings = {
    dots: true, // Hide bottom dots
    infinite: true, // Infinite looping
    speed: 500, // Transition speed
    slidesToShow: 1, // Show 1 slide at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
    arrows: true, // Show navigation arrows
    autoplay: true, // Auto-play slides
    autoplaySpeed: 5000, // Delay between transitions
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {/* Slide 1 */}
        <div className="slide">
          <div className="content">
            <div className="image-section">
              <img className="w-[20vh]" src={logo} alt="Logo" />
            </div>
            <div className="text-section">
              <h2 className="text-[#FFEA00] text-4xl py-4">[ Start a New Bit ]</h2>
              <p className="text-xl ">
                Where Memes Meet Money.{" "}
                <a className="text-[#6bceff]" href="/how-it-works">How it works?</a>
              </p>
              <button className="start-button">Start</button>
            </div>
          </div>
        </div>
        {/* Slide 2 */}
        <div className="slide">
          <div className="content">
            <h2>Another Slide</h2>
            <p>Custom content goes here.</p>
          </div>
        </div>
      </Slider>
    </div>
  );
};
