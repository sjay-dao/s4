import React, { useState } from "react";
import axios from "axios";
// import QRCodeScanner from './BarCodeScanner'; // Assuming QrCodeScanner is in the same directory

const ProductForm = ({
  productData,
  onProductEdit,
  onProductSubmit,
  onCancel,
  videoRef,
}) => {
  const [name, setName] = useState(productData?.name || ""); // Pre-fill name
  const [codeName, setCodeName] = useState(productData?.code_name || ""); // Pre-fill code name
  const [price, setPrice] = useState(productData?.price || ""); // Pre-fill price
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(productData?.category || ""); // Pre-fill category

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        code_name: codeName,
        name: name,
        price: price,
        category: category,
      };
      const url_suffix = productData ? "/" + productData.uid : "";

      console.log("Suffix:" + url_suffix);
      const url =
        // `http://localhost:3001/api/products${url_suffix}` // for localhost
        `https://s4-api.onrender.com/api/products${url_suffix}`;
      const headers_ = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const method = productData ? "PUT" : "POST"; // Use PUT for editing, POST for creating
      const affix = method === "PUT" ? "edited" : "saved";

      console.log("Method:" + method);
      const response = await (method === "PUT"
        ? axios.put(url, data, headers_)
        : axios.post(url, data, headers_));

      console.log("Product " + affix + " successfully:" + response);
      // Handle success (e.g., clear form, display success message)
      setCodeName("");
      setName("");
      setPrice("");
      setCategory("");
      method === "PUT" ? onProductEdit() : onProductSubmit(); // Call the prop to notify Dashboard
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto"> 
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div> 
          <div className="relative w-full max-w-2xl max-h-screen overflow-y-auto"> 
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="codeName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code Name:
                </label>
                <input
                  type="text"
                  id="codeName"
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                  // readOnly // Make the input field read-only after scanning
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category:
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  <option value="">Select Category</option>
                  {/* Iterate over category options and set selected value */}
                  {Object.entries({
                    "Food & Beverages": "Food & Beverages",
                    "Personal Care": "Personal Care",
                    "Household Supplies": "Household Supplies",
                    Other: "Other",
                  }).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                      selected={category === value}
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-700"
                >
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
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
