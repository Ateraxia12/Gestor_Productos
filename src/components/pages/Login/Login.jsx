// src/components/Login/Login.js
import React, { useState } from 'react';
import '../Login/Login.css';
import imgUsuarios from '../../../assets/images/imgUsuarios.png';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  FacebookAuthProvider 
} from 'firebase/auth';
import { auth } from '../../../credenciales';
import Alert from '../../Ui/Alert/Alert';

const Login = () => {
  const [registrando, setRegistrando] = useState(false);
  const [alerta, setAlerta] = useState(null);

  const functAutenticacion = async (e) => {
    e.preventDefault();
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (registrando) {
      try {
        await createUserWithEmailAndPassword(auth, correo, contraseña);
        setAlerta({ type: 'success', message: '¡Registro exitoso! Ahora puedes iniciar sesión.' });
      } catch (error) {
        setAlerta({ type: 'error', message: 'Asegúrate que la contraseña tenga más de 8 caracteres.' });
      }
    } else {
      try {
        await signInWithEmailAndPassword(auth, correo, contraseña);
        setAlerta({ type: 'success', message: '¡Bienvenido de nuevo!' });
      } catch (error) {
        setAlerta({ type: 'error', message: 'El correo o la contraseña son incorrectos.' });
      }
    }
  };

  const recuperarContraseña = async () => {
    const email = document.getElementById('email').value;
    if (!email) {
      setAlerta({ type: 'error', message: 'Ingresa tu correo para recuperar la contraseña.' });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setAlerta({ type: 'success', message: 'Correo de recuperación enviado. Revisa tu bandeja de entrada.' });
    } catch (error) {
      setAlerta({ type: 'error', message: 'Hubo un problema al enviar el correo. Verifica que esté bien escrito.' });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAlerta({ type: 'success', message: '¡Bienvenido de nuevo!' });
    } catch (error) {
      setAlerta({ type: 'error', message: 'Hubo un problema al iniciar sesión con Google.' });
    }
  };

  const handleGitHubSignIn = async () => {
    const provider = new GithubAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAlerta({ type: 'success', message: '¡Bienvenido de nuevo!' });
    } catch (error) {
      setAlerta({ type: 'error', message: 'Hubo un problema al iniciar sesión con GitHub.' });
    }
  };

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAlerta({ type: 'success', message: '¡Bienvenido de nuevo!' });
    } catch (error) {
      setAlerta({ type: 'error', message: 'Hubo un problema al iniciar sesión con Facebook.' });
    }
  };

  return (
    <div className="divLogin">
      <div className="padreForm">
        <div>
          <h1>Este es el Login</h1>
          <img src={imgUsuarios} alt="Usuarios" className="imgUsuarios" />
        </div>
        <form className="divForm" onSubmit={functAutenticacion}>
          <input type="email" placeholder="Ingresar Email" className="Inputs" id="email" />
          <input type="password" placeholder="Ingresar tu contraseña" className="Inputs" id="password" />
          <button className="buttonLogin">
            {registrando ? "Regístrate" : "Inicia Sesión"}
          </button>
        </form>

        {!registrando && (
          <button className="buttonOlvido" onClick={recuperarContraseña}>
            ¿Olvidaste tu contraseña?
          </button>
        )}

        <div className="social-buttons">
          <button className="social-button google" onClick={handleGoogleSignIn}>
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" />
            Iniciar sesión con Google
          </button>
          <button className="social-button github" onClick={handleGitHubSignIn}>
            <img src="https://img.icons8.com/color/48/000000/github.png" alt="GitHub" />
            Iniciar sesión con GitHub
          </button>
          
        </div>

        <div className="divH4Button">
          <h4 className="h4">{registrando ? "Si ya tienes cuenta" : "No tienes cuenta"}</h4>
          <button onClick={() => setRegistrando(!registrando)} className="buttonRegistrate">
            {registrando ? "Inicia sesión" : "Regístrate"}
          </button>
        </div>
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

export default Login;