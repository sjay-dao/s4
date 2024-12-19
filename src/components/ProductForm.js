import React, { useState } from 'react';
import axios from 'axios';

const ProductForm = ({onProductSubmit, onCancel}) => {
  const [name, setName] = useState('');
  const [codeName, setCodeName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      const data = {
        // id: 1, // You might want to handle ID generation on the server
        code_name: e.target.codeName.value, 
        name: e.target.name.value, 
        price: parseFloat(e.target.price.value) // Convert price to a number
      };
  
      const response = await axios.post('http://localhost:3001/api/products', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Handle success (e.g., clear form, display success message)
      e.target.codeName.value = '';
      e.target.name.value = '';
      e.target.price.value = ''; 
      onProductSubmit(); // Call the prop to notify Dashboard
      console.log("It should succeed");
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full" 
          />
        </div>
        <div>
          <label htmlFor="codeName" className="block text-sm font-medium text-gray-700">
            Code Name:
          </label>
          <input 
            type="text" 
            id="codeName" 
            value={codeName} 
            onChange={(e) => setCodeName(e.target.value)} 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full" 
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price:
          </label>
          <input 
            type="number" 
            id="price" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full" 
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image:
          </label>
          <input 
            type="file" 
            id="image" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full" 
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
        <button 
          type="button" 
          className="bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ProductForm;