import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../credenciales';
import '../style/StoreSelector.css';

const StoreSelector = () => {
  const [stores, setStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [newStoreLocation, setNewStoreLocation] = useState('');
  const [editingStore, setEditingStore] = useState(null); // objeto con id, name y location

  const fetchStores = async () => {
    const querySnapshot = await getDocs(collection(db, 'stores'));
    setStores(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleAddStore = async () => {
    if (!newStoreName.trim() || !newStoreLocation.trim()) return;

    try {
      await addDoc(collection(db, 'stores'), {
        name: newStoreName,
        location: newStoreLocation,
      });
      setNewStoreName('');
      setNewStoreLocation('');
      fetchStores();
    } catch (error) {
      console.error('Error al agregar la tienda: ', error);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      await deleteDoc(doc(db, 'stores', id));
      fetchStores();
    } catch (error) {
      console.error('Error al eliminar la tienda:', error);
    }
  };

  const handleEditStore = (store) => {
    setEditingStore({ ...store });
  };

  const handleSaveEdit = async () => {
    if (!editingStore.name.trim() || !editingStore.location.trim()) return;

    try {
      const storeRef = doc(db, 'stores', editingStore.id);
      await updateDoc(storeRef, {
        name: editingStore.name,
        location: editingStore.location,
      });
      setEditingStore(null);
      fetchStores();
    } catch (error) {
      console.error('Error al actualizar la tienda:', error);
    }
  };

  return (
    <div className="store-selector-container">
      <h2>Tiendas</h2>

      <ul className="store-list">
        {stores.map(store => (
          <li key={store.id} className="store-item">
            {editingStore?.id === store.id ? (
              <div className="edit-section">
                <input
                className='nombreTienda'
                  type="text"
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                />
                <input
                  type="text"
                  value={editingStore.location}
                  onChange={(e) => setEditingStore({ ...editingStore, location: e.target.value })}
                />
                <button onClick={handleSaveEdit}>Guardar</button>
                <button onClick={() => setEditingStore(null)}>Cancelar</button>
              </div>
            ) : (
              <>
                <span className="store-name">{store.name}</span>
                <span className="store-location">{store.location}</span>
                <div className="store-actions">
                  <button className="edit-btn" onClick={() => handleEditStore(store)}>Editar</button>
                  <button className="delete-btn" onClick={() => handleDeleteStore(store.id)}>Eliminar</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="store-form">
        <input
          type="text"
          value={newStoreName}
          onChange={(e) => setNewStoreName(e.target.value)}
          placeholder="Nombre de la tienda"
        />
        <input
          type="text"
          value={newStoreLocation}
          onChange={(e) => setNewStoreLocation(e.target.value)}
          placeholder="Ubicación de la tienda"
        />
        <button onClick={handleAddStore}>Agregar Tienda</button>
      </div>
    </div>
  );
};

export default StoreSelector;
