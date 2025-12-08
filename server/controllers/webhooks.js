import { Webhook } from "svix";
import userModel from "../models/userModel.js";

// API controller function to manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    // Create a Svix instance with clerk webhook secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Verify headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Getting data from request body
    const { data, type } = req.body;

    // Switch Case for diffrent events
    switch (type) {
      case "user.created": {
      }

      case "user.updated": {
      }

      case "user.deleted": {
      }
      default:
        break;
    }
  } catch (error) {}
};
