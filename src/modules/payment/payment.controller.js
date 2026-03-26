
import { paymentHandler } from './payment.service.js';




export const makePayment = async(req,res)=>{

    const {order_id} = req.body;
    console.log("order_id while pay"  , order_id);

    try {
        const response = await paymentHandler(order_id);
        
        
        console.log("payment initiated ", response);

        // # it may return client_secret or url(default)
        if(response) return res.status(201).json(response);

    } catch(error) {
        console.log("error making payment intents", error);

        if(error.code === "duplicate_payment") {
            return res.status(400).json({ message: 'Payment already exists for this order' })
        }
    }

    

}