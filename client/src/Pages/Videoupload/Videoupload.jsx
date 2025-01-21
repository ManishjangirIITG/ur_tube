import React, { useState } from 'react'
import './Videoupload.css'
import { buildStyles, CircularProgressbar } from "react-circular-progressbar"
import { useSelector, useDispatch } from 'react-redux'
import { uploadvideo } from '../../action/video'
import axios from 'axios'

const Videoupload = ({ setvideouploadpage }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  // const [progress, setprogress] = useState(0)
  const dispatch = useDispatch();
  const currentuser = useSelector(state => state.currentuserreducer);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('channel', currentuser.result._id);
      formData.append('uploader', currentuser.result.name);

      // Use axios directly instead of dispatch for better error handling
      const response = await axios.post('http://localhost:5000/video/uploadvideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload Progress:', percentCompleted);
        }
      });

      if (response.data) {
        alert('Video uploaded successfully!');
        setvideouploadpage(false);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading video: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="video">Video File</label>
          <input
            type="file"
            id="video"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  )
}

export default Videoupload