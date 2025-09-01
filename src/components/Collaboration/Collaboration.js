import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { handleError } from '../../utils/errorHandler';
import './Collaboration.css';

const socket = io('http://your-backend-url'); // Replace with your server

const Collaboration = ({ videoId }) => {
  const [sharedUsers, setSharedUsers] = useState([]);

  useEffect(() => {
    socket.on('userJoined', (user) => {
      setSharedUsers((prev) => [...prev, user]);
    });

    return () => socket.off('userJoined');
  }, []);

  const shareVideo = () => {
    try {
      socket.emit('shareVideo', { videoId });
    } catch (error) {
      handleError(error, 'Sharing failed');
    }
  };

  return (
    <div className="collaboration">
      <button onClick={shareVideo}>Share Video</button>
      <ul>
        {sharedUsers.map((user, i) => <li key={i}>{user}</li>)}
      </ul>
    </div>
  );
};

export default Collaboration;