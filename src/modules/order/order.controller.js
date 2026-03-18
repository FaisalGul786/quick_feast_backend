import { fetchAllOrders, placeOrderHandler , updatedOrder} from "./order.service.js";
export const placeOrder = async(req,res)=>{
    try {
        const {restaurant_id} = req.params;
        console.log('restaurant_id in controller', restaurant_id);

        const {id} = req.user;
        console.log("customer user_ ", id);

        // # get item quantity from client
        console.log("data for order from req.body ", req.body);
        // const {quantity, menu_item_id} = req.body;
        const {items} = req.body;



        console.log('menu Item id in controller', items[0].menu_item_id, items[0].quantity);


        const orderTable = await placeOrderHandler(items[0].menu_item_id, items[0].quantity, restaurant_id, id);
        console.log("order response", orderTable);

        return res.status(201).json({message: "Order created", orderTable})
        
    } catch(error) {
        console.log("error while place order controller");
        
    }
}

 // # All orders
 export const fetchOrders = async(req,res)=>{
    try {
        const owner_id = req.user.id; // From your auth token

        const orders = await fetchAllOrders(owner_id);

        console.log("All orders", orders);

        return res.status(200).json(orders);
        
    
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
      }
 }


// # update order status

export const updateOrderStatus = async(req,res)=>{
    const {order_id, order_status_val} = req.body;
    console.log("order_id to update order table status", order_id, order_status_val);
    try {
        const newOrderStatus = await updatedOrder(order_id, order_status_val);
        console.log("updated status of order", newOrderStatus);
        return res.status(200).json(newOrderStatus)
        
    } catch(error) {
        console.log("Error while updating order status controller")
    }
    
    
}