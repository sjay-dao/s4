import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState('');

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    onFilterChange({ category: event.target.value });
  };

  const handlePriceRangeChange = (event) => {
    const { name, value } = event.target;
    setPriceRange({ ...priceRange, [name]: value });
    onFilterChange({ priceRange: { min: priceRange.min, max: priceRange.max } });
  };

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value);
    onFilterChange({ availability: event.target.value });
  };

  return (
    <div className="filter-bar">
      {/* Category Filter */}
      <div className="filter-group">
        <label htmlFor="category">Category:</label>
        <select 
          id="category" 
          value={categoryFilter} 
          onChange={handleCategoryChange}
        >
          <option value="">All</option>
          {/* Add your category options here */}
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="filter-group">
        <label htmlFor="minPrice">Price Range:</label>
        <input 
          type="number" 
          id="minPrice" 
          name="min" 
          value={priceRange.min} 
          onChange={handlePriceRangeChange} 
          placeholder="Min" 
        />
        <span>-</span>
        <input 
          type="number" 
          id="maxPrice" 
          name="max" 
          value={priceRange.max} 
          onChange={handlePriceRangeChange} 
          placeholder="Max" 
        />
      </div>

      {/* Availability Filter */}
      <div className="filter-group">
        <label htmlFor="availability">Availability:</label>
        <select 
          id="availability" 
          value={availability} 
          onChange={handleAvailabilityChange}
        >
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;