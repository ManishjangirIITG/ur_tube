import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getvideos } from '../Api';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching videos...');
        const response = await getvideos();
        console.log('Response:', response);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!videos.length) return <div>No videos found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {videos.map((video) => (
        <Link to={`/video/${video._id}`} key={video._id || video.filename} className="hover:opacity-90">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <video 
              className="w-full h-48 object-cover"
              preload="metadata"
            >
              <source 
                src={`http://localhost:5000/uploads/${video.filename}`}
                type="video/mp4"
              />
            </video>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{video.videotitle || video.title || video.filename}</h3>
              {video.uploadedBy && (
                <p className="text-gray-600 text-sm">
                  {video.uploadedBy.username}
                </p>
              )}
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