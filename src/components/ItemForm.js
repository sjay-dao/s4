import axios from 'axios';
import React, { useState } from 'react';

const ItemForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    try {
      await set(child(dbRef, 'your-data-path/' + Date.now()), { name });
      // Handle success
    } catch (error) {
      console.error('Error writing data to Firebase:', error);
    }
  };

  return (
    <div>Expression for ItemForms</div>
  );
};

export default ItemForm;