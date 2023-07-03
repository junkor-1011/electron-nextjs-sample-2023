'use client';
import React, { useEffect } from 'react';

const Listener: React.FC = () => {
  useEffect(() => {
    window.electronAPI.addListenerExample((_event, message) => {
      console.log(message);
    });

    return () => {
      window.electronAPI.removeListenerExample();
    };
  }, []);

  return null;
};
export default Listener;
