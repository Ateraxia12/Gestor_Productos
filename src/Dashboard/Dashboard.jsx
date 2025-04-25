import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StoreSelector from './StoreSelector';
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';
import Contact from '../Dashboard/Contact'; // Importar el nuevo componente de contacto
import UserProfile from '../components/Layouts/UserProfile/UserProfile';
import Menu from '../components/Layouts/menu/Menu';
import Welcome from '../components/Layouts/Welcome/Welcome';
import '../style/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Menu />
      <h1 className='h1Micfor'>Bienvenido a el Gestor de Micfor</h1>
      
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/tiendas" element={<StoreSelector />} />
        <Route path="/categorias" element={<CategoryManager />} />
        <Route path="/productos" element={<ProductManager />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/contacto" element={<Contact />} /> {/* Nueva ruta para contacto */}
      </Routes>
    </div>
  );
};

export default Dashboard;