export const Hero = () => {
  return (
    <div className="text-white bg-black  py-[72px] sm:py-24 relative overflow-clip hero">
      <div className="absolute h-[375px] w-[750px] rounded-[100%] bg-black left-1/2 -translate-x-1/2 border-[#b48cde]  top-[calc(100%-96px)] sm:w-[3000px] sm:h-[720px] sm:top-[calc(100%-120px)] ellipse"></div>
      <div className="container relative">
        <div className="flex items-center justify-center">
          <a
            href="#"
            className="inline-flex gap-4 px-2 py-1 border rounded-lg border-white/30"
          >
            <span className="text-transparent  bg-clip-text [-webkit-background-clip:text] rainbow-text animated-gradient">
              Version 2.0 is here
            </span>
            <span className="inline-flex items-center gap-1">
              Read More <ion-icon name="arrow-forward-sharp"></ion-icon>
            </span>
          </a>
        </div>
        <h1 className="mt-8 font-bold tracking-tighter text-center text-7xl">
          One Task at a Time
        </h1>
        <p className="mt-8 text-xl text-center">
          Celebrate the joy of accomplishment with an app designed to track your
          progress, motivate your efforts, and celebrate your successes.
        </p>
        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 font-medium text-black bg-white rounded-lg">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
