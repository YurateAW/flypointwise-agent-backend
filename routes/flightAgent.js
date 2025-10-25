// backend/routes/flightAgent.js
import express from "express";
import { amexTransferPrograms } from "../utils/amexPartners.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { from, to, departure, passengers, travelClass } = req.body;
    if (!from || !to || !departure)
      return res.status(400).json({ error: "Missing required parameters" });

    // Mock flight data (replace with real Amadeus later)
    const flights = [
      { airline: "Lufthansa", route: `${from}-${to}`, cabin: travelClass, cash_price: 189 },
      { airline: "British Airways", route: `${from}-${to}`, cabin: travelClass, cash_price: 175 },
      { airline: "Swiss", route: `${from}-${to}`, cabin: travelClass, cash_price: 205 },
    ];

    // For each flight, find best loyalty program option
    const results = flights.map((f) => {
      const options = amexTransferPrograms.map((p) => {
      const euroPerMile = Number(p.value_eur) || 0.012;        // default value
      const ratio = Number(p.ratio) || 1;                      // ensure numeric
      const requiredMiles = Math.round(f.cash_price / euroPerMile);
      const requiredAmexPoints = Math.round(requiredMiles * ratio);
      const effectiveValue = requiredAmexPoints > 0 ? (f.cash_price / requiredAmexPoints) : 0;
    
      return {
        name: p.program,
        ratio_display: `${(ratio).toFixed(2)}:1`,
        required_points: requiredAmexPoints,
        taxes: 95,
        effective_value: effectiveValue,
      };
    });

      // Sort best (lowest effective_value)
      const best = options.sort((a, b) => b.effective_value - a.effective_value)[0];

      return {
        ...f,
        best_program: best,
        recommendation: `Best value via ${best.name} (${best.ratio}) – ` +
          `${best.required_points.toLocaleString()} points + €${best.taxes} taxes`,
      };
    });

    res.json(results);
  } catch (err) {
    console.error("❌ Flight agent route error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
