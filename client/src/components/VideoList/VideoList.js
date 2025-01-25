import React, { useState, useEffect } from 'react';
import { getvideos } from '../../Api';
import './VideoList.css';
import dotenv from 'dotenv'

dotenv.config()

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            console.log('Fetching videos...'); // Debug log
            const response = await getvideos();
            console.log('Videos response:', response.data); // Debug log
            setVideos(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setError('Failed to load videos. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.error('Date formatting error:', error);
            return 'Date unavailable';
        }
    };

    if (loading) return <div className="loading">Loading videos...</div>;
    if (error) return <div className="error">{error}</div>;

    console.log('BASE_URL:', process.env.REACT_APP_BASE_URL);

    return (
        <div className="video-list">
            {videos.map((video, index) => (
                <div key={index} className="video-item">
                    <video 
                        controls
                        width="100%"
                        preload="metadata"
                    >
                        <source 
                            src={`${process.env.REACT_APP_BASE_URL}/video/stream/${video.filename || video.originalname}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-info">
                        <h3>{video.videotitle || video.title || video.filename}</h3>
                        {video.description && <p>{video.description}</p>}
                        <p className="video-date">
                            Uploaded: {formatDate(video.createdAt)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoList; 