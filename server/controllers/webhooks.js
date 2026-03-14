import { Webhook } from "svix";
//import userModel from "../models/userModel.js";
import User from "../models/User.js";

// API controller function to manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("Webhook received:", req.body); // Log webhook payload
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
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
          resume: "",
        };
        console.log("Creating user:", userData); // Log user creation
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          image: data.image_url,
        };
        console.log("Updating user:", userData); // Log user update
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        console.log("Deleting user:", data.id); // Log user deletion
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        console.log("Unhandled webhook type:", type); // Log unhandled types
        break;
    }
  } catch (error) {
    console.log("Webhook error:", error.message);
    res.json({ success: false, message: "Webhooks Error" });
  }
};
