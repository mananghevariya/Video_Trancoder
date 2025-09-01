import React, { useState } from 'react';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import VideoPreview from '../../components/VideoPreview/VideoPreview';
import './Dashboard.css';

const Dashboard = () => {
  const [convertedVideos, setConvertedVideos] = useState([
    {
      id: 1,
      name: 'sample-video.mp4',
      format: 'mp4',
      size: '15.2 MB',
      date: '2024-01-15',
      url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      file: null // In real app, this would be the actual file
    }
  ]);

  const [previewVideo, setPreviewVideo] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handlePreview = (video) => {
    setPreviewVideo(video);
    setShowPreview(true);
  };

  const handleDownload = (video) => {
    // Simulate download
    console.log('Downloading:', video.name);
    // In real app, this would download the actual file
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewVideo(null);
  };

  if (showPreview && previewVideo) {
    return (
      <VideoPreview
        videoFile={previewVideo.file}
        videoInfo={{
          fileName: previewVideo.name,
          format: previewVideo.format,
          fileSize: previewVideo.size,
          date: previewVideo.date
        }}
        onClose={handleClosePreview}
        onDownload={() => handleDownload(previewVideo)}
      />
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Your Converted Videos</h1>
        
        <div className="videos-grid">
          {convertedVideos.map((video) => (
            <div key={video.id} className="video-card">
              <VideoPlayer url={video.url} />
              <div className="video-info">
                <h3>{video.name}</h3>
                <p>Format: {video.format.toUpperCase()}</p>
                <p>Size: {video.size}</p>
                <p>Date: {video.date}</p>
                <div className="video-actions">
                  <button 
                    onClick={() => handlePreview(video)}
                    className="btn btn-primary"
                  >
                    Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(video)}
                    className="btn btn-secondary"
                  >
                    Download
                  </button>
                  <button className="btn btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {convertedVideos.length === 0 && (
          <div className="empty-state">
            <h2>No videos converted yet</h2>
            <p>Upload and convert your first video to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;