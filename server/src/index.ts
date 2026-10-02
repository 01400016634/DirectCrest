import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

import uploadRouter from './routes/upload.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import orderRouter from './routes/order.js';
import productRouter from './routes/product.js';
import addressRouter from './routes/address.js';

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));
app.use('/api/upload', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/addresses', addressRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'DirectCrest MERN API' });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/directcrest')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
