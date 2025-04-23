import React, { useState, useEffect } from "react";
import axios from "axios";
import BakedItem from "../baked/BakedItem";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CakeRecom = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/items`);
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="container mt-5 mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <BakedItem
              key={item._id}
              id={item._id}
              title={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No items found.
          </p>
        )}
      </div>
    </div>
  );
};

export default CakeRecom;
