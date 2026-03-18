import express from "express";
import cookieParser from "cookie-parser";

import cors from "cors";
import restaurantRoutes from "./modules/restaurant/restaurant.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import updateRestaurantRoutes from "./modules/restaurant/restaurant.routes.js";
import toggleRestaurantStatusRoute from  "./modules/restaurant/restaurant.routes.js";
import createMenu from "./modules/menu/menu.routes.js";
import restaurantsCollection  from "./modules/catalog/catalog.routes.js";
import restaurantDetail from "./modules/catalog/catalog.routes.js";
import placeOrder from "./modules/order/order.routes.js";
import updateOrderStatus from "./modules/order/order.routes.js";
import fetchOrders from "./modules/order/order.routes.js"

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({origin: "http://localhost:3000", credentials: true}));

// routes
app.use("/api/auth", authRoutes);

app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/restaurants", restaurantRoutes); // create restaurant by owner
app.use("/api/v1/update-restaurant", updateRestaurantRoutes);
app.use("/api/v1/toggle", toggleRestaurantStatusRoute); // make restaurant available by owner
app.use("/api/v1/menu", createMenu);
app.use("/api/v1/update/order",  updateOrderStatus); // # update order status

// # customer role
app.use("/api/v1",restaurantsCollection); // # all data of restaurants
app.use("/api/v1/restaurant", restaurantDetail);

// # order by customer

app.use("/api/v1/order", placeOrder); // # for MVP just 1 menu item so using req.params
app.use("/api/v1/fetch", fetchOrders); // Fetch orders for owner

app.get("/check", (req, res) => {
  res.send("Hello World");
});

export default app;