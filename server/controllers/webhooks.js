import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkWebhooks = async (req, res) => {
  try {

    // Clerk webhook secret
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not set");
    }

    const whook = new Webhook(webhookSecret);

    // Headers from Clerk
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify webhook using RAW body
    const payload = whook.verify(req.body, headers);

    const { data, type } = payload;

    console.log("Webhook verified:", type);

    switch (type) {

      case "user.created": {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url,
          resume: ""
        };

        console.log("Creating user:", userData);

        await User.create(userData);

        break;
      }

      case "user.updated": {

        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`,
          image: data.image_url
        };

        await User.findByIdAndUpdate(data.id, userData);

        break;
      }

      case "user.deleted": {

        await User.findByIdAndDelete(data.id);

        break;
      }

      default:
        console.log("Unhandled webhook type:", type);

    }

    res.status(200).json({ success: true });

  } catch (error) {

    console.error("Webhook error:", error.message);

    res.status(400).json({ success: false, message: "Webhook Error" });
  }
};