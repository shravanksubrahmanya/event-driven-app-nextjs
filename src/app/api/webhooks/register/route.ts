import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const webhook_secret = process.env.WEBHOOK_SECRET;

  if (!webhook_secret) {
    throw new Error("Webhook secret not configured");
  }

  const headerPayload = await headers();
  const svix_id = await headerPayload.get("svix-id");
  const svix_signature = await headerPayload.get("svix-signature");
  const svix_timestamp = await headerPayload.get("svix-timestamp");

  if (!svix_id || !svix_signature || !svix_timestamp) {
    return new Response("Missing svix headers", { status: 400 });
  }

  const payload = await request.json();
  const reqBody = JSON.stringify(payload);

  const webhook = new Webhook(webhook_secret);
  let event: WebhookEvent;

  try {
    event = webhook.verify(reqBody, {
      "svix-id": svix_id,
      "svix-signature": svix_signature,
      "svix-timestamp": svix_timestamp,
    }) as WebhookEvent;
  } catch (error: any) {
    console.error("Webhook verification failed:", error.message);
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { id } = event.data;
  const eventType = event.type;

  if (eventType === "user.created") {
    try {
      const {
        email_addresses,
        primary_email_address_id,
        first_name,
        last_name,
      } = event.data;

      const primary_email = email_addresses.find(
        (email) => email.id === primary_email_address_id
      );

      if (!primary_email) {
        console.error("Primary email address not found in event data");
        return new Response("Primary email address not found", { status: 400 });
      }

      //   create a user in the postgresql
      const newUser = await prisma.user.create({
        data: {
          id: id,
          email: primary_email.email_address,
          isSubscribed: false,
        },
      });
      console.log("User created in database:", newUser);
    } catch (error) {
      console.error("Error processing user.created event:", error);
      return new Response("Error processing event", { status: 500 });
    }
  }

  return new Response("Webhook processed successfully", { status: 200 });
}
