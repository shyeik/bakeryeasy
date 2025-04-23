import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import BakedItem from "../baked/BakedItem";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Cake = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const categories = [
    { name: "All", image: "/all.png" },
    { name: "Birthday Cakes", image: "/happy.png" },
    { name: "Wedding Cakes", image: "/wedding.png" },
    { name: "Anniversary Cakes", image: "/anniv.png" },
    { name: "Holiday Cakes", image: "/holiday.png" },
  ];

  const fetchItems = async (category) => {
    try {
      const params = category !== "All" ? { category } : {};
      const response = await axios.get(`${API_BASE_URL}/items`, {
        params,
      });
      setItems(response.data.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const checkScrollable = () => {
      if (containerRef.current) {
        const { scrollWidth, clientWidth } = containerRef.current;
        const isOverflowing = scrollWidth > clientWidth;
        // You might want to use the isOverflowing state for styling purposes
      }
    };

    checkScrollable(); // Initial check
    window.addEventListener("resize", checkScrollable); // Check on resize
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const newX = e.pageX - containerRef.current.offsetLeft;
    const scrollAmount = newX - startX;
    containerRef.current.scrollLeft -= scrollAmount;
    setStartX(newX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="container mt-5 mx-auto px-4">
      <div className="relative mb-6">
        <div
          ref={containerRef}
          className="pl-14 flex overflow-x-auto whitespace-nowrap pr-10 px-4 scrollbar-hide touch-pan-x"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-8 py-4 rounded-lg border-2 border-primary bg-transparent flex flex-col items-center mr-6 min-w-[160px] max-w-[200px] ${
                selectedCategory === category.name
                  ? "bg-red-500 text-black font-semibold hover:bg-red-600"
                  : "bg-gray-200 text-gray-700 hover:bg-red-500"
              } transition duration-300`}
            >
              <img
                src={category.image}
                alt={category.name}
                width="150"
                height="150"
                className="w-14 h-14 object-cover rounded-full mb-2"
              />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 pt-20 lg:grid-cols-3 gap-4">
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
            No items found for this category.
          </p>
        )}
      </div>
    </div>
  );
};

export default Cake;


