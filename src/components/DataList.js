import axios from 'axios';
import React, { useState, useEffect } from 'react';

const DataList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchDataFromFirebase = async () => {
      try {
        const snapshot = await get(child(dbRef, 'your-data-path')); 
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Process and set the data in your component's state
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error reading data from Firebase:', error);
      }
    };
    fetchDataFromFirebase();
  }, []);
  
  return (
    <div>Expression for DataList</div>
  )
};

export default DataList;