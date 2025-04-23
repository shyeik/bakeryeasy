import React, { useState } from "react";
import { useCart } from "../CartContext";
import { motion } from "framer-motion";

const BakedItem = ({ title, description, price, image }) => {
  const { addToCart } = useCart();
  const [isFlying, setIsFlying] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleAddToCart = () => {
    const userId = localStorage.getItem("id");

    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    setIsButtonDisabled(true);
    setIsFlying(true);

    addToCart({
      userId,
      title,
      description,
      price,
      image,
      itemType: "standard",
      _id: title + "-" + price,
    });

    setTimeout(() => {
      setIsFlying(false);
      setIsButtonDisabled(false);
    }, 900);
  };

  return (
    <div className="bg-gray-200 hover:bg-white p-4 rounded-lg text-center flex flex-col justify-between h-full relative">
      {/* Original Image */}
      <img
        src={image}
        alt={title}
        className="w-60 h-50 mx-auto rounded-lg"
        width="240" // Replace with the actual width in pixels
        height="240" // Replace with the actual height in pixels
      />

      {/* Flying Image */}
      {isFlying && (
        <motion.img
          src={image}
          alt={title}
          initial={{ x: 50, y: -10, scale: 0 }}
          animate={{ x: 100, y: -100, scale: 1, opacity: 0 }}
          transition={{ duration: 0.9 }}
          className="absolute w-60 h-50"
          style={{ pointerEvents: "none", zIndex: 70 }}
          width="240" // Replace with the actual width in pixels
          height="240" // Replace with the actual height in pixels
        />
      )}

      <h4 className="font-semibold text-lg my-2">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
      <button
        onClick={handleAddToCart}
        className="bg-red-500 hover:bg-primary text-white mt-6 rounded-full px-6 py-2 w-full"
        disabled={isButtonDisabled}
      >
        {isButtonDisabled ? "Adding..." : `Add to cart ₱ ${price.toFixed(2)}`}
      </button>
    </div>
  );
};

export default BakedItem;
