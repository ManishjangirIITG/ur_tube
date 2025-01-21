import videofile from "../Models/videofile.js";
import Ffmpeg from "fluent-ffmpeg";
import path from 'path';
import fs from 'fs';
// import videojs from 'video.js';
export const uploadvideo=async(req,res)=>{
    if(req.file=== undefined){
        res.status(404).json({message:"plz upload a mp.4 video file only"})
    }else{
        try {
            const filePath = req.file.path;
            const fileName = path.basename(filePath,path.extname(filePath));

            // Creating Directories for HLS output
            const outputDir = path.join('uploads',fileName);
            if(!fs.existsSync(outputDir)){
                fs.mkdirSync(outputDir);
            }

            // Generate HLS streams with FFmpeg
            Ffmpeg(filePath)
                .outputOptions([
                    '-vf scale=w=1280:h=720:force_original_aspect_ratio=decrease',
                    '-c:a copy',
                    '-c:v libx264',
                    '-crf 20',
                    '-preset fast',
                    '-hls_time 10',
                    '-hls_playlist_type vod',
                    '-b:v 1500k',
                    '-maxrate 1500k',
                    '-bufsize 3000k',
                    `-hls_segment_filename ${path.join(outputDir, '720p_%03d.ts')}`,
                    `${path.join(outputDir, '720p.m3u8')}`,
                ])
                .outputOptions([
                    '-vf scale=w=854:h=480:force_original_aspect_ratio=decrease',
                    '-c:a copy',
                    '-c:v libx264',
                    '-crf 20',
                    '-preset fast',
                    '-hls_time 10',
                    '-hls_playlist_type vod',
                    '-b:v 1000k',
                    '-maxrate 1000k',
                    '-bufsize 2000k',
                    `-hls_segment_filename ${path.join(outputDir, '480p_%03d.ts')}`,
                    `${path.join(outputDir, '480p.m3u8')}`,
                ])
                .outputOptions([
                    '-vf scale=w=640:h=360:force_original_aspect_ratio=decrease',
                    '-c:a copy',
                    '-c:v libx264',
                    '-crf 20',
                    '-preset fast',
                    '-hls_time 10',
                    '-hls_playlist_type vod',
                    '-b:v 500k',
                    '-maxrate 500k',
                    '-bufsize 1000k',
                    `-hls_segment_filename ${path.join(outputDir, '360p_%03d.ts')}`,
                    `${path.join(outputDir, '360p.m3u8')}`,
                ])
                .on('end', async () => {
                    // Save video information to the database
                    const newVideo = new videofile({
                        videotitle: req.body.title,
                        filename: req.file.originalname,
                        filepath: `${fileName}/720p.m3u8`, // Path to the HLS playlist
                        filetype: req.file.mimetype,
                        filesize: req.file.size,
                        videochanel: req.body.chanel,
                        uploader: req.body.uploader,
                    });

                    await newVideo.save();

                     // Delete the original uploaded file
                     fs.unlinkSync(filePath);

                     res.status(200).json({ message: 'Video uploaded and processed successfully' });
                 })
                 .on('error', (err) => {
                    console.error('Error processing video:', err);
                    res.status(500).json({ message: 'Error processing video' });
                })
                .run();
            // const file=new videofile({
            //     videotitle:req.body.title,
            //     filename:req.file.originalname,
            //     filepath:req.file.path,
            //     filetype:req.file.mimetype,
            //     filesize:req.file.size,
            //     videochanel:req.body.chanel,
            //     uploader:req.body.uploader,
            // })
            // console.log(file)
            // await file.save()
            // res.status(200).send("File uploaded successfully")
        } catch (error) {
            res.status(500).json({message: error.message})
            return
        }
    }
};

export const getallvideos=async(req,res)=>{
    try {
        const files=await videofile.find();
        res.status(200).send(files)
    } catch (error) {
        res.status(404).json(error.message)
            return
    }
}