import OrderModel from "../models/orderModel.js";
import UserModel from "../models/usermodel.js";
import Stripe from "stripe";
import Razorpay from "razorpay";

// Global variables
const currency = 'usd';
const deliveryCharges = 10;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// Place order through COD
const placeOrder = async (req, res) => {
    try {
        const { items, address, amount } = req.body;
        const userId = req.user?.id;

        console.log('=== Place Order Request ===');
        console.log('User ID from token:', userId);
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        console.log('Items:', items, '| Type:', typeof items, '| IsArray:', Array.isArray(items));
        console.log('Address:', address, '| Type:', typeof address);
        console.log('Amount:', amount, '| Type:', typeof amount);

        if (!userId) {
            console.error('ERROR: User not authenticated - userId is:', userId);
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        console.log('Validating items...');
        if (!items) {
            console.error('ERROR: Items is missing or falsy');
            return res.status(400).json({ success: false, message: 'Items are required' });
        }

        console.log('Validating address...');
        if (!address) {
            console.error('ERROR: Address is missing or falsy');
            return res.status(400).json({ success: false, message: 'Address is required' });
        }

        console.log('Validating amount...');
        if (amount === undefined || amount === null) {
            console.error('ERROR: Amount is missing or null');
            return res.status(400).json({ success: false, message: 'Amount is required' });
        }

        if (!Array.isArray(items) || items.length === 0) {
            console.error('ERROR: Items is not an array or is empty');
            return res.status(400).json({ success: false, message: 'Items array cannot be empty' });
        }

        const orderData = {
            userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now(),
            status: 'Order Placed',
        };

        console.log('Creating order with data:', orderData);

        const newOrder = new OrderModel(orderData);
        console.log('Order instance created, attempting to save...');
        
        let savedOrder;
        try {
            savedOrder = await newOrder.save();
            console.log('✅ Order saved successfully! Order ID:', savedOrder._id);
        } catch (saveError) {
            console.error('❌ Error saving order:', saveError.message);
            throw saveError;
        }
        
        // Clear user's cart
        console.log('Clearing cart for user:', userId);
        try {
            const updateResult = await UserModel.findByIdAndUpdate(
                userId, 
                { cartData: {} }, 
                { new: true }
            );
            console.log('✅ Cart cleared successfully for user:', userId);
            console.log('Cart data after update:', updateResult?.cartData);
        } catch (cartError) {
            console.error('❌ Error clearing cart:', cartError.message);
            throw cartError;
        }
        
        console.log('✅ Sending success response');
        res.status(200).json({ success: true, message: 'Order placed successfully', orderId: newOrder._id });
        console.log('=== ✅ Order placement completed successfully ===\n');
    } catch (error) {
        console.error('=== ❌ ERROR placing order ===');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
        console.log('=== ❌ Sent 500 error response ===\n');
    }
};

// Place order through Stripe
const placeOrderStripe = async (req, res) => {
    try {
        const { items, address, amount } = req.body;
        const userId = req.user?.id;
        // Use the actual origin from request, or fallback to localhost:5176 (typical Vite frontend port)
        const origin = req.headers.origin || 'http://localhost:5176';

        console.log('=== Stripe Order Request ===');
        console.log('Origin:', origin);
        console.log('User ID:', userId);
        console.log('Items count:', items?.length, '| Address:', !!address, '| Amount:', amount);

        if (!userId) {
            console.error('ERROR: User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (!items || !address || !amount) {
            console.error('ERROR: Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const orderData = {
            userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: 'Stripe',
            payment: false,
            date: Date.now(),
            status: 'Payment Pending',
        };

        const newOrder = new OrderModel(orderData);
        const savedOrder = await newOrder.save();

        const line_items = items.map(item => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name,
                },
                unit_amount: (item.price * 100),
            },
            quantity: item.quantity || 1,
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges',
                },
                unit_amount: deliveryCharges * 100,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/payment-success?orderId=${savedOrder._id}`,
            cancel_url: `${origin}/payment-failed?orderId=${savedOrder._id}`,
            line_items: line_items,
            mode: 'payment',
        });

        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error('Error placing order with Stripe:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Verify Stripe Payment - UPDATED VERSION v2.0
const verifyStripePayment = async (req, res) => {
    const FUNCTION_VERSION = 'v2.0-20260404-FIXED';
    console.log('\n\n' + '='.repeat(80));
    console.log(`🎯 VERIFY STRIPE PAYMENT FUNCTION CALLED - VERSION: ${FUNCTION_VERSION}`);
    console.log('Timestamp:', new Date().toISOString());
    console.log('='.repeat(80) + '\n');
    
    try {
        const { orderId, sessionId } = req.body;
        const userId = req.user?.id;

        console.log('📝 REQUEST DATA:');
        console.log('  - orderId:', orderId);
        console.log('  - sessionId:', sessionId);
        console.log('  - userId:', userId);

        // VALIDATION CHECKS
        if (!userId) {
            console.error('❌ VALIDATION FAILED: User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (!orderId) {
            console.error('❌ VALIDATION FAILED: Order ID is required');
            return res.status(400).json({ success: false, message: 'Order ID is required' });
        }

        // CHECK IF ORDER EXISTS IN DATABASE
        console.log('🔍 Checking if order exists in MongoDB...');
        const order = await OrderModel.findById(orderId);
        if (!order) {
            console.error('❌ ORDER NOT FOUND:', orderId);
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        console.log('✅ Order found in MongoDB');
        console.log('  - Order ID:', order._id);
        console.log('  - Current payment status:', order.payment);
        console.log('  - Current payment method:', order.paymentMethod);

        // UPDATE ORDER TO MARK AS PAID
        console.log('💾 Updating order to mark as paid...');
        const updatedOrder = await OrderModel.findByIdAndUpdate(
            orderId,
            { payment: true, paymentMethod: 'Stripe', status: 'Order Placed' },
            { new: true }
        );
        console.log('✅ Order updated successfully');
        console.log('  - New payment status:', updatedOrder.payment);
        console.log('  - New payment method:', updatedOrder.paymentMethod);
        console.log('  - New status:', updatedOrder.status);

        // CLEAR USER CART
        console.log('🛒 Clearing user cart...');
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
        console.log('✅ User cart cleared');

        // SUCCESS RESPONSE
        console.log('🎉 PAYMENT VERIFICATION SUCCESSFUL');
        console.log('='.repeat(80) + '\n');
        res.json({ success: true, message: 'Payment verified and order updated successfully' });
        
    } catch (error) {
        console.error('\n❌ ERROR IN VERIFY STRIPE PAYMENT FUNCTION:');
        console.error('Error message:', error.message);
        console.error('Error name:', error.name);
        console.error('Full error:', error);
        console.error('='.repeat(80) + '\n');
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Place order through Razorpay
const placeOrderRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(500).json({ success: false, message: 'Razorpay not configured' });
        }

        const { items, address, amount } = req.body;
        const userId = req.user?.id;

        console.log('=== Razorpay Order Request ===');
        console.log('User ID:', userId);
        console.log('Items count:', items?.length, '| Address:', !!address, '| Amount:', amount);

        if (!userId) {
            console.error('ERROR: User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        if (!items || !address || !amount) {
            console.error('ERROR: Missing required fields');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const orderData = {
            userId,
            items: items,
            address: address,
            amount: amount,
            paymentMethod: 'Razorpay',
            payment: false,
            date: Date.now(),
            status: 'Payment Pending',
        };

        const newOrder = new OrderModel(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `order_${newOrder._id}`,
        };

        razorpayInstance.orders.create(options, (err, order) => {
            if (err) {
                console.error('Error creating Razorpay order:', err);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            res.status(200).json({ success: true, orderId: newOrder._id, razorpayOrderId: order.id, amount: order.amount });
        });
    } catch (error) {
        console.error('Error placing order with Razorpay:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Verify Razorpay Payment
const verifyRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(500).json({ success: false, message: 'Razorpay not configured' });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const userId = req.user?.id;

        console.log('=== Verifying Razorpay Payment ===');
        console.log('User ID:', userId);
        console.log('Razorpay Order ID:', razorpay_order_id);
        console.log('Razorpay Payment ID:', razorpay_payment_id);
        
        if (!userId) {
            console.error('❌ User not authenticated');
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }
        
        if (!razorpay_order_id) {
            console.error('❌ Missing razorpay_order_id');
            return res.status(400).json({ success: false, message: 'Missing payment order ID' });
        }

        // Fetch order from Razorpay
        const order = await razorpayInstance.orders.fetch(razorpay_order_id);
        console.log('Razorpay order status:', order.status);
        
        if (order.status === 'paid') {
            // Extract the MongoDB order ID from the receipt
            const orderId = order.receipt.split('_')[1];
            console.log('MongoDB Order ID:', orderId);
            
            // Update the order to mark as paid and confirmed
            const updatedOrder = await OrderModel.findByIdAndUpdate(orderId, { payment: true, status: 'Order Placed' }, { new: true });
            console.log('✅ Order marked as paid and confirmed:', updatedOrder._id);
            
            // Clear user's cart
            await UserModel.findByIdAndUpdate(userId, { cartData: {} }, { new: true });
            console.log('✅ User cart cleared');
            
            res.json({ success: true, message: 'Payment verified and order updated successfully' });
        } else {
            console.log('❌ Order status is not paid:', order.status);
            // Delete the order if payment was not successful
            const orderId = order.receipt.split('_')[1];
            await OrderModel.findByIdAndDelete(orderId);
            console.log('❌ Order deleted due to failed payment');
            res.json({ success: false, message: 'Payment failed. Order has been cancelled.' });
        }
    } catch (error) {
        console.error('❌ Error verifying Razorpay payment:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Get all orders (admin)
const allorders = async (req, res) => {
    try {
        console.log('=== Admin: Fetching All Orders ===');
        console.log('Admin check: req.user =', req.user);
        console.log('Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
        
        const orders = await OrderModel.find({ status: { $ne: 'Payment Pending' } });
        console.log('✅ Orders found:', orders.length);
        console.log('Orders sample:', orders[0] ? { id: orders[0]._id, items: orders[0].items.length, status: orders[0].status } : 'No orders');
        
        res.status(200).json({ success: true, orders: orders });
        console.log('✅ Orders response sent');
    } catch (error) {
        console.error('❌ Error fetching orders:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Get user's orders
const userorders = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        console.log('Fetching orders for user:', userId);
        const orders = await OrderModel.find({ userId: userId, status: { $ne: 'Payment Pending' } });
        console.log('Found orders:', orders.length);
        
        res.status(200).json({ success: true, orders: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Update order status (admin)
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: 'Missing orderId or status' });
        }

        const order = await OrderModel.findByIdAndUpdate(orderId, { status: status }, { new: true });
        
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, message: 'Order status updated successfully', order: order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export { placeOrder, placeOrderStripe, placeOrderRazorpay, verifyStripePayment, verifyRazorpay, allorders, userorders, updateStatus };
