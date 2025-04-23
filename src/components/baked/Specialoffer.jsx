import React, { useState, useEffect } from "react";
import axios from "axios";
import DiscountedItem from "./DiscountItem";

const SpecialOffer = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/items");
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
            <DiscountedItem
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
            No special offers found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SpecialOffer;
