import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import axios from "axios";

const envPath = fileURLToPath(new URL("../.env", import.meta.url));
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const app = express();
const PORT = 3001;

app.get("/api/news", async (req, res) => {
  const category = req.query.category || "crypto";
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Missing FINNHUB_API_KEY environment variable.",
    });
  }

  try {
    const response = await axios.get("https://finnhub.io/api/v1/news", {
      params: {
        category,
        token: apiKey,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch Finnhub news:", error.message);
    return res.status(502).json({
      error: "Failed to load cryptocurrency news.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
