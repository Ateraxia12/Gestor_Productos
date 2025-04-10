import React, { useState, useEffect } from 'react';
import Login from './components/pages/Login/Login'
import Dashboard from './Dashboard/Dashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './credenciales';
import './App.css'
const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      {user ? <Dashboard /> : <Login />}
    </div>
  );
};

export default App;