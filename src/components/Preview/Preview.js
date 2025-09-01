import React from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './Preview.css';

const Preview = ({ src }) => {
  return (
    <div className="preview">
      <h3>Real-time Preview</h3>
      <VideoPlayer src={src} />
    </div>
  );
};

export default Preview;