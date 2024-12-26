// app.js

// Import dependencies
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import connectDB from './config/db.js'; // MongoDB connection
import errorHandler from './middlewares/errorHandler.js';
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

// Resolve path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route imports
import chapterRoutes from './routes/chapterRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reelRoutes from "./routes/BizReelsRoutes.js";
import communityRoutes from './routes/CommunityRoutes.js'; // Adjust the path
import offerRoutes from './routes/OffersRoutes.js'; // Adjust the path
// import alertRoutes from './routes/alertRoutes.js';
import userRoutes from './routes/user-routes.js'
import newsRoutes from './routes/NewsRoutes.js'
import bannerRoutes from './routes/bannerImageRoutes.js'
import clubRoutes from './routes/clubRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'
import businessRoutes from './routes/businessRoutes.js'
import authRoutes from './routes/authroutes.js'


// Initialize app 
dotenv.config(); // Load environment variables
const app = express();

// Connect to the database
connectDB();

// Security middleware
app.use(helmet());         // Set security-related HTTP headers
app.use(mongoSanitize());  // Sanitize user input to prevent NoSQL injection attacks
app.use(xss());            // Sanitize user input to prevent XSS attacks

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,  // 10 minutes
  max: 100,                  // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
// app.use(limiter);

// gatherMoreDetails('what is quantum physics')

// Middleware

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());  // Allow only specific domains
app.use(morgan('dev'));  // Logging middleware
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API routes
app.use('/api/v1/admin', adminRoutes);    // Admin management routes
app.use('/api/v1/chapters', chapterRoutes);
app.use("/api/v1/reels", reelRoutes);
app.use('/api/v1/communities', communityRoutes);
app.use('/api/v1/offers', offerRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/news', newsRoutes);
app.use('/api/v1/business', businessRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/banner-images', bannerRoutes);

// Custom error handling middleware
app.use(errorHandler);

// Basic home route
app.get('/', (req, res) => {
  res.send('Welcome to the Threat Intelligence Platform API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});