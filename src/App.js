// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; // Import your Dashboard component
import NotFound from './components/NotFound'; 
import BarcodeScannerC from './components/BarCodeScanner';
import POS from './components/POS';
// import Inventory from './components/Inventory'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/scanner" element={<BarcodeScannerC />} /> 
        {/* <Route path="/inventory" element={<Inventory />} />  */}
        <Route path="/pos" element={<POS />} /> 
        <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
      </Routes>
    </Router>
  );
}

export default App;
