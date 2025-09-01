import React from 'react';
import './BatchJobItem.css';

const BatchJobItem = ({ job, onRemove }) => {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'queued': return '⏰';
      case 'processing': return '🔄';
      case 'completed': return '✅';
      case 'error': return '❌';
      default: return '📁';
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'queued': return '#6c757d';
      case 'processing': return '#007bff';
      case 'completed': return '#28a745';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const formatTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString();
  };

  const getTimeTaken = () => {
    if (!job.startTime || !job.endTime) return '-';
    const seconds = Math.round((new Date(job.endTime) - new Date(job.startTime)) / 1000);
    return `${seconds}s`;
  };

  return (
    <div className={`batch-job-item ${job.status}`}>
      <div className="job-header">
        <div className="job-info">
          <span className="status-icon">{getStatusIcon()}</span>
          <div className="job-details">
            <h4 className="file-name">{job.fileName}</h4>
            <div className="job-meta">
              <span className="file-size">{job.fileSize}</span>
              <span className="file-format">→ {job.format.toUpperCase()}</span>
              {job.status === 'processing' && (
                <span className="progress-text">{Math.round(job.progress)}%</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="job-actions">
          <span className="job-status" style={{ color: getStatusColor() }}>
            {job.status.toUpperCase()}
          </span>
          {(job.status === 'completed' || job.status === 'error') && (
            <button
              onClick={() => onRemove(job.id)}
              className="remove-btn"
              title="Remove from queue"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {job.status === 'processing' && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${job.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {job.error && (
        <div className="error-message">
          <strong>Error:</strong> {job.error}
        </div>
      )}

      <div className="job-timings">
        <div className="timing">
          <span className="timing-label">Started:</span>
          <span className="timing-value">{formatTime(job.startTime)}</span>
        </div>
        <div className="timing">
          <span className="timing-label">Completed:</span>
          <span className="timing-value">{formatTime(job.endTime)}</span>
        </div>
        <div className="timing">
          <span className="timing-label">Time taken:</span>
          <span className="timing-value">{getTimeTaken()}</span>
        </div>
      </div>
    </div>
  );
};

export default BatchJobItem;