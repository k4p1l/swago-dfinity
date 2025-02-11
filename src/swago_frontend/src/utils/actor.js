import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/swago_backend/swago_backend.did.js";

const isLocalEnv = process.env.DFX_NETWORK === "local";

// Create an actor to interact with the backend
export const createActor = async () => {
  // For local development
  const host = "http://localhost:35365";

  // Initialize an agent
  const agent = new HttpAgent({
    host: isLocalEnv ? host : "https://icp0.io",
  });

  // Only fetch root key when in development
  if (process.env.NODE_ENV !== "production") {
    await agent.fetchRootKey();
  }

  // Create an actor
  const actor = Actor.createActor(idlFactory, {
    agent,
    canisterId: process.env.CANISTER_ID_SWAGO_BACKEND,
  });

  return actor;
};

export const getAllBettings = async () => {
  try {
    const actor = await createActor();
    const bettings = await actor.get_All_Bettings();
    return bettings;
  } catch (error) {
    console.error("Error fetching bettings:", error);
    throw error;
  }
};

export const getBetting = async (betting_id) => {
  try {
    const actor = await createActor();
    const result = await actor.get_events_by_id(betting_id);
    if (!result.length) {
      throw new Error("Betting not found");
    }
    return result[0];
  } catch (error) {
    console.error("Error fetching betting:", error);
    throw error;
  }
};

export const createBetting = async (bettingData) => {
  try {
    const actor = await createActor();
    const result = await actor.create_Betting(bettingData);
    return result;
  } catch (error) {
    console.error("Error creating betting:", error);
    throw error;
  }
};
