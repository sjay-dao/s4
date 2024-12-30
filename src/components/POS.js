import React, { useState, useEffect } from 'react';
import Bills from './Bills'; 
import { Link } from 'react-router-dom';

function POS() {
  const [quantity, setQuantity] = useState(0);
  const categories = ['Food & Beverages', 'Personal Care', 'Household Supplies', 'Other', 'All'];
  const [products, setProducts] = useState([]); // State to store product data
  const [productsOff, setProductsOff] = useState([]); // State to store product data during offline
  const [orders, setOrders] = useState([]);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState(''); // New state for search term
  const handleOrderCount = (number) => {
    if (number === -1) {
      setQuantity(0); 
      setOrders([]);
      setTotal(0);
    } else {
      setQuantity((prevQuantity) => prevQuantity * 10 + number); 
    }
  };
  const [selectedCategory, setSelectedCategory] = useState('All'); // State to track selected category


   // Fetch products on component mount 
   useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        // 'http://localhost:3001/api/products' // for localhost
         `https://s4-api.onrender.com/api/products`
        );
      const data = await response.json();
       // Modify data to add uid 
       const modifiedData = Object.entries(data).map(([key, product]) => ({
        ...product, 
        uid: key 
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

      
      
      setProducts(sortedData);
      setProductsOff(sortedData);
    };
    fetchProducts();
  }, []);


  //register order to prereceipt
  const handleOrderPunch = (product) => {
    // Create an order item 
    const orderItem = { 
        productId: product.uid, 
        productName: product.name, 
        price: product.price, 
        quantity: quantity===0?1:quantity 
      };
      
      setTotal(total + (orderItem.quantity*orderItem.price));
      // Add the order item to the orders array
      setOrders([...orders, orderItem]); 
  
      // Reset quantity after adding to order
      setQuantity(0); 
  };


  //bill modal
  const openBillModal = () => {
    console.log(total + " -  total");
    setIsBillModalOpen(true);
  };
  
  const closeBillModal = () => {
    setIsBillModalOpen(false);
  };

  const handleBillPaid = async () => { 
    try {
        const response = await fetch('http://localhost:3001/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                // Assuming you have order data in your component's state
                customerId: null, 
                orderItems: orders,
                datetime: new Date().toISOString()
            }),
        });
    
        if (!response.ok) {
        throw new Error('Failed to save order');
        }
    
        const data = await response.json();
        console.log('Order saved successfully:', data);
        setQuantity(0); 
        setOrders([]);
        setTotal(0);
        setIsBillModalOpen(false); 
        setSearchTerm('');
        setProducts(productsOff);
    } catch (error) {
        console.error('Error saving order:', error);
        // Handle the error, e.g., display an error message to the user
    }
  };

  //search feature
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase()); // Search term in lowercase
    console.log(event.target.value.toLowerCase());
    const regex = new RegExp(event.target.value.toLowerCase(), 'i');
    setProducts(Object.values(productsOff).filter((item) => regex.test(item.name)));
  };

  // Handle category filter
const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  
    if (category === 'All') {
      setProducts([...productsOff]); 
    } else {
      const filteredProducts = productsOff.filter(
        (product) => product.category === category
      );
      setProducts(filteredProducts);
    }
  };

  return (
    <div className="flex h-screen sm:text-xs">
      
      {isBillModalOpen && (
        <Bills onBillPaid={handleBillPaid} onClose={closeBillModal} total= {total}/> 
      )}
      <div className="w-3/4 p-4 bg-zinc-500">   
        <div className="grid grid-cols-12 gap-0.5">
        <Link 
            to="/dashboard" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-1 rounded ">
            Dashboard
        </Link>
          {Array.from({ length: 10 }, (_, i) => (
            <button 
              key={i} 
              onClick={() => handleOrderCount(i)} 
              className="flex items-center justify-center w-full h-12 bg-slate-100 hover:bg-slate-300 font-bold rounded" 
            >
              {i}
            </button>
          ))}
        <button 
              key={-1} 
              onClick={() => handleOrderCount(-1)} 
              className="flex items-center justify-center w-full h-12 bg-orange-600 hover:bg-orange-900 font-bold rounded" 
            >
              {"Void"}
        </button>
        </div>
        <div className="grid grid-cols-5 gap-1 mt-2">
            {categories.map((category, index) => (
                <button
                key={index}
                className={`bg-gray-200 hover:bg-gray-400 text-center sm:py-0.5 lg:py-2 lg:text-lg *:rounded sm:text-custom-size sm:text-tiny font-bold ${
                    selectedCategory === category ? 'bg-blue-950 text-white' : '' 
                }`}
                onClick={() => handleCategoryFilter(category)} 
                >
                {category}
                </button>
            ))}
        </div>
        <input
            type="text"
            placeholder="Search Products"
            className="w-full bg-gray-100 rounded my-1 sm:text-xs lg:py-2"
            value={searchTerm}
            onChange={handleSearch} // Added onChange handler
          />
        <div className="h-4/5 w-full overflow-y-auto overflow-x-hidden"> 
            <div className="grid lg:grid-cols-10 grid-cols-6 gap-1 mt-1 ">
            {Object.entries(products).map(([key, product]) => (
                <button key={key} className="bg-white rounded shadow-md lg:p-1 hover:bg-slate-400"
                onClick={() => handleOrderPunch(product)}
                >
                <p className="sm:text-custom-size lg:text-sm">{product.name}</p>
                </button>
            ))}
            </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-100 lg:p-4 p-1"> 
        <div className="h-full overflow-y-auto"> 
          <h3 className="lg:text-lg sm:text-sm font-bold  text-center">Punong Alatiris Retail Store</h3>
          <h5 className="text-custom-size mb-1 text-center m-0 p-0">Ciudad Adelina, Trece Martires, Cavite</h5>
          <ul className="list-none  min-h-20 lg:min-h-96 sm:text-custom-size lg:text-base">
            {orders.map((order, index) => (
             <li key={index} className="flex justify-between mb-1">
             <span className="flex items-center"> 
               {order.quantity.toString().padStart(2, '0')} {/* Pad quantity with leading zero */} 
               <span className="ml-1 ">{order.productName}</span> 
             </span>
             <span className="">₱{order.price * order.quantity}</span> 
           </li>
            ))}
          </ul>
          {orders.length > 0 && ( 
            <div>
              <p className="lg:text-sm sm:text-custom-size font-bold">Total:</p>
              <p className="lg:text-lg sm:text-sm font-bold">₱{orders.reduce((totl, order) => totl + (order.price * order.quantity), 0)}</p> 
            </div>
          )}
           {total !==0 && <button onClick={openBillModal} 
                className="flex items-center justify-center w-full lg:h-12 h-5 bg-slate-700 hover:bg-slate-950 text-white font-bold rounded">
                Pay
            </button> }
        </div>
      </div>
    </div>
  );
}

export default POS;