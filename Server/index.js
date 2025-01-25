import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import bodyParser from "body-parser";
import videoRoutes from './Routes/video.js';
import userRoutes from './Routes/user.js';
import path from 'path';
import commentRoutes from './Routes/comment.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GridFSBucket } from 'mongodb';
import { conn } from './db.js';
import { errorHandler } from './middleware/error.js';
import fileUpload from "express-fileupload";

dotenv.config(); // Ensure this is at the top to load environment variables
const app = express();

// Connect to MongoDB first
mongoose.connect(process.env.DB_URL, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 15000,
})
.then(() => {
    console.log('Connected to MongoDB successfully');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// CORS configuration with specific options
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Length', 'Content-Range']
}));

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files with proper headers
app.use('/uploads', (req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    next();
}, express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.send("Your tube is working")
})

app.use((req, res, next) => {
    res.removeHeader('Cross-Origin-Opener-Policy');
    next();
});

// Add this before your routes but after CORS
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    next();
});

// Add this after your existing middleware but before routes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request body:', req.body);
    next();
});

app.use(bodyParser.json())
app.use('/user', userRoutes)
app.use('/video', videoRoutes)
app.use('/comment', commentRoutes)


// Add this after your routes
app.use(errorHandler);

// Update your error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
});

