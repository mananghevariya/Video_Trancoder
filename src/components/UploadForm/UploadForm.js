import React, { useState, useRef } from 'react';
import FormatSelector from '../FormatSelector/FormatSelector';
import ProgressBar from '../ProgressBar/ProgressBar';
import VideoEditor from '../VideoEditor/VideoEditor';
import VideoPreview from '../VideoPreview/VideoPreview';
import './UploadForm.css';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editedVideo, setEditedVideo] = useState(null);
  const [convertedVideo, setConvertedVideo] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowEditor(true);
    }
  };

  const handleEditorSave = (processedVideo) => {
    setEditedVideo(processedVideo);
    setShowEditor(false);
  };

  const handleEditorCancel = () => {
    setShowEditor(false);
    setSelectedFile(null);
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setProgress(0);

    // Simulate conversion process
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Create a mock converted file (in real app, this would come from backend)
          const convertedFile = new File(
            [selectedFile],
            `converted-${selectedFile.name.split('.')[0]}.${selectedFormat}`,
            { type: `video/${selectedFormat}` }
          );

          setConvertedVideo({
            file: convertedFile,
            info: {
              fileName: convertedFile.name,
              format: selectedFormat,
              fileSize: formatFileSize(convertedFile.size),
              filters: editedVideo?.filters,
              trim: editedVideo?.trim,
              duration: editedVideo?.duration
            }
          });

          setShowPreview(true);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (convertedVideo) {
      const url = URL.createObjectURL(convertedVideo.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = convertedVideo.info.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setConvertedVideo(null);
    setSelectedFile(null);
    setEditedVideo(null);
  };

  if (showEditor) {
    return (
      <VideoEditor
        videoFile={selectedFile}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    );
  }

  if (showPreview && convertedVideo) {
    return (
      <VideoPreview
        videoFile={convertedVideo.file}
        videoInfo={convertedVideo.info}
        onClose={handleClosePreview}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <div className="upload-form">
      <div className="upload-area">
        <input
          type="file"
          id="video-upload"
          accept="video/*"
          onChange={handleFileChange}
          className="file-input"
        />
        <label htmlFor="video-upload" className="upload-label">
          {selectedFile ? selectedFile.name : 'Choose video file'}
        </label>
      </div>

      {selectedFile && !showEditor && !showPreview && (
        <>
          <div className="edit-notice">
            <p>🎬 Video ready for editing! Click to enhance before conversion.</p>
            <button 
              onClick={() => setShowEditor(true)}
              className="btn btn-outline"
            >
              Open Editor
            </button>
          </div>

          <FormatSelector
            selectedFormat={selectedFormat}
            onFormatChange={handleFormatChange}
          />
          
          {isUploading && (
            <ProgressBar progress={progress} />
          )}

          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="btn btn-primary upload-btn"
          >
            {isUploading ? 'Processing...' : 'Convert Video'}
          </button>
        </>
      )}
    </div>
  );
};

export default UploadForm;