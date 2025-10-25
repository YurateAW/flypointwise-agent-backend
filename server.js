import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flightAgentRoute from "./routes/flightAgent.js";

dotenv.config();

const app = express();

// ✅ Allow only your frontend domain
const allowedOrigins = [
  "https://flypointwise.com",      // your live frontend
  "http://localhost:3000",         // for local dev (optional)
  "http://localhost:3001"          // backend local
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("✈️ FlyPointWise API is running"));

// Main route
app.use("/api/flight-agent", flightAgentRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
