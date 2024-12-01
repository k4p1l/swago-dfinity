import AppScreenshot from "../assets/images/App ss.png";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const ProductShowcase = () => {
  const appScreenshot = useRef(null);
  const { scrollYProgress } = useScroll({
    target: appScreenshot,
    offset: ["start end", "end end"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  return (
    <div
      id="product"
      className="text-white bg-black py-[72px] bg-gradient-to-b from-black to-[#4b2387] overflow-hidden"
    >
      <div className="container">
        <h2 className="text-5xl font-bold tracking-tighter text-center sm:text-6xl">
          Intuitive interface
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="mt-5 text-xl text-center text-white/70">
            Celebrate the joy of accomplishment with an app designed to track
            your progress, motivate your efforts, and celebrate your successes,
            one task at a time.
          </p>
        </div>
        <motion.div
          style={{
            opacity: opacity,
            rotateX: rotateX,
            transformPerspective: "1000px",
          }}
        >
          <img
            src={AppScreenshot}
            alt="The Product Screenshot"
            className="mt-14"
            ref={appScreenshot}
          />
        </motion.div>
      </div>
    </div>
  );
};
