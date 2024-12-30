import React, { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import Modal from "./Modal"; // Import your Modal component here
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [isProductSubmitted, setIsProductSubmitted] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [isEditingSuccess, setIsEditingSuccess] = useState(false);
  const [query, setQuery] = useState("");
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
          `https://s4-api.onrender.com/api/products`
        );
        const data = await response.json();

        // Modify data to add uid
        const modifiedData = Object.entries(data).map(([key, product]) => ({
          ...product,
          uid: key,
        }));
        //sort data in ascending
        const sortedData = modifiedData.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        });
        if (isProductSubmitted) {
          setIsProductSubmitted(false);
          setProducts(sortedData);
        } else {
          const regex = new RegExp(searchQuery, "i");
          setProducts(
            Object.values(modifiedData).filter((item) => regex.test(item.name))
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
          `https://s4-api.onrender.com/api/products/${selectedProductId}`,
          { method: "DELETE" }
        );
        console.log(response);
        if (response.ok) {
          // Update the local state
          const updatedProducts = products.filter(
            (product) => product.id !== selectedProductId
          );
          setProducts(updatedProducts);
          setSelectedProductId(null);
          setIsDeleteModalOpen(false);
          setIsProductSubmitted(true);
        } else {
          console.error("Error deleting product:", await response.text());
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const cancelDelete = () => {
    setSelectedProductId(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4 bg-slate-800 text-white">
        <h1 className="lg:text-3xl text-xs font-bold ml-7">
          {"Product Dashboard"}
        </h1>
        <Link
          to="/pos"
          className="text-gray-500 hover:text-gray-700 transition-colors duration-200 font-bold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth={2}
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      </div>
      <div className="container mx-auto p-2">
        <div class="flex items-center mb-2">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearch}
            class="flex-grow mr-4 lg:p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold lg:py-2 px-4 rounded"
            onClick={toggleForm}
          >
            Add Product
          </button>
        </div>
        {isSaveSuccess && (
          <div className="text-green-500 mt-2">Saving successful!</div>
        )}
        {isEditingSuccess && (
          <div className="text-green-500 mt-2">Editing successful!</div>
        )}
        {(isFormVisible || editingProductId) && (
          <ProductForm
            productData={products.find(
              (product) => product.uid === editingProductId
            )}
            onProductEdit={handleProductEdit}
            onProductSubmit={handleProductSubmit}
            onCancel={handleCancel}
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:text-xs">
          {Object.entries(products).map(([key, product]) => (
            <div key={key} className="bg-slate-100 rounded-lg shadow-md p-6">
              <h2 className="lg:text-lg font-semibold mb-2 sm:text-sm">
                Name: {product.name}
              </h2>
              <p className="lg:text-base text-gray-600">
                Code Name: {product.code_name}
              </p>
              <p className="lg:text-base text-gray-600">
                Price: ₱{product.price}
              </p>
              <button
                className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-1 px-2 w-1/2 rounded   sm:text-custom-size"
                onClick={() => setEditingProductId(product.uid)}
              >
                Edit
              </button>
              <button
                className="bg-red-700 hover:bg-red-900 text-white font-bold py-1 px-2 w-1/2 rounded sm:text-custom-size"
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
    </>
  );
};

export default Dashboard;
