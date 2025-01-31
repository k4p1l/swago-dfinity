import WebSocket from "ws";
import express from "express";
import http from "http";
import cors from "cors";
// import fetch from "node-fetch";
// import cron from "node-cron";
// import { v4 as uuidv4 } from "uuid";

// const BACKEND_URL = "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=o5777-ciaaa-aaaam-adywq-cai";
const WS_URL = "wss://pumpportal.fun/api/data";
const app = express();
const server = http.createServer(app);

let latestData = []; // Store the most recent trade data
// Enable CORS for all origins
app.use(cors());
app.use(express.json());

function connectWebSocket() {
  const ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log("WebSocket connected");

    // Define subscriptions
    const subscriptions = [
      { method: "subscribeNewToken" },
      {
        method: "subscribeAccountTrade",
        keys: ["AArPXm8JatJiuyEffuC1un2Sc835SULa4uQqDcaGpAjV"],
      },
      {
        method: "subscribeTokenTrade",
        keys: ["91WNez8D22NwBssQbkzjy4s2ipFrzpmn5hfvWVe2aY5p"],
      },
    ];

    // Send subscriptions when WebSocket is ready
    subscriptions.forEach((payload) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        console.log(`Sent subscription: ${payload.method}`);
      } else {
        console.error(`WebSocket not open for ${payload.method}`);
      }
    });
  });

  ws.on("message", (data) => {
    try {
      const parsedData = JSON.parse(data);

      // Check if the required fields exist
      if (
        parsedData.signature &&
        parsedData.mint &&
        parsedData.traderPublicKey &&
        parsedData.txType &&
        parsedData.initialBuy &&
        parsedData.solAmount &&
        parsedData.bondingCurveKey &&
        parsedData.vTokensInBondingCurve &&
        parsedData.vSolInBondingCurve &&
        parsedData.marketCapSol &&
        parsedData.name &&
        parsedData.symbol &&
        parsedData.uri &&
        parsedData.pool
      ) {
        // Store the complete trade data
        const trade = {
          signature: parsedData.signature,
          mint: parsedData.mint,
          traderPublicKey: parsedData.traderPublicKey,
          txType: parsedData.txType,
          initialBuy: parsedData.initialBuy,
          solAmount: parsedData.solAmount,
          bondingCurveKey: parsedData.bondingCurveKey,
          vTokensInBondingCurve: parsedData.vTokensInBondingCurve,
          vSolInBondingCurve: parsedData.vSolInBondingCurve,
          marketCapSol: parsedData.marketCapSol,
          name: parsedData.name,
          symbol: parsedData.symbol,
          uri: parsedData.uri,
          pool: parsedData.pool,
          timestamp: new Date().toISOString(),
        };

        latestData.push(trade);
        if (latestData.length > 100) latestData.shift(); // Keep only the latest 100 messages

        console.log("Updated latest data:", latestData);
      } else {
        console.warn("⚠️ Incomplete trade data received:", parsedData);
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    console.log(" WebSocket connection closed. Reconnecting in 5 seconds...");
    setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    ws.close();
  });

  return ws;
}

// Start WebSocket connection
const ws = connectWebSocket();

// Start the server
server.listen(3001, () => {
  console.log("Proxy server running on http://localhost:3001");
});
