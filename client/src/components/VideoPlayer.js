import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      fluid: true,
      sources: [{
        src: `http://localhost:5000/video/stream/${videoId}`,
        type: 'video/mp4'
      }]
    });

    const qualityLevels = [
      { label: '1080p', value: '1080p' },
      { label: '720p', value: '720p' },
      { label: '480p', value: '480p' },
      { label: '360p', value: '360p' }
    ];

    // Add quality selector button
    const qualitySelector = document.createElement('div');
    qualitySelector.className = 'vjs-quality-selector vjs-menu-button vjs-menu-button-popup vjs-button';
    
    const qualityButton = document.createElement('button');
    qualityButton.textContent = 'Quality';
    qualitySelector.appendChild(qualityButton);

    const qualityMenu = document.createElement('div');
    qualityMenu.className = 'vjs-menu';
    qualitySelector.appendChild(qualityMenu);

    const qualityList = document.createElement('ul');
    qualityList.className = 'vjs-menu-content';
    qualityMenu.appendChild(qualityList);

    qualityLevels.forEach(quality => {
      const qualityItem = document.createElement('li');
      qualityItem.className = 'vjs-menu-item';
      qualityItem.textContent = quality.label;
      qualityItem.onclick = () => {
        player.src({
          src: `http://localhost:5000/video/stream/${videoId}?quality=${quality.value}`,
          type: 'video/mp4'
        });
        const currentTime = player.currentTime();
        player.one('loadedmetadata', () => {
          player.currentTime(currentTime);
          player.play();
        });
      };
      qualityList.appendChild(qualityItem);
    });

    player.controlBar.addChild('QualitySelector', {
      el: qualitySelector
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [videoId]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoPlayer; 