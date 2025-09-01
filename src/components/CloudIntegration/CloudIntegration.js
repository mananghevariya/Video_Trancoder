import React, { useState } from 'react';
import { uploadToCloud } from '../../utils/cloud';
import { handleError } from '../../utils/errorHandler';
import './CloudIntegration.css';

const CloudIntegration = ({ file }) => {
  const [cloudUrl, setCloudUrl] = useState('');

  const handleUpload = async () => {
    try {
      const url = await uploadToCloud(file);
      setCloudUrl(url);
    } catch (error) {
      handleError(error, 'Cloud upload failed');
    }
  };

  return (
    <div className="cloud-integration">
      <button onClick={handleUpload}>Upload to Cloud</button>
      {cloudUrl && <p>Cloud URL: {cloudUrl}</p>}
    </div>
  );
};

export default CloudIntegration;