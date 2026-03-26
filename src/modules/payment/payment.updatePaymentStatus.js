import {paymentTable} from "../payment/payment.schema.js";
import { db } from "../../db.js";
import { eq } from "drizzle-orm";

export const updatePaymentStatus = async(sessionId, status_val, paymentIntentId) => {
    console.log("sessionId← ← ← ← ← ← ← ←status_val ← ← ← ← ← ← ← ←paymentIntentId ", sessionId, status_val, paymentIntentId)
    try {
        const updatedPayment = await db.update(paymentTable)
          .set({ 
            status: status_val,
            stripe_payment_intent_id: paymentIntentId, // ← because session.payment_intent is null
            paid_at: new Date()
          })
          .where(eq(paymentTable.stripe_session_id, sessionId))
          .returning()
    
        console.log("Updated payment status ← ← ← ←", updatedPayment)
        return updatedPayment
    
      } catch(error) {


        console.log("Error while updating payment status service", error)
      }
} // # for web-hook use only not for customer or  owner