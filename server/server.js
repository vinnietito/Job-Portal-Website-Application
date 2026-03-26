// MUST BE FIRST — before anything else
import "./config/instrument.js";

import express from "express";
import cors from "cors";
import "dotenv/config";
import * as Sentry from "@sentry/node";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";

import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { clerkWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware, createClerkClient } from "@clerk/express";

// Initialize Clerk client with secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Log Clerk initialization
console.log('Clerk secret key loaded:', !!process.env.CLERK_SECRET_KEY);

// Initialize Express
const app = express();

// Connect to database
await connectDB();
await connectCloudinary();

// CORS
app.use(cors());

/*
IMPORTANT:
Webhook must be BEFORE express.json()
because Clerk needs the raw body to verify signature
*/
app.post(
  "/webhooks",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// JSON parser for other routes
app.use(express.json());

// Clerk middleware with authorized parties
app.use(clerkMiddleware({
  authorizedParties: [
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:3000',
    process.env.CLIENT_URL
  ].filter(Boolean),
  debug: true
}));

// Basic test route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Test route for Sentry
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});

// API Routes
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/user", userRoutes);

// Sentry error handler (must be after routes)
Sentry.setupExpressErrorHandler(app);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});