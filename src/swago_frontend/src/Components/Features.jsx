import { useRef } from "react";
import { useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

const Feature = ({ title, description }) => {
  const border = useRef(null);
  const offsetX = useMotionValue(-100);
  const offsetY = useMotionValue(-100);
  const maskImage = useMotionTemplate`radial-gradient(100px 100px at ${offsetX}px ${offsetY}px, black, transparent)`;

  useEffect(() => {
    const updateMousePosition = (e) => {
      const borderRect = border.current.getBoundingClientRect();
      offsetX.set(e.x - borderRect.x);
      offsetY.set(e.y - borderRect.y);
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <div
      key={title}
      className="relative px-5 py-10 text-center border border-white/30 rounded-xl sm:flex-1"
    >
      <motion.div
        className="absolute inset-[-1px] border-2 border-purple-500 rounded-xl"
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
        ref={border}
      ></motion.div>
      {/* <div className="inline-flex text-black bg-white h-14 w-14"></div> */}
      <h3 className="mt-6 font-bold">{title}</h3>
      <p className="mt-2 text-white/70">{description}</p>
    </div>
  );
};

const features = [
  {
    title: "Integration ecosystem",
    description:
      "Enhance your productivity by connecting with your favorite tools, keeping all your essentials in one place.",
  },
  {
    title: "Goal setting and tracking",
    description:
      "Define and track your goals, breaking down objectives into achievable tasks to keep your targets in sight.",
  },
  {
    title: "Secure data encryption",
    description:
      "With end-to-end encryption, your data is securely stored and protected from unauthorized access.",
  },
];

export const Features = () => {
  return (
    <div id="features" className="text-white bg-black py-[72px] sm:py-24">
      <div className="container">
        <h2 className="text-5xl font-bold tracking-tighter text-center sm:text-6xl">
          Everything you need
        </h2>
        <div className="max-w-xl mx-auto">
          <p className="mt-5 text-xl text-center text-white/70">
            Enjoy customizable lists, team work tools, and smart tracking all in
            one place. Set tasks, get reminders, and see your progress simply
            and quickly.
          </p>
        </div>
        <div className="flex flex-col gap-4 mt-16 sm:flex-row">
          {features.map(({ title, description }) => (
            <Feature title={title} description={description} key={title} />
          ))}
        </div>
      </div>
    </div>
  );
};
