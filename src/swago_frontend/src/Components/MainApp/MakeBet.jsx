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
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#1e2a3a] rounded-lg p-6">
            <h3 className="text-xl mb-4">Bet ID: {id}</h3>
            {event && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{event.name}</h2>
                <p className="text-lg">{event.question}</p>

                <div className="my-4">
                  {event.image && (
                    <img
                      src={`data:image/jpeg;base64,${arrayBufferToBase64(
                        event.image
                      )}`}
                      alt="Event"
                      className="rounded-lg max-w-full h-auto"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {event.twitter_link && (
                    <a
                      href={event.twitter_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                    >
                      <span>Twitter</span>
                    </a>
                  )}

                  {event.telegram_link && (
                    <a
                      href={event.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                    >
                      <span>Telegram</span>
                    </a>
                  )}

                  {event.website_link && (
                    <a
                      href={event.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                    >
                      <span>Website</span>
                    </a>
                  )}
                </div>

                <div className="mt-4">
                  <p>Countdown Style: {Number(event.countdown_style)}</p>
                  <p>
                    Start Time:{" "}
                    {new Date(Number(event.start_time) * 1000).toLocaleString()}
                  </p>
                  <p>
                    End Time:{" "}
                    {new Date(Number(event.end_time) * 1000).toLocaleString()}
                  </p>
                  <p>Set Time: {Number(event.set_Time)} minutes</p>
                </div>

                {/* Add betting buttons */}
                <div className="flex justify-center space-x-4 mt-6">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                    Bet Yes
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg">
                    Bet No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
