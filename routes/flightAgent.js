import express from "express";
import { analyzeWithOpenAI } from "../utils/openaiAgent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { from, to, departure, passengers, travelClass } = req.body;

    if (!from || !to || !departure) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    // 🔹 Example placeholder: your Amadeus + OpenAI logic goes here
    const results = await analyzeWithOpenAI(
      [
        {
          airline: "Test Airline",
          route: `${from}-${to}`,
          cabin: travelClass,
          cash_price: 189.0,
        },
      ],
      travelClass
    );

    res.json(results);
  } catch (err) {
    console.error("Flight agent error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
