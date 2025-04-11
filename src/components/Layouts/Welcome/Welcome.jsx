// src/components/Dashboard/Welcome.js
import React from 'react';
import { auth } from '../../../credenciales';
import '../Welcome/Welcome.css'
const Welcome = () => {
  const user = auth.currentUser;

  return (
    <div className="welcome-section">
      <h2>Bienvenido, {user ? user.displayName || user.email : 'Usuario'}</h2>
      <p>¡Gracias por usar el Gestor de Micfor!</p>
    </div>
  );
};

export default Welcome;