import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Back from "../../assets/back.svg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OrderConfirmation = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false); // State to toggle modal
  const [orderID, setOrderID] = useState(null);

  if (!orderDetails) {
    return <div>No order details found.</div>;
  }

  const date = new Date(orderDetails.pickupDateTime);
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);

  const handleGoBack = () => {
    navigate("/cart"); // Redirect to the cart page
  };

  const handleOrderConfirmation = async () => {
    const userId = localStorage.getItem("id"); // Get the user ID

    if (!userId || !orderDetails) {
      console.error("User or order details are missing");
      return;
    }

    try {
      // Post the order
      const orderResponse = await fetch(`${API_BASE_URL}/save-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          cartItems: orderDetails.cartItems,
          totalAmount: orderDetails.totalAmount,
          pickupDateTime: orderDetails.pickupDateTime,
          paymentMethod: orderDetails.paymentMethod,
          quantity: orderDetails.quantity,
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Failed to post order:", errorData.message);
        return;
      }

      const orderData = await orderResponse.json();
      console.log("Order posted successfully", orderData);

      // ✅ Store orderID from backend response
      setOrderID(orderData.orderID);

      // Clear the cart
      const clearCartResponse = await fetch(
        `${API_BASE_URL}/clear-cart/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (clearCartResponse.ok) {
        console.log("Cart cleared successfully");
        navigate("/hero"); // Redirect to the menu page
      } else {
        const errorData = await clearCartResponse.json();
        console.error("Failed to clear the cart:", errorData.message);
      }
    } catch (error) {
      console.error("Error during order confirmation:", error);
    }
  };

  return (
    <div
      className="p-4 md:w-1/2 w-full mx-auto mt-10 bg-transparent
     rounded-md shadow-md relative"
    >
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 text-gray-600 hover:text-black"
      >
        <img src={Back} alt="back" width={24} height={24} />
      </button>
      <div className="text-center border-b pb-2">
        <h1 className="text-2xl font-bold">Bakery Easy</h1>
        <p className="text-gray-600 text-sm">Sorsogon, Philippines</p>
      </div>
      <div className="border-b pb-2 mt-4">
        <p className="text-gray-600">
          Order Number: {orderID ? orderID : "Generating..."}
        </p>
        <p className="text-gray-600">Order Date: {formattedDate}</p>
      </div>
      <div className="mt-4">
        {orderDetails.cartItems.map((item) => (
          <div key={item._id} className="flex justify-between">
            <p className="text-sm">{item.title}</p>
            <p className="text-sm">₱{item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4 font-bold border-t pt-2">
        <p>Total:</p>
        <p>₱{orderDetails.totalAmount.toFixed(2)}</p>
      </div>
      <div className="mt-4 border-b pb-4">
        <p className="text-gray-600 text-sm">
          Pickup Date and Time: {formattedDate}
        </p>
        <p className="text-gray-600 text-sm">
          Order Quantity: {orderDetails.quantity}
        </p>
        <p className="text-gray-600 text-sm">
          Payment Method: {orderDetails.paymentMethod}
        </p>
      </div>
      <p className="text-center text-gray-600 text-xs mt-4">
        Thank you for your order!
      </p>
      <button
        onClick={() => setShowModal(true)} // Show confirmation modal
        className="mt-4 w-full bg-primary hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md"
      >
        Confirm Order
      </button>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-bold mb-4">Confirm Order</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to place this order?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleOrderConfirmation}
                className="bg-primary hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)} // Close the modal
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
