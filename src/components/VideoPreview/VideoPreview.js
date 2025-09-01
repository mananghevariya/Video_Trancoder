import React, { useState, useRef } from 'react';
import './VideoPreview.css';

const VideoPreview = ({ videoFile, videoInfo, onClose, onDownload }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handlePlaybackRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleVolumeChange = (vol) => {
    if (videoRef.current) {
      videoRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVideoUrl = () => {
    return URL.createObjectURL(videoFile);
  };

  return (
    <div className="video-preview-overlay">
      <div className="video-preview-container">
        <div className="preview-header">
          <h2>Video Preview</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="video-info">
          <div className="info-item">
            <strong>Filename:</strong> {videoInfo.fileName}
          </div>
          <div className="info-item">
            <strong>Format:</strong> {videoInfo.format.toUpperCase()}
          </div>
          <div className="info-item">
            <strong>Size:</strong> {videoInfo.fileSize}
          </div>
          <div className="info-item">
            <strong>Duration:</strong> {formatTime(duration)}
          </div>
          {videoInfo.filters && (
            <div className="info-item">
              <strong>Filters Applied:</strong> {Object.entries(videoInfo.filters)
                .filter(([_, value]) => value !== 100 && value !== 0)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ') || 'None'}
            </div>
          )}
          {videoInfo.trim && (
            <div className="info-item">
              <strong>Trimmed:</strong> {formatTime(videoInfo.trim.start)} - {formatTime(videoInfo.trim.end)}
            </div>
          )}
        </div>

        <div className="video-player-container">
          <video
            ref={videoRef}
            src={getVideoUrl()}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            className="preview-video"
          />
        </div>

        <div className="video-controls">
          <div className="control-group">
            <button onClick={handlePlayPause} className="control-btn">
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="seek-slider"
            />
          </div>

          <div className="control-group">
            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>

            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              className="playback-select"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
                <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>

            <button onClick={handleFullscreen} className="control-btn">
              ⛶
            </button>
          </div>
        </div>

        <div className="preview-actions">
          <button onClick={onDownload} className="btn btn-primary download-btn">
            ⬇️ Download Video
          </button>
          
          <div className="download-info">
            <span>Right-click the video and select "Save video as..." for alternative download</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;