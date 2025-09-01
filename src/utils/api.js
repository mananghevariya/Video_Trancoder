import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const uploadVideo = async (file, format, onProgress) => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('format', format);

  try {
    const response = await api.post('/upload', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Upload failed: ' + error.message);
  }
};

export const getConvertedVideos = async () => {
  try {
    const response = await api.get('/videos');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch videos: ' + error.message);
  }
};

export const downloadVideo = async (videoId) => {
  try {
    const response = await api.get(`/download/${videoId}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    throw new Error('Download failed: ' + error.message);
  }
};