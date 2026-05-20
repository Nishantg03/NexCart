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

let connectionsReady;

const ensureConnections = async () => {
    if (!connectionsReady) {
        connectionsReady = (async () => {
            try {
                await connectDB();
                console.log('✅ Database connected successfully');
            } catch (err) {
                console.error('❌ Error connecting to MongoDB:', err);
                throw err;
            }

            try {
                connectCloudinary();
                console.log('✅ Cloudinary connected successfully');
            } catch (err) {
                console.error('❌ Error connecting to Cloudinary:', err);
                throw err;
            }
        })();
    }

    return connectionsReady;
};

// middlewares
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
    try {
        await ensureConnections();
        next();
    } catch (err) {
        next(err);
    }
});

//apis endpoints
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', Cartrouter);
app.use('/api/orders', Orderrouter);

app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.use((err, req, res, next) => {
    console.error('❌ Request failed:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

export default app;