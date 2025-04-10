import React, { useState } from 'react';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../credenciales';
import Alert from '../../Ui/Alert/Alert';
import '../menu/Menu.css';

const Menu = () => {
  const [alerta, setAlerta] = useState(null);
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setAlerta({ type: 'success', message: 'Sesión cerrada exitosamente' });
    } catch (error) {
      console.error('Error al cerrar sesión: ', error);
      setAlerta({ type: 'error', message: 'Error al cerrar sesión' });
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setAlerta({ type: 'error', message: 'Ingresa tu correo para recuperar la contraseña.' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setAlerta({ type: 'success', message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
    } catch (error) {
      console.error('Error al enviar el correo de recuperación: ', error);
      setAlerta({ type: 'error', message: 'Hubo un problema al enviar el correo. Verifica que esté bien escrito.' });
    }
  };

  return (
    <nav className="menu">
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`menu-list ${menuOpen ? 'open' : ''}`}>
        <li><a href="#" onClick={() => setMenuOpen(false)}>Inicio</a></li>
        <li><a href="#" onClick={() => setMenuOpen(false)}>Tiendas</a></li>
        <li><a href="#" onClick={() => setMenuOpen(false)}>Categorías</a></li>
        <li><a href="#" onClick={() => setMenuOpen(false)}>Productos</a></li>
        <li>
          <button onClick={() => { handleSignOut(); setMenuOpen(false); }}>
            Cerrar Sesión
          </button>
        </li>
        <li>
          <button onClick={() => { setEmail(auth.currentUser?.email || ''); setMenuOpen(false); }}>
            Recuperar Contraseña
          </button>
        </li>
      </ul>

      {alerta && (
        <Alert
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      {email && (
        <div className="password-reset">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo"
          />
          <button onClick={handlePasswordReset}>Enviar Correo de Recuperación</button>
        </div>
      )}
    </nav>
  );
};

export default Menu;
