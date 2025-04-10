import React, { useEffect } from 'react';
import '../Alert/Alert.css';

const Alert = ({ type, message, onClose, duration = 4000 }) => {
  const alertClasses = `alert alert-${type}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // limpia el temporizador si se desmonta antes
  }, [onClose, duration]);

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={alertClasses} role="alert">
      <span>{icons[type]} {message}</span>
      <button type="button" className="close" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Alert;
