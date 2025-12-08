// MUST BE FIRST — before anything else
import "./config/instrument.js";

import express from "express";
import cors from "cors";
import "dotenv/config";
import * as Sentry from "@sentry/node";
import connectDB from "./config/db.js";

// Initialize Express
const app = express();

// Connect to database
await connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API Working");
});

// ✅ Test route for Sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// ✅ Sentry error handler (MUST be after routes)
Sentry.setupExpressErrorHandler(app);

// Fallback error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Internal Server Error" });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
