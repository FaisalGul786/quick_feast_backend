// import Stripe from 'stripe';

// import { db } from '../../db.js';
// import { order } from '../order/order.schema.js';
// import { paymentTable } from './payment.schema.js';
// import { eq } from 'drizzle-orm';

// // ___________________________________________________________________________
// // # This service uses paymentIntent latter we can get client_secret rather
// //   Checkout Session
// // ##########################################################
// // ____________________________________________________

// export const paymentHandler = async(order_id)  => {
    
//     const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//     // 1. Fetch order from DB
//   const [order_record] = await db.select().from(order).where(eq(order.id, order_id));
//   console.log(order_record);

//     const amountInCents = Math.round(parseFloat(order_record.total_amount) * 100);
//     console.log('total amount ', amountInCents);
    
//     // 3.  restrict repeated payment
//     const existing = await db.select().from(paymentTable).where(eq(paymentTable.order_id, order_id))
//     if (existing.length) {
//         const error = new Error("duplicate_payment");
//         error.code = 400;

//         throw error
//     }
//     // 4. Create PaymentIntent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: amountInCents,   // ← 1500, Stripe is happy
//         currency: 'usd',
//         metadata: { orderId: order_record.id, userId: order_record.customer_id }
//     });




//     // 5. Insert Payment record with PENDING status
//   await db.insert(paymentTable).values({
//     stripe_payment_intent_id: paymentIntent.id,
//     order_id: order_record.id,
//     user_id: order_record.user_id,
//     amount: amountInCents,
//     status: 'PENDING'
//   });

//   // 5. Send clientSecret to controller
//   return { clientSecret: paymentIntent.client_secret}

// }



// // ___________________________________________________________________________
// // # This service uses Checkout Session latter we can get URl where 
// //   we can redirect user as a session at stripe created rather
// //   paymentIntent
// // ##########################################################
// // ____________________________________________________


import Stripe from 'stripe';
import { db } from '../../db.js';
import { order } from '../order/order.schema.js';
import { paymentTable } from './payment.schema.js';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // ← move outside, no need to recreate every call

export const paymentHandler = async (order_id) => {

  console.log(" ←  ←  ←  ←  ←  ← request ");

  // 1. Fetch order from DB
  const [order_record] = await db.select().from(order).where(eq(order.id, order_id));

  console.log(" ← ← ← ← ← ← ← Find Order Result ", order_record);

  // 2. Block duplicate payment
  const existing = await db.select().from(paymentTable).where(eq(paymentTable.order_id, order_id));
  console.log("existing payment already    ←  ←  ←  ← ", existing);

  if (existing.length) {
    const error = new Error("duplicate_payment");
    error.code = 400;
    throw error;
  }

  // 3. Convert amount
  const amountInCents = Math.round(parseFloat(order_record.total_amount) * 100);
  console.log("calculated amount  ← ← ← ← ←", amountInCents);

  // 4. Create Checkout Session  ← THIS is the change from your code
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `Quick Feast Order #${order_record.id}` },
        unit_amount: amountInCents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/restaurant/${order_record.restaurant_id}`,
    cancel_url: `${process.env.FRONTEND_URL}/customer/catalog`,
    metadata: {
      orderId: order_record.id,
      customerId: order_record.customer_id
    }
  });

  console.log("wow we reached here  ← ← ← ← ←", session);
  console.log(" ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←");
  

  // 5. Insert PENDING payment row
  await db.insert(paymentTable).values({
    stripe_session_id: session.id,
    stripe_payment_intent_id: null,
    order_id: order_record.id,
    customer_id: order_record.customer_id,  // ← you used customer_id above, keep consistent
    amount: amountInCents,
    status: 'PENDING'
  });

  console.log("Final  ← ← ← ← ← ← ← ← ← ← ← ←");
  

  // 6. Return Stripe hosted page URL  ← not clientSecret anymore
  return { url: session.url };
}