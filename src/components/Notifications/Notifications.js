import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setupNotifications } from '../../utils/notifications';
import './Notifications.css';

const Notifications = () => {
  useEffect(() => {
    setupNotifications((message) => {
      toast(message);
    });
  }, []);

  return <ToastContainer />;
};

export default Notifications;