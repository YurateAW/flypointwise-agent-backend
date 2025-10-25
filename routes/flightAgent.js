import express from "express";
import { searchFlights } from "../utils/amadeusAPI.js";
import { analyzeWithOpenAI } from "../utils/openaiAgent.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { from, to, departure, return: ret, passengers, travelClass } = req.body;
    if (!from || !to || !departure || !passengers || !travelClass)
      return res.status(400).json({ error: "Missing required parameters." });
    console.log(`🔍 Searching ${travelClass} flights ${from} → ${to}`);
    let flights = [];
    if (travelClass === "BOTH") {
      const economy = await searchFlights(from, to, departure, ret, passengers, "ECONOMY");
      const business = await searchFlights(from, to, departure, ret, passengers, "BUSINESS");
      flights = [...economy, ...business];
    } else {
      flights = await searchFlights(from, to, departure, ret, passengers, travelClass);
    }
    if (!flights.length) return res.status(404).json({ error: "No flights found" });
    const summary = await analyzeWithOpenAI(flights, travelClass);
    res.json(summary);
  } catch (error) {
    console.error("❌ Flight Agent Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
