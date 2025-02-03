import Moralis from "moralis";

// Initialize Moralis once to avoid duplicate errors
export const initializeMoralis = async () => {
  if (!Moralis.Core.isStarted) {
    try {
      await Moralis.start({
        apiKey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjJlMjY1MDA0LWI5NmEtNDBhNC1iOTUzLTQ4NmU5MmZjMjg3ZSIsIm9yZ0lkIjoiNDI4MTQ5IiwidXNlcklkIjoiNDQwNDAzIiwidHlwZUlkIjoiYjk1MmVhMmMtODczMS00NTk0LTk5MTAtNjdjNzU5ZGYzZmJlIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzgxNjIyOTQsImV4cCI6NDg5MzkyMjI5NH0.DYXCnF_GKkJYb1vAf1pgtWQcb3Ko3-uoRxobJn_BbEY", // Replace with your actual API key
      });
      console.log("Moralis Initialized");
    } catch (err) {
      console.error(" Error initializing Moralis:", err);
    }
  } else {
    console.log(" Moralis already initialized");
  }
};
