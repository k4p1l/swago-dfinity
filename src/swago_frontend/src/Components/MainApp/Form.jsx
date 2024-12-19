import { MainNavbar } from "./MainNavbar";
import { useState } from "react";
export const Form = () => {
  const [count, setCount] = useState(200);
  const handleQuestionChange = (e) => {
    setCount(200 - e.target.value.length);
  };

  return (
    <div className="text-white bg-[#101a23]">
      <MainNavbar />
      <div className="`py-4 pb-12 ">
        <h2 className="mt-4 text-2xl font-bold tracking-tighter text-center sm:text-4xl">
          Create a New Bet
        </h2>
        <div className="flex flex-col items-center justify-center gap-4 mt-8 max-w-[1000px] mx-auto">
          <div className="flex flex-col gap-2 w-[350px] ">
            <label htmlFor="name" className="text-lg">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
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
              onChange={handleQuestionChange}
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="timing" className="text-lg">
              Set the Timing
            </label>
            <label className="flex items-center justify-between">
              5 minutes
              <input name="timing" type="radio" value="5" />
            </label>
            <label className="flex items-center justify-between">
              10 minutes
              <input name="timing" type="radio" value="10" />
            </label>
            <label className="flex items-center justify-between">
              15 minutes
              <input name="timing" type="radio" value="15" />
            </label>
          </div>

          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="image">
              Image
              <input
                className="bg-[#3e5f7c] py-2 px-2 rounded-md"
                type="file"
                id="image"
              />
            </label>
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="twitter">Twitter Link</label>
            <input
              placeholder="Optional"
              type="text"
              id="twitter"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="telegram">Telegram Link</label>
            <input
              placeholder="Optional"
              type="text"
              id="telegram"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
            />
          </div>
          <div className="flex flex-col w-[350px] gap-2">
            <label htmlFor="website">Website</label>
            <input
              placeholder="Optional"
              type="text"
              id="website"
              className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
            />
          </div>
          <button
            className="bg-[#00aeef] w-[350px] text-xl font-bold py-2 px-4 rounded-md"
            type="submit"
          >
            Create Bet
          </button>
        </div>
      </div>
    </div>
  );
};
