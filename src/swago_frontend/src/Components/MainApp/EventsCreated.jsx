import React, { useState, useEffect } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Principal } from "@dfinity/principal";
import { swago_backend } from "../../../../declarations/swago_backend";

import { MainNavbar } from "./MainNavbar";
import { OpinionCard } from "./OpinionCard";
export const EventsCreated = () => {
  const { principalId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserEvents = async () => {
      try {
        setLoading(true);
        // Convert principalId string to Principal type
        const userPrincipal = Principal.fromText(principalId);
        console.log("Fetching events for principal:", principalId);

        // Fetch events created by this user
        const userEvents = await swago_backend.get_My_Bettings(userPrincipal);
        console.log("User events:", userEvents);
        setEvents(userEvents);
      } catch (err) {
        console.error("Error fetching user events:", err);
        setError(err.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    if (principalId) {
      fetchUserEvents();
    }
  }, [principalId]);
  return (
    <div className="text-white bg-[#101a23] min-h-screen">
      <MainNavbar />

      <div className="mt-8 mx-8">
        <RouterLink
          to="/"
          className="inline-block bg-[#2f9fff] text-white px-6 py-2 rounded-lg hover:bg-[#2680db] transition-colors font-semibold"
        >
          Back to Dashboard
        </RouterLink>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-10 text-3xl text-center">Events Created</h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">
            <p>Error: {error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-400">No events found for this user.</p>
          </div>
        ) : (
          <div
            className="grid gap-6"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              justifyItems: "center",
            }}
          >
            {events.map((event, index) => (
              <div
                className="w-fit mx-auto"
                key={event?.betting_id?.toString() ?? index}
              >
                <RouterLink to={`/bet/${event?.betting_id}`}>
                  <OpinionCard {...event} />
                </RouterLink>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
