import express from "express";
import dotenv from "dotenv";
import flightAgentRoute from "./routes/flightAgent.js";

dotenv.config();
const app = express();

// ✅ Always handle CORS manually before anything else
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://flypointwise.com",
    "https://www.flypointwise.com",
    "http://localhost:3000"
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Root endpoint (used to verify server status)
app.get("/", (req, res) => {
  res.send("✈️ FlyPointWise API is running and CORS headers active");
});

// ✅ API route
app.use("/api/flight-agent", flightAgentRoute);

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
