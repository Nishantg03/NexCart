import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import { connectCloudinary } from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import productRouter from './routes/productRoute.js';
import Cartrouter from './routes/cartRoute.js';
import Orderrouter from './routes/orderRoute.js';

// app configuration
const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

//apis endpoints
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', Cartrouter);
app.use('/api/orders', Orderrouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
});

// Initialize database connections and start server
(async () => {
    try {
        await connectDB();
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err);
        process.exit(1);
    }
    try {
        connectCloudinary();
        console.log('✅ Cloudinary connected successfully');
    } catch (err) {
        console.error('❌ Error connecting to Cloudinary:', err);
        process.exit(1);
    }
    
    // Start server only after connections are ready
    app.listen(port, () => {
        console.log(`✅ Server is running on port ${port}`);
    });
})();