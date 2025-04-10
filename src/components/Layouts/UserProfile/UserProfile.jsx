// src/components/UserProfile/UserProfile.js
import React, { useState, useEffect } from 'react';
import { auth } from '../../..//credenciales';
import { updateProfile, updateEmail } from 'firebase/auth';
import Alert from '../../Ui/Alert/Alert';
import '../UserProfile/UserProfile.css'


const UserProfile = () => {
  const [displayName, setDisplayName] = useState(auth.currentUser?.displayName || '');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    setDisplayName(auth.currentUser?.displayName || '');
    setEmail(auth.currentUser?.email || '');
  }, [auth.currentUser]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      setAlerta({ type: 'success', message: 'Perfil actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar el perfil: ', error);
      setAlerta({ type: 'error', message: 'Error al actualizar el perfil' });
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail);
      setAlerta({ type: 'success', message: 'Correo actualizado exitosamente' });
      setEmail(newEmail);
      setNewEmail('');
    } catch (error) {
      console.error('Error al actualizar el correo: ', error);
      setAlerta({ type: 'error', message: 'Error al actualizar el correo' });
    }
  };

  return (
    <div className="user-profile">
      <h2>Perfil del Usuario</h2>
      <div>
        <label>Nombre:</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Nombre"
        />
        <button onClick={handleUpdateProfile}>Actualizar Nombre</button>
      </div>
      <div>
        <label>Correo Actual:</label>
        <span>{email}</span>
      </div>
      <div>
        <label>Nuevo Correo:</label>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Nuevo Correo"
        />
        <button onClick={handleUpdateEmail}>Actualizar Correo</button>
      </div>
      {alerta && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}
    </div>
  );
};

export default UserProfile;