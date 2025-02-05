import { MainNavbar } from "./MainNavbar";
import { Principal } from "@dfinity/principal";
import { useConnect } from "@connect2ic/react";
import { useAuth } from "../../use-auth-client";
import { ConnectButton, ConnectDialog } from "@connect2ic/react";
import { swago_backend } from "../../../../declarations/swago_backend";
import { WalletStatus } from "./WalletStatus";
import { Link as RouterLink } from "react-router-dom";
import { DialogModal } from "./DialogModal";
import React, { useState, useEffect } from "react";
const BACKEND_URL = "http://localhost:3001";
import { initializeMoralis } from "../../../moralisConfig";
import Moralis from "moralis";
import { useNavigate } from "react-router-dom";

export const Form = () => {
  const { isConnected, principal, activeProvider } = useConnect();
  const { isAuthenticated, identity, login, logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    question: "",
    timing: "5",
    image: null,
    website: "",
    coin_nm: "",
    coin_market_sol: 0,
    twitter: "",
    telegram: "",
    countdownStyle: "minimilist",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(120);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [coins, setCoins] = useState([]);
  const [marketPrice, setMarketPrice] = useState(null);
  const [coin_mint, setCoinMint] = useState(null);
  const [marketPriceLoading, setMarketPriceLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initializeMoralis(); // Ensure Moralis initializes once
  }, []);

  // Fetch coins from the proxy server
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/trades`);
        if (!response.ok) throw new Error("Failed to fetch coins");

        const data = await response.json();
        if (!data.trades || !Array.isArray(data.trades)) {
          throw new Error("Invalid API response format");
        }
        console.log("Raw coin data:", data.trades);
        const uniqueCoins = data.trades.filter(
          (coin, index, self) =>
            index === self.findIndex((c) => c.symbol === coin.symbol)
        );
        setCoins(uniqueCoins);
        console.log("Coins fetched:", uniqueCoins);
      } catch (err) {
        console.error("Error fetching coins:", err);
        setError("Unable to load coins. Please try again later.");
      }
    };

    fetchCoins();
  }, []);

  // Fetch token price using Moralis API
  const fetchMarketPrice = async (mint) => {
    if (!mint) return null;
    setMarketPriceLoading(true);

    try {
      console.log(`🔍 Fetching price for mint: ${mint}`);

      const response = await Moralis.SolApi.token.getTokenPrice({
        network: "mainnet",
        address: mint,
      });

      console.log("📊 Full API Response:", response);

      if (response?.jsonResponse?.nativePrice?.value) {
        const nativeValue = response.jsonResponse.nativePrice.value;
        const marketCap = parseFloat(nativeValue);
        console.log("Parsed Market Cap:", marketCap);
        return marketCap;
      }
      return null;
    } catch (e) {
      console.error("Error fetching token price:", e);
      return null;
    } finally {
      setMarketPriceLoading(false);
    }
  };
  useEffect(() => {
    console.log("UI Updated - Market Price:", marketPrice);
  }, [marketPrice]);

  useEffect(() => {
    if (marketPrice !== null && !marketPriceLoading) {
      setFormData((prev) => ({
        ...prev,
        coin_market_sol: marketPrice,
      }));
    }
  }, [marketPrice, marketPriceLoading]);

  const handleChange = async (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else if (name === "question") {
      setCount(120 - value.length);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else if (name === "coin_nm") {
      // Find the selected coin and its market cap
      const selectedCoin = coins.find((coin) => coin.symbol === value);
      console.log("Selected coin:", selectedCoin);
      if (selectedCoin) {
        setCoinMint(selectedCoin.mint);
        // First update the form with selected coin
        setFormData((prev) => ({
          ...prev,
          coin_nm: selectedCoin.symbol,
          coin_market_sol: 0, // Set to 0 initially
        }));
        // Then fetch and update the market price
        const price = await fetchMarketPrice(selectedCoin.mint);
        if (price !== null) {
          setMarketPrice(price);
          setFormData((prev) => ({
            ...prev,
            coin_market_sol: price,
          }));
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.coin_nm) {
        throw new Error("Please select a coin");
      }

      if (marketPriceLoading) {
        throw new Error("Please wait for market price to load");
      }

      if (!formData.coin_market_sol || formData.coin_market_sol === 0) {
        // Try to fetch price one more time
        const selectedCoin = coins.find(
          (coin) => coin.symbol === formData.coin_nm
        );
        if (selectedCoin) {
          const price = await fetchMarketPrice(selectedCoin.mint);
          if (price) {
            formData.coin_market_sol = price;
          } else {
            throw new Error("Failed to get market price. Please try again.");
          }
        }
      }

      const requiredFields = ["name", "email", "website", "image"];
      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Please fill out: ${missingFields.join(", ")}`);
      }

      // Convert image to blob
      const imageBlob = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(new Uint8Array(reader.result));
        reader.onerror = reject;
        reader.readAsArrayBuffer(formData.image);
      });

      const timeInNanos =
        BigInt(formData.timing) * BigInt(60) * BigInt(1_000_000_000);

      const generatedQuestion = `Will the market cap of ${formData.coin_nm} ${formData.direction} in the next ${formData.timing} minutes?`;
      console.log("market cap", formData.coin_market_sol);
      // Prepare betting data
      const bettingData = {
        user_principal: Principal.fromText(principal),
        mail: formData.email,
        name: formData.name,
        question: generatedQuestion,
        set_Time: timeInNanos,
        image: imageBlob,
        twitter_link: formData.twitter,
        telegram_link: formData.telegram,
        website_link: formData.website,
        coin_nm: formData.coin_nm,
        coin_mint: coin_mint,
        coin_market_sol: formData.coin_market_sol,
        countdown_style: BigInt(
          formData.countdownStyle === "minimilist"
            ? 1
            : formData.countdownStyle === "flipClock"
            ? 2
            : 3
        ),
      };

      const result = await swago_backend.add_Betting(bettingData);

      setShowSuccessDialog(true);
      setCoinMint(null);
      setFormData({
        name: "",
        email: "",
        question: "",
        timing: "5",
        image: null,
        website: "",
        twitter: "",
        telegram: "",
        coin_nm: "",
        coin_market_sol: 0,
        countdownStyle: "minimilist",
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating bet:", err);
      setError(err.message || "Failed to create bet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white bg-[#101a23]">
      <MainNavbar />
      <WalletStatus />
      <DialogModal
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        message="Market created successfully!"
      />
      {!isAuthenticated ? (
        <div className="h-screen flex justify-center mt-28">
          <div className="flex flex-col items-center gap-4">
            <p>Please login with Internet Identity first.</p>
            <button
              onClick={login}
              className="bg-[#00aeef] px-6 py-2 rounded-md font-semibold"
            >
              Login with Internet Identity
            </button>
          </div>
        </div>
      ) : !isConnected ? (
        <div className="h-screen flex justify-center mt-28">
          <div className="flex flex-col items-center gap-4">
            Please connect your wallet before creating a new market.
            <ConnectButton /> <ConnectDialog />
          </div>
        </div>
      ) : (
        <div className="`py-4 pb-12 ">
          <RouterLink
            to="/"
            className="text-[#0a0a0a] bg-[#f0e6ff] ml-4 px-4 py-2 font-semibold rounded-md"
          >
            Back to Home
          </RouterLink>
          <h2 className="mt-4 text-2xl font-bold tracking-tighter text-center sm:text-4xl">
            Create a New Market
          </h2>
          {error && (
            <div className="bg-red-500/20 border border-red-500 p-4 mb-6 rounded">
              {error}
            </div>
          )}
          <form
            className="flex flex-col items-center justify-center gap-4 mt-8 max-w-[400px] mx-auto border-2 border-[#fff] rounded-xl py-4"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2 w-[350px] ">
              <label htmlFor="name" className="text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2 w-[350px] ">
              <label htmlFor="email" className="text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="coin_nm" className="text-lg">
                Coin Name
              </label>
              <select
                name="coin_nm"
                value={formData.coin_nm}
                onChange={handleChange}
                className="bg-[#1a2632] border-2 border-[#fff] rounded-md p-2 outline-none"
              >
                <option value="">-- Select a Coin --</option>
                {coins.map((coin) => (
                  <option key={coin.symbol} value={coin.symbol}>
                    {coin.name} ({coin.symbol})
                  </option>
                ))}
              </select>
              {marketPrice !== null && (
                <div className="text-sm text-gray-400 mt-1">
                  {marketPriceLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-blue-500"></div>
                      Loading market cap...
                    </div>
                  ) : (
                    <>Market Cap: {marketPrice} SOL</>
                  )}
                </div>
              )}
            </div>

            {/* <div className=" w-[350px] flex flex-col gap-2">
              <div className="flex justify-between">
                <label htmlFor="question" className="text-lg">
                  Question
                </label>
                <p>{count}</p>
              </div>
              <input
                maxLength={120}
                type="text"
                name="question"
                id="question"
                className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
                value={formData.question}
                onChange={handleChange}
              />
            </div> */}

            <div className="w-[350px] flex flex-col gap-2">
              <label className="text-lg">Market Direction</label>
              <div className="flex gap-4 bg-[#1a2632] p-4 rounded-lg">
                <label className="flex-1">
                  <input
                    type="radio"
                    name="direction"
                    value="increase"
                    checked={formData.direction === "increase"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`
        p-3 rounded-lg text-center cursor-pointer transition-all
        ${
          formData.direction === "increase"
            ? "bg-green-500 text-white"
            : "bg-[#354A63] text-gray-300 hover:bg-[#455B7A]"
        }
      `}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      Increase
                    </span>
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="direction"
                    value="decrease"
                    checked={formData.direction === "decrease"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <div
                    className={`
        p-3 rounded-lg text-center cursor-pointer transition-all
        ${
          formData.direction === "decrease"
            ? "bg-red-500 text-white"
            : "bg-[#354A63] text-gray-300 hover:bg-[#455B7A]"
        }
      `}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                      Decrease
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {formData.coin_nm && (
              <div className="w-[350px] p-4 bg-[#1a2632] rounded-lg border border-[#354A63]">
                <p className="text-lg font-medium">Question Preview:</p>
                <p className="mt-2 text-gray-300">
                  Will the market cap of{" "}
                  {coins.find((coin) => coin.symbol === formData.coin_nm)?.name}{" "}
                  {formData.direction} in the next {formData.timing} minutes?
                </p>
              </div>
            )}

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="website" className="text-lg">
                Website
              </label>
              <select
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="bg-[#1a2632] border-2 border-[#fff] rounded-md p-2 outline-none"
              >
                <option className="" value="">
                  Select Website
                </option>
                <option value="pump.fun">pump.fun</option>
                <option value="sunpump.meme">sunpump.meme</option>
              </select>
            </div>

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="timing" className="text-lg">
                Set the Timing
              </label>
              <select
                name="timing"
                value={formData.timing}
                onChange={handleChange}
                className="bg-[#1a2632] border-2 border-[#fff] rounded-md p-2 outline-none"
              >
                <option value="3">3 minutes</option>
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
              </select>
            </div>

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="image">
                Image
                <p className="text-xs text-gray-400 mb-2">
                  *Image should be less than 2MB.
                </p>
                <input
                  className="bg-[#3e5f7c] py-2 px-2 rounded-md"
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="twitter">Twitter Link</label>
              <input
                placeholder="Optional"
                type="text"
                id="twitter"
                name="twitter"
                className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-[350px] gap-2">
              <label htmlFor="telegram">Telegram Link</label>
              <input
                placeholder="Optional"
                type="text"
                id="telegram"
                name="telegram"
                className="bg-transparent border-2 border-[#fff] rounded-md outline-none px-2 py-1"
                value={formData.telegram}
                onChange={handleChange}
              />
            </div>

            <button
              className={`w-[350px] text-xl font-bold py-2 px-4 rounded-md ${
                loading || marketPriceLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#00aeef] hover:bg-[#0096ce]"
              }`}
              type="submit"
              disabled={loading || marketPriceLoading}
            >
              {loading
                ? "Creating..."
                : marketPriceLoading
                ? "Loading Market Price..."
                : "Create Market"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
