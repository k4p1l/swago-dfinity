import { MainNavbar } from "./MainNavbar";
import { useState } from "react";

import { swago_backend } from "../../../../declarations/swago_backend";

export const Form = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [timing, setTiming] = useState("5");
  const [image, setImage] = useState(null);
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [countdownStyle, setCountdownStyle] = useState("minimilist");
  const [count, setCount] = useState(200);

  const handleQuestionChange = (e) => {
    const input = e.target.value;
    setQuestion(input);
    setCount(200 - input.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !email ||
      !question ||
      !question ||
      !countdownStyle ||
      !website ||
      !image
    ) {
      alert("Please fill out all required fields.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageBlob = new Uint8Array(reader.result);

      const bettingData = {
        mail: email,
        name: name,
        question: question,
        set_timing: BigInt(timing),
        image: imageBlob,
        twitter_link: twitter,
        telegram_link: telegram,
        website_link: website,
        countdown_style: BigInt(
          countdownStyle === "minimilist"
            ? 1
            : countdownStyle === "flipClock"
            ? 2
            : 3
        ),
      };

      try {
        const result = await swago_backend.add_Betting(bettingData);
        alert(result);
      } catch (error) {
        console.error("Error creating bet:", error);
        alert("Failed to create bet.");
      }
    };
    reader.readAsArrayBuffer(image);
  };

  return (
    <div className="text-white bg-[#101a23]">
      <MainNavbar />
      <div className="`py-4 pb-12 ">
        <h2 className="mt-4 text-2xl font-bold tracking-tighter text-center sm:text-4xl">
          Create a New Bet
        </h2>
        <form
          className="flex flex-col items-center justify-center gap-4 mt-8 max-w-[1000px] mx-auto"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2 w-[350px] ">
            <label htmlFor="name" className="text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 w-[350px] ">
            <label htmlFor="email" className="text-lg">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className=" w-[350px] flex flex-col gap-2">
            <div className="flex justify-between">
              <label htmlFor="question" className="text-lg">
                Question
              </label>
              <p>{count}</p>
            </div>

            <input
              maxLength={200}
              type="text"
              id="question"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={question}
              onChange={handleQuestionChange}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="timing" className="text-lg">
              Set the Timing
            </label>
            <label className="flex items-center justify-between">
              5 minutes
              <input
                name="timing"
                type="radio"
                value="5"
                checked={timing === "5"}
                onChange={(e) => setTiming(e.target.value)}
              />
            </label>
            <label className="flex items-center justify-between">
              10 minutes
              <input
                name="timing"
                type="radio"
                value="10"
                checked={timing === "10"}
                onChange={(e) => setTiming(e.target.value)}
              />
            </label>
            <label className="flex items-center justify-between">
              15 minutes
              <input
                name="timing"
                type="radio"
                value="15"
                checked={timing === "15"}
                onChange={(e) => setTiming(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="image">
              Image
              <input
                className="bg-[#3e5f7c] py-2 px-2 rounded-md"
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="website">Website</label>
            <input
              placeholder="Mandatory"
              type="text"
              id="website"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="twitter">Twitter Link</label>
            <input
              placeholder="Optional"
              type="text"
              id="twitter"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="telegram">Telegram Link</label>
            <input
              placeholder="Optional"
              type="text"
              id="telegram"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
            />
          </div>

          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="countdownStyle" className="text-lg">
              Countdown Style
            </label>
            <label className="flex items-center justify-between">
              Minimilist
              <input
                name="countdownStyle"
                type="radio"
                value="minimilist"
                checked={countdownStyle === "minimilist"}
                onChange={(e) => setCountdownStyle(e.target.value)}
              />
            </label>
            <label className="flex items-center justify-between">
              Flip Clock
              <input
                name="countdownStyle"
                type="radio"
                value="flipClock"
                checked={countdownStyle === "flipClock"}
                onChange={(e) => setCountdownStyle(e.target.value)}
              />
            </label>
            <label className="flex items-center justify-between">
              Circular Timer
              <input
                name="countdownStyle"
                type="radio"
                value="circular"
                checked={countdownStyle === "circular"}
                onChange={(e) => setCountdownStyle(e.target.value)}
              />
            </label>
          </div>

          <button
            className="bg-[#00aeef] w-[350px] text-xl font-bold py-2 px-4 rounded-md"
            type="submit"
          >
            Create Bet
          </button>
        </form>
      </div>
    </div>
  );
};
