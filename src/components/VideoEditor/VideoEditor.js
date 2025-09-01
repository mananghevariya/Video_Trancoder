import React, { useState, useRef, useEffect } from 'react';
import './VideoEditor.css';

const VideoEditor = ({ videoFile, onSave, onCancel }) => {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hue: 0,
    blur: 0
  });
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      setDuration(videoDuration);
      setTrimEnd(videoDuration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (time) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const applyFiltersToVideo = () => {
    if (videoRef.current) {
      videoRef.current.style.filter = `
        brightness(${filters.brightness}%)
        contrast(${filters.contrast}%)
        saturate(${filters.saturation}%)
        hue-rotate(${filters.hue}deg)
        blur(${filters.blur}px)
      `;
    }
  };

  useEffect(() => {
    applyFiltersToVideo();
  }, [filters]);

  const handleSave = async () => {
    // In a real implementation, this would process the video with filters and trim
    const processedVideo = {
      file: videoFile,
      filters,
      trim: { start: trimStart, end: trimEnd },
      duration: trimEnd - trimStart
    };
    
    onSave(processedVideo);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      hue: 0,
      blur: 0
    });
  };

  if (!videoFile) {
    return <div className="video-editor-empty">No video selected</div>;
  }

  return (
    <div className="video-editor">
      <div className="editor-header">
        <h2>Video Editor</h2>
        <p>Trim and enhance your video before conversion</p>
      </div>

      <div className="editor-content">
        <div className="video-preview-section">
          <div className="video-container">
            <video
              ref={videoRef}
              src={videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              controls
              className="editor-video"
            />
          </div>

          <div className="timeline-controls">
            <div className="time-display">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div className="trim-controls">
              <div className="trim-inputs">
                <div className="trim-input-group">
                  <label>Start Time</label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={trimStart}
                    onChange={(e) => setTrimStart(parseFloat(e.target.value))}
                  />
                  <span>{formatTime(trimStart)}</span>
                </div>

                <div className="trim-input-group">
                  <label>End Time</label>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={trimEnd}
                    onChange={(e) => setTrimEnd(parseFloat(e.target.value))}
                  />
                  <span>{formatTime(trimEnd)}</span>
                </div>
              </div>

              <div className="trim-preview">
                <div className="trim-bar">
                  <div
                    className="trim-range"
                    style={{
                      left: `${(trimStart / duration) * 100}%`,
                      width: `${((trimEnd - trimStart) / duration) * 100}%`
                    }}
                  ></div>
                </div>
                <div className="trim-duration">
                  Duration: {formatTime(trimEnd - trimStart)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="filter-controls-section">
          <h3>Video Filters</h3>
          
          <div className="filter-controls">
            <FilterSlider
              label="Brightness"
              value={filters.brightness}
              min={0}
              max={200}
              onChange={(value) => handleFilterChange('brightness', value)}
            />
            
            <FilterSlider
              label="Contrast"
              value={filters.contrast}
              min={0}
              max={200}
              onChange={(value) => handleFilterChange('contrast', value)}
            />
            
            <FilterSlider
              label="Saturation"
              value={filters.saturation}
              min={0}
              max={200}
              onChange={(value) => handleFilterChange('saturation', value)}
            />
            
            <FilterSlider
              label="Hue"
              value={filters.hue}
              min={-180}
              max={180}
              onChange={(value) => handleFilterChange('hue', value)}
            />
            
            <FilterSlider
              label="Blur"
              value={filters.blur}
              min={0}
              max={10}
              step={0.1}
              onChange={(value) => handleFilterChange('blur', value)}
            />
          </div>

          <div className="filter-presets">
            <h4>Presets</h4>
            <div className="preset-buttons">
              <button onClick={resetFilters} className="preset-btn">
                Original
              </button>
              <button 
                onClick={() => setFilters({ brightness: 120, contrast: 110, saturation: 90, hue: 0, blur: 0 })}
                className="preset-btn"
              >
                Bright
              </button>
              <button 
                onClick={() => setFilters({ brightness: 90, contrast: 120, saturation: 110, hue: 0, blur: 0 })}
                className="preset-btn"
              >
                Contrast
              </button>
              <button 
                onClick={() => setFilters({ brightness: 100, contrast: 100, saturation: 150, hue: 0, blur: 0 })}
                className="preset-btn"
              >
                Vibrant
              </button>
              <button 
                onClick={() => setFilters({ brightness: 80, contrast: 120, saturation: 80, hue: 180, blur: 0.5 })}
                className="preset-btn"
              >
                Cool
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-actions">
        <button onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button onClick={resetFilters} className="btn btn-outline">
          Reset Filters
        </button>
        <button onClick={handleSave} className="btn btn-primary">
          Apply & Continue
        </button>
      </div>
    </div>
  );
};

const FilterSlider = ({ label, value, min, max, step = 1, onChange }) => {
  return (
    <div className="filter-slider">
      <label>
        {label}: <span className="filter-value">{value}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider"
      />
      <div className="slider-labels">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default VideoEditor;