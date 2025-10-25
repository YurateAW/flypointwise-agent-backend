// backend/routes/flightAgent.js
import express from "express";
import Amadeus from "amadeus";

const router = express.Router();

// 🔑 Initialize Amadeus client (Production)
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
  hostname: "api.amadeus.com" // 👈 ensure Production environment
});

// 🔧 Helper: convert DD.MM.YYYY → YYYY-MM-DD if needed
function normalizeDate(dateStr) {
  if (!dateStr) return null;
  // Convert formats like 26.12.2025 or 26/12/2025
  return dateStr.replace(/(\d{2})[./-](\d{2})[./-](\d{4})/, "$3-$2-$1");
}

// 🛫 POST /api/flight-agent
router.post("/", async (req, res) => {
  try {
    const { from, to, departure, return: returnDate, passengers, travelClass } = req.body;

    if (!from || !to || !departure) {
      return res.status(400).json({ error: "Missing required parameters: from, to, or departure" });
    }

    // ✅ Build query for Amadeus API
    const params = {
      originLocationCode: from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate: normalizeDate(departure),
      adults: passengers || 1,
      currencyCode: "EUR",
      max: 30, // we’ll sort later
    };

    if (returnDate) params.returnDate = normalizeDate(returnDate);
    if (travelClass && travelClass !== "BOTH") params.travelClass = travelClass.toUpperCase();

    // 🔍 Fetch live flight offers
    const response = await amadeus.shopping.flightOffersSearch.get(params);

    // 🧮 Parse and sort by price & duration
    const offers = response.data.map((offer) => {
      const price = parseFloat(offer.price.total);

      const totalDuration = offer.itineraries
        .map((it) => it.duration.replace("PT", ""))
        .join(" / ");

      const outbound = offer.itineraries[0];
      const airline = outbound.segments[0].carrierCode;
      const stops = outbound.segments.length - 1;

      return {
        airline,
        price,
        duration: totalDuration,
        stops,
        cabin:
          offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin?.toUpperCase() ||
          "UNKNOWN",
      };
    });

    // Sort by lowest price, then duration
    const sorted = offers.sort((a, b) => {
      if (a.price !== b.price) return a.price - b.price;
      return a.duration.localeCompare(b.duration);
    });

    // Limit to top 10
    const top10 = sorted.slice(0, 10);

    res.json(top10);
  } catch (err) {
    console.error("❌ Amadeus API error:", err.response?.result || err);
    res.status(500).json({
      error: "Failed to fetch flights from Amadeus",
      details: err.response?.result || err.message,
    });
  }
});

export default router;
