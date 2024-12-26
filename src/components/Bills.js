import React, { useState } from 'react';

const Bills = ({ onBillPaid, onClose, total }) => {
  const [billAmount, setBillAmount] = useState(0);
  const [change, setChange] = useState(0);

  const handleBillClick = (amount) => {
    setBillAmount(amount + billAmount);
    setChange(billAmount -  total); 

    console.log("Bill amount", billAmount);
    console.log(change);
  };

  const handleExactAmount = () => {
    setBillAmount(total); // Replace 100 with the actual order total
    setChange(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-1/2 max-w-xl"> 
        <h2 className="text-lg font-bold mb-4 text-center">Enter Bill Amount</h2>
        <div className="grid grid-cols-5 gap-2 mb-4"> 
          {[1000, 500, 200, 100, 50, 20, 10, 5, 2, 1].map((amount) => (
            <button 
              key={amount} 
              onClick={() => handleBillClick(amount)} 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-1 rounded sm:text-xs" 
            >
              ₱{amount}
            </button>
          ))}
        </div>
        <button 
          onClick={handleExactAmount} 
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mb-4" 
        >
          Exact Amount
        </button>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-bold">Total:</p> 
            <p className="text-lg font-bold">₱{total}</p> 
          </div>
          <div>
            <p className="text-sm font-bold">Amount Received:</p> 
            <p className="text-lg font-bold">₱{billAmount}</p> 
          </div>
          <div>
            <p className="text-sm font-bold">Change:</p> 
            <p className="text-lg font-bold">₱{billAmount===0?0:billAmount-total}</p> 
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded w-1/2 mt-4" 
        >
          Close
        </button>
        <button 
          onClick={onBillPaid} 
          className="bg-orange-400 hover:bg-orange-600 py-2 px-4 rounded mt-4 w-1/2">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Bills;