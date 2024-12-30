import React, { useState, useEffect } from 'react';
import { 
    Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td
  } from '@chakra-ui/react'; // Using Chakra UI for basic table styling
import FilterBar from './FilterBar'; // Assuming FilterBar.js is in the same directory

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    // Fetch initial data from the API (replace with your API endpoint)
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products'); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) => {
      // Apply search filter
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Apply other filters (category, price range, availability)

    const sorted = [...filtered].sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name) * -1;
      if (sortOption === 'price-asc') return a.price - b.price;
      if (sortOption === 'price-desc') return b.price - a.price;
      // ... other sort options
      return 0;
    });

    setFilteredProducts(sorted);
  }, [products, searchTerm, sortOption, /* other filter state variables */]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  // ... (FilterBar component with filter logic)
  const handleFilterChange = (filters) => {
    const { category, priceRange, availability } = filters;
  
    const filteredProducts = products.filter((product) => {
      let matchesCategory = true;
      let matchesPrice = true;
      let matchesAvailability = true;
  
      if (category) {
        matchesCategory = product.category === category; 
      }
  
      if (priceRange.min || priceRange.max) {
        const productPrice = parseFloat(product.price);
        matchesPrice = 
          (!priceRange.min || productPrice >= parseFloat(priceRange.min)) && 
          (!priceRange.max || productPrice <= parseFloat(priceRange.max));
      }
  
      if (availability) {
        matchesAvailability = 
          availability === 'in-stock' 
            ? product.quantity > 0 
            : product.quantity === 0; 
      }
  
      return matchesCategory && matchesPrice && matchesAvailability;
    });
  
    setFilteredProducts(filteredProducts);
  };
  return (
    <div className="container mx-auto p-4"> 
      <h1 className="text-2xl font-bold mb-4 text-center">Inventory</h1>

      <div className="flex flex-col md:flex-row mb-4">
        <div className="flex-1 mr-4"> 
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
        </div>
        <div className="flex-1">
          <SortDropdown sortOption={sortOption} onSortChange={handleSortChange} />
        </div>
      </div>

      <FilterBar onFilterChange={handleFilterChange} /> 

      <div className="overflow-x-auto"> 
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>SKU</Th>
              <Th>Description</Th>
              <Th>Price</Th>
              <Th>Quantity</Th>
              {/* ... other columns */}
            </Tr>
          </Thead>
          <Tbody>
            {filteredProducts.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.sku}</Td>
                <Td>{product.description}</Td>
                <Td>${product.price.toFixed(2)}</Td>
                <Td>{product.quantity}</Td>
                {/* ... other columns */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
};

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={onSearchChange}
      />
    </div>
  );
};

const SortDropdown = ({ sortOption, onSortChange }) => {
  return (
    <div>
      <select value={sortOption} onChange={onSortChange}>
        <option value="">None</option>
        <option value="name-asc">Name (Ascending)</option>
        <option value="name-desc">Name (Descending)</option>
        <option value="price-asc">Price (Ascending)</option>
        <option value="price-desc">Price (Descending)</option>
        {/* ... other sort options */}
      </select>
    </div>
  );
};

const ProductTable = ({ products }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>SKU</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          {/* ... other columns */}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.description}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>{product.quantity}</td>
            {/* ... other columns */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Inventory;