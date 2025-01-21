import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";
import bodyParser from "body-parser";
import videoroutes from './Routes/video.js';
import userroutes from "./Routes/User.js";
import path from 'path';
import commentroutes from './Routes/comment.js';


dotenv.config(); // Ensure this is at the top to load environment variables
const app = express();

// console.log("DB_URL:",process.env.DB_URL)
// console.log("PORT:", process.env.PORT);

app.use(cors())
app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use('/uploads', express.static(path.join('uploads')))

app.get('/', (req, res) => {
    res.send("Your tube is working")
})

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups'); // or 'unsafe-none'
    next();
});

app.use(bodyParser.json())
app.use('/user', userroutes)
app.use('/video', videoroutes)
app.use('/comment', commentroutes)

const PORT = process.env.PORT || 5000;
// const PORT = process.env.PORT;
const db_url = process.env.DB_URL;

if(!db_url){
    console.error("Error: DB_URL is not defined...")
    process.exit(1);
}

mongoose.connect(db_url)
    .then(() => {
        console.log("Mongodb Database connected");
        app.listen(PORT, () => {
            console.log(`Server running on Port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });