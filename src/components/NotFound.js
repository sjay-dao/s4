import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops! Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <Link 
        to="/dashboard" 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Home
      </Link>
      <img 
        src="https://i.stack.imgur.com/69zG.jpg" 
        alt="Page Not Found Illustration" 
        className="mt-8" 
      /> 
    </div>
  );
};

export default NotFound;