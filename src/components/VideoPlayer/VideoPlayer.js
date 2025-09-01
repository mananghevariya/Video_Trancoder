import React from 'react';
import './VideoPlayer.css';

const VideoPlayer = ({ url }) => {
  return (
    <div className="video-player">
      <video controls className="video-element">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;