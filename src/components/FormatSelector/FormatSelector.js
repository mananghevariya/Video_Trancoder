import React from 'react';
import './FormatSelector.css';

const formats = [
  { id: 'mp4', label: 'MP4', icon: '🎥' },
  { id: 'avi', label: 'AVI', icon: '📹' },
  { id: 'mov', label: 'MOV', icon: '🍎' },
  { id: 'webm', label: 'WEBM', icon: '🌐' },
  { id: 'mkv', label: 'MKV', icon: '📁' }
];

const FormatSelector = ({ selectedFormat, onFormatChange }) => {
  return (
    <div className="format-selector">
      <h3>Select Output Format:</h3>
      <div className="format-grid">
        {formats.map((format) => (
          <button
            key={format.id}
            className={`format-btn ${selectedFormat === format.id ? 'active' : ''}`}
            onClick={() => onFormatChange(format.id)}
          >
            <span className="format-icon">{format.icon}</span>
            <span className="format-label">{format.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatSelector;
