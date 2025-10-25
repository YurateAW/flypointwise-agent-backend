import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import flightAgentRoute from "./routes/flightAgent.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => res.send("✈️ FlyPointWise API is running"));
app.use("/api/flight-agent", flightAgentRoute);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
