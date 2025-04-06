import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const DataBase = "mongodb://0.0.0.0:27017/gymbuddy"; // MongoDB Connection URL
mongoose.connect(DataBase);
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("MongoDB connected"));

// Routes
import workoutRoutes from "./routes/workouts.js";
app.use("/api/workouts", workoutRoutes);

import metricRoutes from "./routes/metrics.js";
app.use("/api/metrics", metricRoutes);

import goalRoutes from "./routes/goals.js";
app.use("/api/goals", goalRoutes);

// Assigns the port to the environment variable PORT or defaults to 5000 and starts the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
