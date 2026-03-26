// import {updatedOrder} from "../order/order.service.js";
// import {updatePaymentStatus} from "../payment/payment.updatePaymentStatus.js"
// import { updateOrderPaymentMethod } from "../order/order.service.js";
// export const processWebhookEvent = async(event) =>{

//     switch (event.type) {

//       case 'checkout.session.completed': {
//         const session = event.data.object
//         await updatePaymentStatus(session.id, 'PAID', session.payment_intent)
//         await updatedOrder(session.metadata.orderId, 'PREPARING')
//         await updateOrderPaymentMethod(session.metadata.orderId, 'CARD')
//         break
//       }
//       case 'payment_intent.succeeded': {
//           const paymentIntent = event.data.object
//           await updatePaymentStatus(paymentIntent.id, 'SUCCESS')
//           await updatedOrder(paymentIntent.metadata.orderId, 'PREPARING')
//           break
//       }
    
//       case 'payment_intent.payment_failed': {
//           const paymentIntent = event.data.object
//           await updatePaymentStatus(paymentIntent.id, 'FAILED')
//           await updatedOrder(paymentIntent.metadata.orderId, 'PREPARING')
//           break
//       }
    
//       default:
//           console.log(`Unhandled event type: ${event.type}`)
//       }
// }


import { updatedOrder, updateOrderPaymentMethod } from "../order/order.service.js"
import { updatePaymentStatus } from "../payment/payment.updatePaymentStatus.js"

export const processWebhookEvent = async (event) => {
  switch (event.type) {

    case 'checkout.session.completed': {
      const session = event.data.object
      console.log("checkout.session.completed fired", session.metadata)
      await updatePaymentStatus(session.id, 'PAID', session.payment_intent)
      await updatedOrder(session.metadata.orderId, 'PREPARING')
      await updateOrderPaymentMethod(session.metadata.orderId, 'CARD')
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object
      await updatePaymentStatus(session.id, 'FAILED', null)
      await updatedOrder(session.metadata.orderId, 'CANCELED')
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }
}