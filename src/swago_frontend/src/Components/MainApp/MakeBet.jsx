import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainNavbar } from "./MainNavbar";
import { getBetting } from "../../utils/actor";

export const MakeBet = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", id);
        const bettingId = BigInt(id);
        const result = await getBetting(bettingId);
        console.log("Raw event data:", result);
        setEvent(result);
      } catch (err) {
        console.error("Detailed error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Format time to MM:SS
  const formatTime = (time) => {
    time = Number(time);
    const timeInSeconds = Math.floor(time / 1000000000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  if (loading) {
    return (
      <div className="text-white bg-[#101a23] min-h-screen">
        <MainNavbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white bg-[#101a23] min-h-screen">
        <MainNavbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // Convert Uint8Array to base64 string for image display
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  return (
    <div>
      <MainNavbar />
      <div className="text-white bg-[#101a23] py-12 min-h-screen">
        <div className="flex justify-between items-center px-4 max-w-7xl mx-auto">
          <div className="flex-1">
            <div>
              {event && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-4xl font-bold">{event.name}</h2>
                  <div className="flex gap-12 items-center">
                    {event.image && (
                      <img
                        src={`data:image/jpeg;base64,${arrayBufferToBase64(
                          event.image
                        )}`}
                        alt="Event"
                        className="rounded-lg max-w-40 h-auto"
                      />
                    )}
                    <p className="text-lg">{event.question}</p>
                  </div>

                  <p>
                    Start Time:{" "}
                    {new Date(Number(event.start_time) * 1000).toLocaleString()}
                  </p>
                  <p>
                    End Time:{" "}
                    {new Date(Number(event.end_time) * 1000).toLocaleString()}
                  </p>
                  <p>
                    Yes <br />{" "}
                    <span className="text-cyan-300 text-3xl">21% chance</span>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-4">
              <p className="text-lg">
                Timer: {formatTime(event.set_Time)} minutes
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                Bet Yes
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                Bet No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
