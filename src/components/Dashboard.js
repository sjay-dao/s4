import React, { useState, useEffect } from 'react';
import ProductForm from './ProductForm';
import Modal from './Modal'; // Import your Modal component here

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isProductSubmitted, setIsProductSubmitted] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false); 
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isEditingSuccess, setIsEditingSuccess] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(null); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [editingProductId, setEditingProductId] = useState(null); 
  
  const handleProductSubmit = () => {
    try {
      setIsProductSubmitted(true); 
      setIsSaveSuccess(true);
      setTimeout(() => {
        setIsSaveSuccess(false);
      }, 3000); 
    } catch (error) {
      console.log(error);
    }
  };


  const handleProductEdit = () => {
    try {
      setEditingProductId(null); 
      setIsEditingSuccess(true);
      setTimeout(() => {
        setIsEditingSuccess(false);
      }, 3000); 
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchData = async (searchQuery) => {
      try {
        const response = await fetch(
          // 'http://localhost:3001/api/products' // for localhost
           `https://s4-api.onrender.com/api/products`);
        const data = await response.json();

        // Modify data to add uid 
      const modifiedData = Object.entries(data).map(([key, product]) => ({
        ...product, 
        uid: key 
      }));

        if (isProductSubmitted) {
          setIsProductSubmitted(false); 
          setProducts(modifiedData);
        } else {
          const regex = new RegExp(searchQuery, 'i');
          setProducts(Object.values(modifiedData).filter((item) => regex.test(item.name)));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(query);
  }, [isProductSubmitted, query, isEditingSuccess]);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProductId(null);
  };

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  const handleDeleteProduct = (productId) => {
    console.log(products);
    setSelectedProductId(productId);
    setIsDeleteModalOpen(true); 
  };

  const confirmDeleteProduct = async () => {
    if (selectedProductId) {
      try {
        const response = await fetch(
          // `http://localhost:3001/api/products/${selectedProductId}` // for localhost
          `https://s4-api.onrender.com/api/products/${selectedProductId}`, {
          method: 'DELETE',
        });
        console.log(response);
        if (response.ok) {
          // Update the local state
          const updatedProducts = products.filter((product) => product.id !== selectedProductId);
          setProducts(updatedProducts);
          setSelectedProductId(null);
          setIsDeleteModalOpen(false);
          setIsProductSubmitted(true);
        } else {
          console.error('Error deleting product:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const cancelDelete = () => {
    setSelectedProductId(null);
    setIsDeleteModalOpen(false); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleSearch}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleForm}
      >
        Add Product
      </button>
      {(isFormVisible || editingProductId ) && <ProductForm 
          productData={products.find((product) => product.uid === editingProductId)} 
          onProductEdit={handleProductEdit} 
          onProductSubmit={handleProductSubmit} 
          onCancel={handleCancel} />}
      {isSaveSuccess && (
        <div className="text-green-500 mt-2">
          Saving successful!
        </div>
      )}
      {isEditingSuccess && (
        <div className="text-green-500 mt-2">
          Editing successful!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(products).map(([key, product]) => (
          <div key={key} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Name: {product.name}</h2>
            <p className="text-gray-600">Code Name: {product.code_name}</p>
            <p className="text-gray-600">Price: ₱{product.price}</p>
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" 
              onClick={() => setEditingProductId(product.uid)} 
            >Edit</button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleDeleteProduct(product.uid)} 
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {isDeleteModalOpen && ( 
        <Modal 
          title="Confirm Deletion" 
          message="Are you sure you want to delete this product?" 
          onConfirm={confirmDeleteProduct} 
          onCancel={cancelDelete} 
        />
      )}
    </div>
  );
};

export default Dashboard;