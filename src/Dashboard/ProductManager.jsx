import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../credenciales';
import '../style/ProductManager.css';
import Alert from '../components/Ui/Alert/Alert';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductStore, setNewProductStore] = useState('');
  const [newProductBrand, setNewProductBrand] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [comparisonMonths, setComparisonMonths] = useState([]);
  const [fullPriceHistory, setFullPriceHistory] = useState([]);

  // Filtros activos
  const [filterName, setFilterName] = useState('');
  const [filterStore, setFilterStore] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  // Inputs temporales
  const [inputName, setInputName] = useState('');
  const [inputStore, setInputStore] = useState('');
  const [inputCategory, setInputCategory] = useState('');
  const [inputPriceMin, setInputPriceMin] = useState('');
  const [inputPriceMax, setInputPriceMax] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const [uniqueStores, setUniqueStores] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const fetchedProducts = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Inicializar priceHistory si no existe
        const priceHistory = data.priceHistory || [{ price: data.price || 0, date: new Date().toISOString() }];
        return {
          id: doc.id,
          ...data,
          priceHistory,
        };
      });
      setProducts(fetchedProducts);
      const stores = [...new Set(fetchedProducts.map(p => p.store))];
      setUniqueStores(stores);
    };
    fetchProducts();
  }, []);

  const handleAddProduct = useCallback(async () => {
    if (!newProductName || !newProductDescription || !newProductPrice || !newProductCategory || !newProductStore || !newProductBrand || !newProductUnit) {
      setAlert({ type: 'error', message: 'Todos los campos son obligatorios.' });
      return;
    }

    try {
      const price = parseFloat(newProductPrice);
      const priceHistory = [{ price, date: new Date().toISOString() }];
      const productRef = await addDoc(collection(db, 'products'), {
        name: newProductName,
        description: newProductDescription,
        price,
        category: newProductCategory,
        store: newProductStore,
        brand: newProductBrand,
        unit: newProductUnit,
        priceHistory,
      });
      const newProduct = {
        id: productRef.id,
        name: newProductName,
        description: newProductDescription,
        price,
        category: newProductCategory,
        store: newProductStore,
        brand: newProductBrand,
        unit: newProductUnit,
        priceHistory,
      };
      setProducts(prevProducts => [...prevProducts, newProduct]);
      setNewProductName('');
      setNewProductDescription('');
      setNewProductPrice('');
      setNewProductCategory('');
      setNewProductStore('');
      setNewProductBrand('');
      setNewProductUnit('');
      setAlert({ type: 'success', message: 'Producto agregado correctamente.' });
    } catch (error) {
      console.error('Error al agregar el producto: ', error);
      setAlert({ type: 'error', message: 'Error al agregar el producto.' });
    }
  }, [newProductName, newProductDescription, newProductPrice, newProductCategory, newProductStore, newProductBrand, newProductUnit]);

  const handleUpdateProduct = useCallback(async () => {
    if (!newProductName || !newProductDescription || !newProductPrice || !newProductCategory || !newProductStore || !newProductBrand || !newProductUnit) {
      setAlert({ type: 'error', message: 'Todos los campos son obligatorios.' });
      return;
    }

    try {
      const price = parseFloat(newProductPrice);
      const currentProduct = products.find(p => p.id === editingProductId);
      const currentPriceHistory = currentProduct.priceHistory || [];
      const lastPriceEntry = currentPriceHistory.length > 0 ? currentPriceHistory[currentPriceHistory.length - 1] : null;
      
      // Determinar si se debe añadir una nueva entrada
      let updatedPriceHistory = [...currentPriceHistory];
      if (!lastPriceEntry || lastPriceEntry.price !== price) {
        updatedPriceHistory = [...currentPriceHistory, { price, date: new Date().toISOString() }];
      }

      const productRef = doc(db, 'products', editingProductId);
      await updateDoc(productRef, {
        name: newProductName,
        description: newProductDescription,
        price,
        category: newProductCategory,
        store: newProductStore,
        brand: newProductBrand,
        unit: newProductUnit,
        priceHistory: updatedPriceHistory,
      });
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === editingProductId
            ? {
                ...product,
                name: newProductName,
                description: newProductDescription,
                price,
                category: newProductCategory,
                store: newProductStore,
                brand: newProductBrand,
                unit: newProductUnit,
                priceHistory: updatedPriceHistory,
              }
            : product
        )
      );
      setEditingProductId(null);
      setNewProductName('');
      setNewProductDescription('');
      setNewProductPrice('');
      setNewProductCategory('');
      setNewProductStore('');
      setNewProductBrand('');
      setNewProductUnit('');
      setAlert({ type: 'success', message: 'Producto actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar el producto: ', error);
      setAlert({ type: 'error', message: 'Error al actualizar el producto.' });
    }
  }, [editingProductId, newProductName, newProductDescription, newProductPrice, newProductCategory, newProductStore, newProductBrand, newProductUnit, products]);

  const handleEditProduct = useCallback((product) => {
    setEditingProductId(product.id);
    setNewProductName(product.name);
    setNewProductDescription(product.description);
    setNewProductPrice(product.price.toString());
    setNewProductCategory(product.category);
    setNewProductStore(product.store);
    setNewProductBrand(product.brand || '');
    setNewProductUnit(product.unit || '');
  }, []);

  const handleDeleteProduct = useCallback(async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
      setAlert({ type: 'success', message: 'Producto eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar el producto: ', error);
      setAlert({ type: 'error', message: 'Error al eliminar el producto.' });
    }
  }, []);

  const calculatePrice = useCallback((price, quantity) => {
    return (price * quantity).toFixed(2);
  }, []);

  const filteredProducts = useMemo(() => products.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(filterName.toLowerCase());
    const storeMatch = product.store.toLowerCase().includes(filterStore.toLowerCase());
    const categoryMatch = product.category.toLowerCase().includes(filterCategory.toLowerCase());
    const priceMatch = (
      (!filterPriceMin || product.price >= parseFloat(filterPriceMin)) &&
      (!filterPriceMax || product.price <= parseFloat(filterPriceMax))
    );
    const selectedStoreMatch = selectedStore ? product.store === selectedStore : true;
    return nameMatch && storeMatch && categoryMatch && priceMatch && selectedStoreMatch;
  }), [products, filterName, filterStore, filterCategory, filterPriceMin, filterPriceMax, selectedStore]);

  const clearFilters = useCallback(() => {
    setFilterName('');
    setFilterStore('');
    setFilterCategory('');
    setFilterPriceMin('');
    setFilterPriceMax('');
    setSelectedStore('');
    setInputName('');
    setInputStore('');
    setInputCategory('');
    setInputPriceMin('');
    setInputPriceMax('');
  }, []);

  const closeAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const comparePricesByMonth = useCallback(() => {
    if (!selectedProductId) {
      setAlert({ type: 'error', message: 'Selecciona un producto para comparar.' });
      return;
    }
    const product = products.find(p => p.id === selectedProductId);
    if (!product || !product.priceHistory || product.priceHistory.length === 0) {
      setAlert({ type: 'error', message: 'No hay historial de precios para este producto.' });
      return;
    }

    // Guardar el historial completo
    setFullPriceHistory(product.priceHistory);

    // Agrupar precios por mes, tomando el precio más reciente
    const monthlyPrices = product.priceHistory.reduce((acc, entry) => {
      const date = new Date(entry.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      acc[monthYear] = { price: entry.price, date: entry.date }; // Último precio del mes
      return acc;
    }, {});

    // Convertir a un arreglo ordenado por fecha
    const comparisonData = Object.keys(monthlyPrices)
      .map(key => ({
        month: key,
        price: monthlyPrices[key].price,
        date: monthlyPrices[key].date,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setComparisonMonths(comparisonData);
  }, [selectedProductId, products]);

  return (
    <div className="product-manager">
      <h2>Gestión de Productos</h2>

      {alert && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}

      <div className="filters">
        <h3>Filtros individuales</h3>
        <div>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="Nombre del producto"
          />
          <button onClick={() => setFilterName(inputName)}>Buscar</button>
        </div>
        <div>
          <input
            type="text"
            value={inputStore}
            onChange={(e) => setInputStore(e.target.value)}
            placeholder="Tienda del producto"
          />
          <button onClick={() => setFilterStore(inputStore)}>Buscar</button>
        </div>
        <div>
          <input
            type="text"
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value)}
            placeholder="Categoría del producto"
          />
          <button onClick={() => setFilterCategory(inputCategory)}>Buscar</button>
        </div>
        <div>
          <input
            type="number"
            value={inputPriceMin}
            onChange={(e) => setInputPriceMin(e.target.value)}
            placeholder="Precio mínimo"
          />
          <button onClick={() => setFilterPriceMin(inputPriceMin)}>Buscar</button>
        </div>
        <div>
          <input
            type="number"
            value={inputPriceMax}
            onChange={(e) => setInputPriceMax(e.target.value)}
            placeholder="Precio máximo"
          />
          <button onClick={() => setFilterPriceMax(inputPriceMax)}>Buscar</button>
        </div>
        <div>
          <label>Filtrar por tienda:</label>
          <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)}>
            <option value="">-- Todas las tiendas --</option>
            {uniqueStores.map((store, index) => (
              <option key={index} value={store}>{store}</option>
            ))}
          </select>
        </div>
        <button onClick={clearFilters}>Ver todos los productos</button>
      </div>

      <div className="product-list">
        <h3>Lista de Productos</h3>
        <ul>
          {filteredProducts.map(product => (
            <li key={product.id} className="product-item">
              <div className="product-details">
                <h4>{product.name}</h4>
                <p><strong>Precio:</strong> ${product.price}</p>
                <p><strong>Categoría:</strong> {product.category}</p>
                <p><strong>Tienda:</strong> {product.store}</p>
                <p><strong>Marca:</strong> {product.brand}</p>
                <p><strong>Unidad de Medida:</strong> {product.unit}</p>
              </div>
              <div className="product-actions">
                <button onClick={() => handleEditProduct(product)}>Editar</button>
                <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="product-form">
        <h3>Agregar/Editar Producto</h3>
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Nombre del producto"
        />
        <input
          type="text"
          value={newProductDescription}
          onChange={(e) => setNewProductDescription(e.target.value)}
          placeholder="Descripción"
        />
        <input
          type="number"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
          placeholder="Precio"
          step="0.01"
        />
        <input
          type="text"
          value={newProductCategory}
          onChange={(e) => setNewProductCategory(e.target.value)}
          placeholder="Categoría"
        />
        <div>
          <label>Tienda:</label>
          <select
            value={newProductStore}
            onChange={(e) => setNewProductStore(e.target.value)}
            placeholder="Tienda"
          >
            <option value="">-- Selecciona una tienda --</option>
            {uniqueStores.map((store, index) => (
              <option key={index} value={store}>{store}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          value={newProductBrand}
          onChange={(e) => setNewProductBrand(e.target.value)}
          placeholder="Marca"
        />
        <input
          type="text"
          value={newProductUnit}
          onChange={(e) => setNewProductUnit(e.target.value)}
          placeholder="Unidad de Medida"
        />
        <button onClick={editingProductId ? handleUpdateProduct : handleAddProduct}>
          {editingProductId ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
      </div>

      <div className="price-comparison">
        <h3>Comparar Precios por Mes</h3>
        <div>
          <label>Seleccionar producto:</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="">-- Selecciona un producto --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={comparePricesByMonth}>Comparar Precios</button>
        
        {fullPriceHistory.length > 0 && (
          <div className="full-history">
            <h4>Historial Completo de Precios</h4>
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {fullPriceHistory.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.date).toLocaleString()}</td>
                    <td>${entry.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {comparisonMonths.length > 0 && (
          <div className="comparison-results">
            <h4>Precios por Mes</h4>
            <table>
              <thead>
                <tr>
                  <th>Mes</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMonths.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.month}</td>
                    <td>${entry.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="price-calculation">
        <h3>Calcular precio por cantidad</h3>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Cantidad"
          min="1"
        />
        {filteredProducts.map(product => (
          <div key={product.id}>
            <span>{product.name}: ${calculatePrice(product.price, quantity)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;