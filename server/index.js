import WebSocket from "ws";
import express from "express";
import http from "http";
import cors from "cors";
import fetch from "node-fetch";
import cron from "node-cron";
import { v4 as uuidv4 } from "uuid";
``
const BACKEND_URL =
  "http://127.0.0.1:4943/?canisterId=br5f7-7uaaa-aaaaa-qaaca-cai&id=bd3sg-teaaa-aaaaa-qaaba-cai";
const WS_URL = "wss://pumpportal.fun/api/data";
const app = express();
const server = http.createServer(app);

let latestData = []; // Store the most recent trade data

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Initialize WebSocket
const ws = new WebSocket(WS_URL);
const events = {};

ws.on("open", () => {
  console.log("WebSocket connected");
  const payload = { method: "subscribeNewToken" };
  ws.send(JSON.stringify(payload));
  console.log("Subscribed to token trades");
});

ws.on("message", (data) => {
  const message = data.toString("utf-8"); // Convert buffer to string
  try {
    const parsedData = JSON.parse(message);
    const trade = {
      name: parsedData.name,
      symbol: parsedData.symbol,
      marketCapSol: parsedData.marketCapSol,
      solAmount: parsedData.solAmount,
      uri: parsedData.uri,
    };

    // Store latest data
    latestData.push(trade);
    if (latestData.length > 100) latestData.shift(); // Keep the latest 100 messages

    console.log("Updated latest data:", latestData);
  } catch (err) {
    console.error("Error parsing WebSocket message:", err);
  }
});

ws.on("error", (err) => console.error("WebSocket error:", err));
ws.on("close", () => console.log("WebSocket connection closed."));

// API Endpoint to fetch trades
app.get("/api/trades", (req, res) => {
  res.json(latestData);
});

// API to create an event
app.post("/api/add_Betting", (req, res) => {
  const { user_principal, name, question, set_Time, fixedValue } = req.body;

  // Validate input
  if (!user_principal || !name || !question || !set_Time || !fixedValue) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Add betting logic here (e.g., save to database or in-memory store)
  const eventId = uuidv4(); // Generate unique event ID
  events[eventId] = {
    user_principal,
    name,
    question,
    set_Time,
    fixedValue,
    resolved: false,
    outcome: null,
  };

  res.status(201).json({
    message: "Event created successfully.",
    eventId,
  });
});

// API to fetch unresolved events
app.get("/api/unresolved_events", async (req, res) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/unresolved_events`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch unresolved events.");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching unresolved events:", error);
    res.status(500).json({ message: "Failed to fetch unresolved events." });
  }
});

// API to resolve an event
app.post("/api/result_func", async (req, res) => {
  const { betting_id, outcome, won_amount, principal } = req.body;

  if (!betting_id || !outcome || !won_amount || !principal) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/result_func`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        betting_id,
        win_or_loose: outcome,
        won_amount,
        prin: principal,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to resolve event in the backend.");
    }

    const data = await response.json();
    res.json({ message: "Event resolved successfully.", result: data });
  } catch (error) {
    console.error("Error resolving event:", error);
    res.status(500).json({ message: "Failed to resolve event." });
  }
});
// predict
app.get("/api/predict/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const response = await fetch(`${BACKEND_URL}/api/get_events_by_id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ betting_id: eventId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch event details.");
    }

    const data = await response.json();
    if (!data) {
      return res.status(404).json({ message: "Event not found." });
    }

    const { set_Time, fixedValue, marketCapSol } = data;
    if (Date.now() < set_Time) {
      return res.json({ result: null, message: "Event not resolved yet." });
    }

    const outcome = marketCapSol >= fixedValue ? "Yes" : "No";
    res.json({ result: outcome });
  } catch (error) {
    console.error("Error fetching event prediction:", error);
    res.status(500).json({ message: "Failed to fetch event prediction." });
  }
});

// Api vote
app.post("/api/vote", async (req, res) => {
  const { principal, event_id, yes_or_no, amount } = req.body;

  try {
    const response = await fetch(`${BACKEND_URL}/api/Yes_or_no_fun`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ principal, event_id, yes_or_no, amount }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit vote.");
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ message: "Failed to submit vote." });
  }
});

// Cron job to resolve events periodically
cron.schedule("* * * * *", async () => {
  console.log("Running cron job to resolve events...");

  try {
    const unresolvedResponse = await fetch(
      `${BACKEND_URL}/api/unresolved_events`
    );
    const unresolvedEvents = await unresolvedResponse.json();

    for (const event of unresolvedEvents) {
      if (Date.now() >= event.set_Time) {
        const coinData = latestData.find(
          (coin) => coin.symbol === event.symbol
        );
        if (coinData) {
          const outcome =
            coinData.marketCapSol >= event.fixedValue ? "winner" : "loser";

          await fetch(`${BACKEND_URL}/api/result_func`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              betting_id: event.betting_id,
              win_or_loose: outcome,
              won_amount: 1000, // Example value
              prin: event.user_principal,
            }),
          });

          console.log(
            `Resolved event: ${event.betting_id} with outcome: ${outcome}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

// Start the server
server.listen(3001, () => {
  console.log("Proxy server running on http://localhost:3001");
});
