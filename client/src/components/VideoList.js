import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../Api';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await API.getvideos();
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <Link to={`/video/${video._id}`} key={video._id} className="hover:opacity-90">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {video.thumbnail && (
              <img 
                src={video.thumbnail} 
                alt={video.title} 
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.title}</h3>
              <p className="text-gray-600 text-sm">
                {video.uploadedBy.username}
              </p>
              <p className="text-gray-500 text-sm">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default VideoList; 