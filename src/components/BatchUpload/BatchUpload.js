import React, { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import BatchJobItem from '../BatchJobItem/BatchJobItem';
import FormatSelector from '../FormatSelector/FormatSelector';
import './BatchUpload.css';

const BatchUpload = () => {
  const [queue, setQueue] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newJobs = files.map(file => ({
      id: uuidv4(),
      file,
      fileName: file.name,
      format: selectedFormat,
      status: 'queued',
      progress: 0,
      fileSize: formatFileSize(file.size),
      startTime: null,
      endTime: null,
      error: null
    }));

    setQueue(prevQueue => [...prevQueue, ...newJobs]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    
    // Update format for all queued jobs
    setQueue(prevQueue => prevQueue.map(job => 
      job.status === 'queued' ? { ...job, format } : job
    ));
  };

  const processQueue = async () => {
    if (queue.length === 0 || isProcessing) return;

    setIsProcessing(true);
    const processingJobs = queue.filter(job => job.status === 'queued');
    
    for (const job of processingJobs) {
      try {
        // Update job status to processing
        setQueue(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'processing', startTime: new Date() } : j
        ));

        // Simulate processing with progress updates
        await processSingleJob(job);
        
        // Update job status to completed
        setQueue(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'completed', progress: 100, endTime: new Date() } : j
        ));
      } catch (error) {
        // Update job status to error
        setQueue(prev => prev.map(j => 
          j.id === job.id ? { ...j, status: 'error', error: error.message } : j
        ));
      }
    }
    
    setIsProcessing(false);
  };

  const processSingleJob = async (job) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        
        setQueue(prev => prev.map(j => 
          j.id === job.id ? { ...j, progress: Math.min(progress, 100) } : j
        ));
      }, 500);
    });
  };

  const removeJob = (jobId) => {
    setQueue(prev => prev.filter(job => job.id !== jobId));
  };

  const clearCompleted = () => {
    setQueue(prev => prev.filter(job => job.status !== 'completed' && job.status !== 'error'));
  };

  const clearAll = () => {
    setQueue([]);
  };

  const getQueueStats = () => {
    const total = queue.length;
    const completed = queue.filter(job => job.status === 'completed').length;
    const processing = queue.filter(job => job.status === 'processing').length;
    const queued = queue.filter(job => job.status === 'queued').length;
    const errors = queue.filter(job => job.status === 'error').length;

    return { total, completed, processing, queued, errors };
  };

  const stats = getQueueStats();

  return (
    <div className="batch-upload">
      <div className="batch-header">
        <h2>Batch Video Conversion</h2>
        <p>Convert multiple videos at once</p>
      </div>

      <div className="batch-controls">
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            onChange={handleFileSelect}
            className="file-input"
            id="batch-upload-input"
          />
          <label htmlFor="batch-upload-input" className="upload-label">
            <span className="upload-icon">📁</span>
            Select Multiple Videos
            <span className="upload-hint">(Max 10 files at once)</span>
          </label>
        </div>

        <FormatSelector
          selectedFormat={selectedFormat}
          onFormatChange={handleFormatChange}
        />

        <div className="action-buttons">
          <button
            onClick={processQueue}
            disabled={stats.queued === 0 || isProcessing}
            className="btn btn-primary"
          >
            {isProcessing ? 'Processing...' : `Start Processing (${stats.queued})`}
          </button>
          
          <button onClick={clearCompleted} className="btn btn-secondary">
            Clear Completed
          </button>
          
          <button onClick={clearAll} className="btn btn-danger">
            Clear All
          </button>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="queue-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.queued}</span>
            <span className="stat-label">Queued</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.processing}</span>
            <span className="stat-label">Processing</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.errors}</span>
            <span className="stat-label">Errors</span>
          </div>
        </div>
      )}

      <div className="batch-queue">
        {queue.map(job => (
          <BatchJobItem
            key={job.id}
            job={job}
            onRemove={removeJob}
          />
        ))}
      </div>

      {stats.total === 0 && (
        <div className="empty-queue">
          <div className="empty-icon">🎬</div>
          <h3>No videos in queue</h3>
          <p>Select multiple videos to start batch conversion</p>
        </div>
      )}
    </div>
  );
};

export default BatchUpload;