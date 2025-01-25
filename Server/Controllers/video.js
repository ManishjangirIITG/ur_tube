import videofile from "../models/videofile.js";
import Ffmpeg from "fluent-ffmpeg";
import path from 'path';
import fs from 'fs';
// import videojs from 'video.js';

export const uploadvideo = async (req, res) => {
    try {
        console.log("Processing upload request...");
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        
        if (!req.file) {
            return res.status(400).json({ 
                message: "No video file provided" 
            });
        }

        // Validate file type
        if (!req.file.mimetype.startsWith('video/')) {
            // Remove the uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Invalid file type. Only video files are allowed."
            });
        }

        // Validate required fields
        if (!req.body.title) {
            // Remove the uploaded file
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const newVideo = new videofile({
            videotitle: req.body.title,
            description: req.body.description || '',
            filename: req.file.originalname,
            filepath: req.file.path,
            filetype: req.file.mimetype,
            filesize: req.file.size,
            videochanel: req.body.channel,
            uploader: req.body.Uploader,
            createdAt: new Date()
        });

        console.log("Attempting to save video:", newVideo);
        const savedVideo = await newVideo.save();
        console.log("Video saved successfully:", savedVideo);

        res.status(201).json({
            message: "Video uploaded successfully",
            data: savedVideo
        });
    } catch (error) {
        console.error("Error in uploadvideo controller:", error);
        
        // Clean up uploaded file if there's an error
        if (req.file && req.file.path) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (unlinkError) {
                console.error("Error removing uploaded file:", unlinkError);
            }
        }

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: "Invalid video data",
                error: error.message
            });
        }
        
        res.status(500).json({ 
            message: "Error uploading video",
            error: error.message 
        });
    }
};

export const getvideos = async (req, res) => {
    try {
        // Get videos from database
        const videos = await videofile.find();
        console.log("Found videos in DB:", videos.length); // Debug log
        
        // Get all files from uploads directory
        const uploadsDir = path.join(process.cwd(), 'uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const files = fs.readdirSync(uploadsDir)
            .filter(file => {
                const filePath = path.join(uploadsDir, file);
                return fs.statSync(filePath).isFile() && 
                       file.match(/\.(mp4|webm|mov)$/i);
            })
            .map(file => ({
                filename: file,
                filepath: `/video/stream/${file}`,
                videotitle: file.split('.')[0],
                createdAt: fs.statSync(path.join(uploadsDir, file)).ctime
            }));

        console.log("Found files in uploads:", files.length); // Debug log

        // Merge DB videos with file system videos
        const allVideos = [...videos];
        
        files.forEach(file => {
            if (!videos.find(v => v.filename === file.filename)) {
                allVideos.push(file);
            }
        });

        console.log("Total videos to send:", allVideos.length); // Debug log
        res.status(200).json(allVideos);
    } catch (error) {
        console.error("Error in getvideos:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add a streaming endpoint
export const streamVideo = async (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Video not found" });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error("Error streaming video:", error);
        res.status(500).json({ message: error.message });
    }
};

