// src/components/Layouts/menu/Menu.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <div
        className={`menu-toggle ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`menu-list ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link></li>
        <li><Link to="/tiendas" onClick={() => setMenuOpen(false)}>Tiendas</Link></li>
        <li><Link to="/categorias" onClick={() => setMenuOpen(false)}>Categorías</Link></li>
        <li><Link to="/productos" onClick={() => setMenuOpen(false)}>Productos</Link></li>
        <li><Link to="/contacto" onClick={() => setMenuOpen(false)}>Contacto</Link></li>
        <li><Link to="/perfil" onClick={() => setMenuOpen(false)}>Perfil</Link></li> {/* Nueva opción para el perfil */}
        <li>
          <button className='btnMenu' onClick={() => { handleSignOut(); setMenuOpen(false); }}>
            Cerrar Sesión
          </button>
        </li>
        <li>
          <button className='btnMenu' onClick={() => { setEmail(auth.currentUser?.email || ''); setMenuOpen(false); }}>
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