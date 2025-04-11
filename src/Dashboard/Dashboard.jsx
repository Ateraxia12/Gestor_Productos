// src/components/Dashboard/Dashboard.js
import React from 'react';
import StoreSelector from './StoreSelector';
import CategoryManager from './CategoryManager';
import ProductManager from './ProductManager';
import Menu from '../components/Layouts/menu/Menu';
import UserProfile from '../components/Layouts/UserProfile/UserProfile';
import '../style/Dashboard.css'

const Dashboard = () => {
  return (
    <div className="dashboard">
     
      <Menu />
      <h1 className='h1Micfor'> Bienvenido a el Gestor de Micfor </h1>
      <UserProfile />
      
      <StoreSelector />
      <CategoryManager />
      <ProductManager />
    </div>
  );
};

export default Dashboard;