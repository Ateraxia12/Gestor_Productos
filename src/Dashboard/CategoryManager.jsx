import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../credenciales';
import Alert from '../components/Ui/Alert/Alert';
import '../style/CategoryManager.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [alerta, setAlerta] = useState(null);

  const fetchCategories = async () => {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    setCategories(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) return;

    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategoryName,
        description: newCategoryDescription,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      fetchCategories();
      setAlerta({ type: 'success', message: 'Categoría agregada exitosamente' });
    } catch (error) {
      console.error('Error al agregar la categoría: ', error);
      setAlerta({ type: 'error', message: 'Error al agregar la categoría' });
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      fetchCategories();
      setAlerta({ type: 'success', message: 'Categoría eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar la categoría: ', error);
      setAlerta({ type: 'error', message: 'Error al eliminar la categoría' });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryId) return;

    try {
      const categoryRef = doc(db, 'categories', editingCategoryId);
      await updateDoc(categoryRef, {
        name: newCategoryName,
        description: newCategoryDescription,
      });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setEditingCategoryId(null);
      fetchCategories();
      setAlerta({ type: 'success', message: 'Categoría actualizada exitosamente' });
    } catch (error) {
      console.error('Error al actualizar la categoría: ', error);
      setAlerta({ type: 'error', message: 'Error al actualizar la categoría' });
    }
  };

  return (
    <div className="category-manager-container">
      <h2>Gestión de Categorías</h2>

      <ul className="category-list">
        {categories.map(category => (
          <li key={category.id} className="category-item">
            <strong>{category.name}</strong> - {category.description}
            <div className="btn-group">
              <button onClick={() => handleEditCategory(category)} className="btn-edit">Editar</button>
              <button onClick={() => handleDeleteCategory(category.id)} className="btn-delete">Eliminar</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="category-form">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nombre de la categoría"
          className="input-field"
        />
        <input
          type="text"
          value={newCategoryDescription}
          onChange={(e) => setNewCategoryDescription(e.target.value)}
          placeholder="Descripción de la categoría"
          className="input-field"
        />
        {editingCategoryId ? (
          <button onClick={handleUpdateCategory} className="btn btn-update">Actualizar Categoría</button>
        ) : (
          <button onClick={handleAddCategory} className="btn">Agregar Categoría</button>
        )}
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

export default CategoryManager;
