import React from 'react';
import UploadForm from '../../components/UploadForm/UploadForm';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <h1 className="hero-title">Convert Videos Easily</h1>
          <p className="hero-subtitle">
            Upload your video and convert it to any format with our powerful transcoder
          </p>
        </div>
        
        <div className="upload-section">
          <UploadForm />
        </div>
        
        <div className="features-section">
          <h2>Why Choose Our Transcoder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Fast Conversion</h3>
              <p>Convert videos in minutes with our optimized processing</p>
            </div>
            <div className="feature-card">
              <h3>Multiple Formats</h3>
              <p>Support for MP4, AVI, MOV, WEBM and more</p>
            </div>
            <div className="feature-card">
              <h3>High Quality</h3>
              <p>Maintain original quality with optimized compression</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;