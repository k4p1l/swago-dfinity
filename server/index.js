import WebSocket from "ws";
import express from "express";
import http from "http";
import cors from "cors";
import Moralis from "moralis";

const WS_URL = "wss://pumpportal.fun/api/data";
const app = express();
const server = http.createServer(app);

let Data = []; // Store all trade data

app.use(cors());
app.use(express.json());

// REST API to fetch all trade data
app.get("/api/trades", (req, res) => {
  res.json({ trades: Data });
});

async function get_data(mint) {
  try {
    await Moralis.start({
      apiKey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjNmNDFhZDU4LWI4ZmYtNDIxYS04Y2IwLTFiZmZlY2U4MDQ3ZCIsIm9yZ0lkIjoiNDI4MzE3IiwidXNlcklkIjoiNDQwNTc4IiwidHlwZUlkIjoiYmU3NTk5NTUtZDI2ZC00YzU5LWJlMzAtMTA3MjU1YWY5OTk3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzgyNDcwNDcsImV4cCI6NDg5NDAwNzA0N30.tufyzaZ1NCvarrwOVv1w0bj-s2MB7rhGN63S0Zr3aJI",
    });

    const response = await Moralis.SolApi.token.getTokenPrice({
      network: "mainnet",
      address: mint,
    });

    console.log(response.raw);
  } catch (e) {
    console.error(e);
  }
}

function connectWebSocket() {
  let ws = new WebSocket(WS_URL);

  ws.on("open", () => {
    console.log(" WebSocket connected successfully");

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

    subscriptions.forEach((payload) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        console.log(`📩 Subscribed to: ${payload.method}`);
      }
    });
  });

  ws.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data);

      if (
        parsedData.signature &&
        parsedData.mint &&
        parsedData.traderPublicKey &&
        parsedData.txType &&
        parsedData.name &&
        parsedData.symbol &&
        parsedData.uri &&
        parsedData.pool
      ) {
        let pricePerToken = null;
        if (parsedData.vTokensInBondingCurve > 0) {
          pricePerToken = (
            parsedData.vSolInBondingCurve / parsedData.vTokensInBondingCurve
          ).toFixed(9);
        }

        let totalCost = pricePerToken
          ? (pricePerToken * parsedData.vTokensInBondingCurve).toFixed(9)
          : null;

        const trade = {
          signature: parsedData.signature,
          mint: parsedData.mint,
          traderPublicKey: parsedData.traderPublicKey,
          txType: parsedData.txType,
          name: parsedData.name,
          symbol: parsedData.symbol,
          uri: parsedData.uri,
          pool: parsedData.pool,
          timestamp: new Date().toISOString(),
        };

        Data.push(trade);

        console.log(
          ` New Trade: ${trade.name} (${trade.symbol}) - ${trade.solAmount} SOL`
        );
        console.log("trade:", trade);
        await get_data(trade.mint);
        // var mint = (trade.mint)
        // await get_data(mint);
      } else {
        console.warn(" Incomplete trade data received:", parsedData);
      }
    } catch (err) {
      console.error(" Error parsing WebSocket message:", err);
    }
  });

  ws.on("close", () => {
    console.warn("🔄 WebSocket connection lost. Reconnecting in 5 seconds...");
    setTimeout(connectWebSocket, 5000);
  });

  ws.on("error", (err) => {
    console.error(" WebSocket error:", err);
    ws.close();
  });

  return ws;
}

connectWebSocket();

server.listen(3001, () => {
  console.log(" Proxy server running on http://localhost:3001");
});
