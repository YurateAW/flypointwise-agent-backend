import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flightAgentRoute from "./routes/flightAgent.js";

dotenv.config();

const app = express();

// ✅ Allowed frontend origins
const allowedOrigins = [
  "https://flypointwise.com",
  "http://localhost:3000",
  "http://localhost:3001"
];

// ✅ Configure CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ Blocked by CORS:", origin);
        callback(new Error("CORS blocked for origin: " + origin));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Explicitly handle preflight OPTIONS requests
app.options("*", cors());

// ✅ Middleware
app.use(express.json());

// ✅ Root test endpoint
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://flypointwise.com");
  res.send("✈️ FlyPointWise API is running");
});

// ✅ Flight agent route
app.use("/api/flight-agent", flightAgentRoute);

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
