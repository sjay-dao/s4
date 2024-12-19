import React, { useState, useEffect } from 'react';
// import { collection, onSnapshot } from 'firebase/firestore';
// import db from '../services/firebase'; // Import the initialized db instance
import ProductForm from './ProductForm'; 

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isProductSubmitted, setIsProductSubmitted] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false); 

  const handleProductSubmit = () => {
    try {
        setIsProductSubmitted(true); // Set flag on submission
        setIsSaveSuccess(true); 
        setTimeout(() => {
          setIsSaveSuccess(false); 
        }, 3000); // Hide success message after 3 seconds
    } catch (error) { 
        console.log(error);
    }
  };

  useEffect(() => {
    if (isProductSubmitted) {
      // Re-fetch data after submission
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3001/api/products');
          const data = await response.json();
           // Extract the product object from the data
          const productData = Object.values(data)[0]; 
  
          setProducts(data); 
          console.log('Fetched products:', data); // Log the fetched data
          console.log(productData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      fetchData();
      setIsProductSubmitted(false); // Reset flag
    }
  }, [isProductSubmitted]); // Dependency on isProductSubmitted


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
         // Extract the product object from the data
        const productData = Object.values(data)[0]; 

        setProducts(data); 
        console.log('Fetched products:', data); // Log the fetched data
        console.log(productData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  //For Toggle Form when registering a new Product
  const [isFormVisible, setIsFormVisible] = useState(false); 

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible); 
  };

  const handleCancel = () => {
    setIsFormVisible(false); 
  };

  return (
    <div className="container mx-auto p-4"> 
      <h1 className="text-2xl font-bold mb-4">Product Dashboard</h1>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={toggleForm}
      >
        Add Product
      </button>
      {isFormVisible && <ProductForm onProductSubmit={handleProductSubmit} onCancel={handleCancel} />}

      {isSaveSuccess && (
        <div className="text-green-500 mt-2">
          Saving successful!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        { Object.entries(products).map(([key, product])  => (
          <div key={key} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-2">Name: {product.name}</h2>
            <p className="text-gray-600">Code Name: {product.code_name}</p>
            <p className="text-gray-600">Price: ₱{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;