// backend/routes/flightAgent.js
import express from "express";
import { analyzeWithOpenAI } from "../utils/openaiAgent.js";

const router = express.Router();

// 🛫 Main endpoint: POST /api/flight-agent
router.post("/", async (req, res) => {
  try {
    const { from, to, departure, passengers, travelClass } = req.body;

    // ✅ Validate input
    if (!from || !to || !departure) {
      return res.status(400).json({ error: "Missing required parameters: from, to, departure" });
    }

    // ✈️ Mock data — replace with real Amadeus API integration later
    const flights = [
      {
        airline: "Lufthansa",
        route: `${from}-${to}`,
        cabin: travelClass,
        cash_price: 189.0,
      },
      {
        airline: "British Airways",
        route: `${from}-${to}`,
        cabin: travelClass,
        cash_price: 175.0,
      },
      {
        airline: "Swiss",
        route: `${from}-${to}`,
        cabin: travelClass,
        cash_price: 205.0,
      },
    ];

    // 🧠 Analyze results with your OpenAI logic (optional)
    let results;
    try {
      results = await analyzeWithOpenAI(flights, travelClass);
    } catch (aiError) {
      console.error("OpenAI analysis failed, falling back to mock data:", aiError.message);
      results = flights;
    }

    // ✅ Return JSON response
    res.json(results);
  } catch (err) {
    console.error("❌ Flight agent route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
