import express from 'express';

import { placeOrder, placeOrderRazorpay, placeOrderStripe, allorders, userorders, updateStatus, verifyStripePayment, verifyRazorpay } from '../controllers/orderController.js';
import adminauth from '../middleware/adminauth.js';
import authUser from '../middleware/auth.js';


const Orderrouter = express.Router();

// admin feature
Orderrouter.post('/list', adminauth, allorders);
Orderrouter.post('/status', adminauth, updateStatus);

// payment feature 

Orderrouter.post('/placeorder', authUser, placeOrder);
Orderrouter.post('/stripe', authUser, placeOrderStripe);
Orderrouter.post('/razorpay', authUser, placeOrderRazorpay);

//user feature
Orderrouter.post('/myorders', authUser, userorders);

// verify payment
Orderrouter.post('/verifyStripe', authUser, verifyStripePayment);
Orderrouter.post('/verifyRazorpay', authUser, verifyRazorpay);
export default Orderrouter;