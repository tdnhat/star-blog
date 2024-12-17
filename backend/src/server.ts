import express from 'express';
import router from './routes/index.route';
import dotenv from 'dotenv';
import  { connectDB } from './config/db.config';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});