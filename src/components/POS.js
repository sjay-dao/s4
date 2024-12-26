import React, { useState, useEffect } from 'react';
// import Bills from './Bills'; 

function POS() {
  const [quantity, setQuantity] = useState(0);
  const categories = ['Food & Beverages', 'Personal Care', 'Household Supplies', 'Other', 'All'];
  const [products, setProducts] = useState([]); // State to store product data
  const [orders, setOrders] = useState([]);
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const handleOrderCount = (number) => {
    if (number === -1) {
      setQuantity(0); 
      setOrders([]);
      setTotal(0);
    } else {
      setQuantity((prevQuantity) => prevQuantity * 10 + number); 
    }
  };


   // Fetch products on component mount (assuming you have a product API endpoint)
   useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        'http://localhost:3001/api/products' // for localhost
        //  `https://s4-api.onrender.com/api/products`
        ); // Replace with your actual endpoint
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  //register order to prereceipt
  const handleOrderPunch = (product) => {
    // Create an order item 
    const orderItem = { 
        productId: product.id, 
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
    } catch (error) {
        console.error('Error saving order:', error);
        // Handle the error, e.g., display an error message to the user
    }
  };


  return (
    <div className="flex h-screen">
        
      {/* {isBillModalOpen && (
        <Bills onBillPaid={handleBillPaid} onClose={closeBillModal} total= {total}/> 
      )} */}
      <div className="w-3/4 p-4"> 
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <button 
              key={i} 
              onClick={() => handleOrderCount(i)} 
              className="flex items-center justify-center w-full h-12 bg-slate-700 hover:bg-slate-950 text-white font-bold rounded" 
            >
              {i}
            </button>
          ))}
          <button 
              key={-1} 
              onClick={() => handleOrderCount(-1)} 
              className="flex items-center justify-center w-full h-12 bg-orange-600 hover:bg-orange-900 text-white font-bold rounded" 
            >
              {"Clear"}
            </button>
        </div>
        <div className="grid grid-cols-5 gap-1 mt-2 "> 
          {categories.map((category, index) => (
            <button 
              key={index} 
              className="bg-gray-200 hover:bg-gray-300 text-center py-2 rounded sm:text-xs md:text-sm font-bold" 
            >
              {category}
            </button>
          ))}
        </div> 
        <div className="h-4/5 w-full overflow-y-auto overflow-x-hidden"> 
            <div className="grid grid-cols-10 gap-1 mt-1 ">
            {Object.entries(products).map(([key, product]) => (
                <button key={key} className="bg-white rounded shadow-md p-2 hover:bg-slate-400"
                onClick={() => handleOrderPunch(product)}
                >
                <p className="sm:text-xs lg:text-sm">{product.name}</p>
                </button>
            ))}
            </div>
        </div>
      </div>
      <div className="w-1/4 bg-gray-100 p-4"> 
        <div className="h-full overflow-y-auto"> 
          <h3 className="text-lg font-bold mb-2">Receipt</h3>
          <ul className="list-none  min-h-96 sm:text-xs">
            {orders.map((order, index) => (
             <li key={index} className="flex justify-between mb-1">
             <span className="flex items-center"> 
               {order.quantity.toString().padStart(2, '0')} {/* Pad quantity with leading zero */} 
               <span className="ml-1 ">{order.productName}</span> 
             </span>
             <span className="text-sm">₱{order.price * order.quantity}</span> 
           </li>
            ))}
          </ul>
          {orders.length > 0 && ( 
            <div>
              <p className="text-sm font-bold">Total:</p>
              <p className="text-lg font-bold">₱{orders.reduce((totl, order) => totl + (order.price * order.quantity), 0)}</p> 
            </div>
          )}
           {total !==0 && <button onClick={openBillModal} 
                className="flex items-center justify-center w-full h-12 bg-slate-700 hover:bg-slate-950 text-white font-bold rounded">
                Pay
            </button> }
        </div>
      </div>
    </div>
  );
}

export default POS;