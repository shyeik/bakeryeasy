import React, { useState } from "react";

const DiscountedItem = ({
  title,
  description,
  price,
  image,
  discountEligible,
  isSelected,
  onSelect,
  disabled, // Receive disabled prop
}) => {
  const [isFlying, setIsFlying] = useState(false);

  const handleClick = () => {
    if (disabled || !discountEligible) return; // Prevent action if disabled or not eligible
    onSelect(); // Trigger the parent handler for selection
  };

  return (
    <div className="bg-gray-200 hover:bg-white p-4 rounded-lg text-center flex flex-col relative">
      <img src={image} alt={title} className="w-60 h-50 mx-auto rounded-lg" />
      {isFlying && (
        <img
          src={image}
          alt={title}
          className="absolute w-60 h-50 transition-transform duration-900"
          style={{ pointerEvents: "none", zIndex: 70 }}
        />
      )}
      <h4 className="font-semibold text-lg my-2">{title}</h4>
      <p className="text-gray-500 text-sm">{description}</p>
      <button
        onClick={handleClick} // Call handleClick on button press
        disabled={disabled} // Disable button when required
        className={`mt-6 rounded-full px-6 py-2 w-full ${
          disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-red-500 text-white hover:bg-red-600"
        }`}
      >
        {isSelected
          ? "Offer Selected"
          : discountEligible
            ? `Select Offer ₱ ${(price * 0.1).toFixed(2)}`
            : "Not Eligible"}
      </button>
    </div>
  );
};

export default DiscountedItem;
