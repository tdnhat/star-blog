import express, { Application } from 'express';
import router from './routes/index.routes';
import dotenv from 'dotenv';
import { connectDB } from './config/db.config';
import session from 'express-session';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Routes
app.use('/api/v1', router);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});