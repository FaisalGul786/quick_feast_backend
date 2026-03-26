import {processWebhookEvent} from "./webhook.service.js";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const webhookHandler = async(req,res)=>{
  console.log("req.body   ← ← ← ← ← ← ← ← ← ← ← ← webhook Controller",req.body);
  
    const sig = req.headers['stripe-signature']

    console.log("secret being used:", process.env.STRIPE_WEBHOOK_SECRET)  // ← add this
  console.log("sig header:", sig) 

  let event

  try {

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    // Stripe will retry if you return non-200
    return res.status(400).send(`Webhook signature failed: ${err.message}`)
  }

  await processWebhookEvent(event)

  // Always send 200 quickly — Stripe expects fast acknowledgement
  res.json({ received: true })

}