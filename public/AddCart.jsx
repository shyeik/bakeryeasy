import React, { useState, useEffect } from "react";
import { useCart } from "../CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import CakeRecom from "../Layout/CakeRecom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddCart = () => {
  const [showModal, setShowModal] = useState(false);
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [groupedCartItems, setGroupedCartItems] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const queryParams = new URLSearchParams(location.search);
  const paymentStatus = queryParams.get("status");

  // Calculate subtotal and total quantity
  const subtotal = groupedCartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalQuantity = groupedCartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );


  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const date = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };

  const handlePickupDateTimeChange = (e) => {
    const dateTime = e.target.value;
    if (isPickupDateTimeValid(dateTime)) {
      setPickupDateTime(dateTime);
      setShowModal(false); // Hide the modal if valid
    } else {
      setShowModal(true);
    }
  };

  const isPickupDateTimeValid = (dateTime) => {
    const selectedDateTime = new Date(dateTime);
    const now = new Date();
    const selectedHours = selectedDateTime.getHours();

    // Business hours: 6 AM to 10 PM (06:00 - 22:00)
    const isOutsideBusinessHours = selectedHours >= 22 || selectedHours < 6;

    return selectedDateTime >= now && !isOutsideBusinessHours;
  };

  // Group cart items by ID
  useEffect(() => {
    const grouped = cartItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i._id === item._id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        acc.push({ ...item, quantity: item.quantity || 1 });
      }
      return acc;
    }, []);
    setGroupedCartItems(grouped);
  }, [cartItems]);

  // Handle payment and validation
  const handlePayment = () => {
    if (!pickupDateTime || cartItems.length === 0) {
      setShowModal(true);
      return;
    }

    const userId = localStorage.getItem("id");
    if (!userId) {
      console.error("User is not authenticated");
      return;
    }

    const orderData = {
      userId,
      cartItems,
      totalAmount: subtotal,
      pickupDateTime,
      paymentMethod,
      quantity: totalQuantity,
    };

    navigate("/order-confirmation", {
      state: { orderDetails: orderData },
    });
  };

  const Paymongo = async () => {
    if (!pickupDateTime || cartItems.length === 0) {
      setShowModal(true);
      return;
    }

    const orderData = {
      userId: localStorage.getItem("id"),
      cartItems,
      totalAmount: subtotal,
      pickupDateTime,
      quantity: totalQuantity,
      paymentMethod: "paymongo",
      remarks: "Bakery Easy Payment",
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/create-payment-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      if (data.checkoutUrl) {
        const userId = localStorage.getItem("id");
        const clearCartResponse = await fetch(
          `${API_BASE_URL}/clear-cart/${userId}`,
          { method: "DELETE" }
        );

        if (clearCartResponse.ok) {
          clearCart();
        } else {
          const errorData = await clearCartResponse.json();
          console.error("Failed to clear the cart:", errorData.message);
          return;
        }

        window.location.href = data.checkoutUrl;
      } else {
        console.error("Failed to retrieve checkout URL:", data);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <div className="p-6 bg-transparent rounded-lg shadow-lg">
      {paymentStatus === "success" && (
        <div className="alert alert-success mb-4">Payment successful!</div>
      )}
      {paymentStatus === "failed" && (
        <div className="alert alert-danger mb-4">Payment failed.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/* Cart Items Section */}
<div className="bg-white p-4 rounded-lg shadow-md max-h-80 overflow-y-auto">
  <h2 className="text-2xl font-semibold mb-4 text-center sm:text-left">Cart</h2>
  {groupedCartItems.length > 0 ? (
    groupedCartItems.map((item) => (
      <div
        key={item._id}
        className="flex flex-col sm:flex-row items-center sm:items-start justify-between border-b pb-4 mb-4 space-y-4 sm:space-y-0"
      >
        {/* Image & Details */}
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <img
            src={item.image}
            alt={item.title}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-lg">{item.title}</h3>
            <p className="text-gray-500">
              ₱{item.price.toFixed(2)} x {item.quantity}
            </p>
          </div>
        </div>

        {/* Quantity & Remove Buttons */}
                {item.itemType !== "discounted" && (
                  <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-center sm:justify-end">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                      disabled={item.quantity === 0}
                      className={`p-2 rounded-md ${
                        item.quantity === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item._id)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded-md"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 ml-2 sm:ml-4"
                    >
                      Remove
                    </button>
                  </div>
                )}
      </div>
    ))
  ) : (
    <p className="text-gray-500 text-center">Your cart is empty.</p>
  )}
</div>

        {/* Order Summary Section */}
        <div className="bg-transparent p-5 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          <p className="font-semibold text-lg">Total: ₱{subtotal.toFixed(2)}</p>
          <div className="mt-4">
            <label htmlFor="pickupDateTime" className="block mb-2">
              Pickup Date and Time:
            </label>
            <input
              type="datetime-local"
              id="pickupDateTime"
              className="border border-gray-300 px-4 py-2 rounded-md w-full"
              value={pickupDateTime}
              onChange={handlePickupDateTimeChange}
              min={getMinDateTime()}
            />
          </div>

          <div className="mt-4">
            <h3 className="mb-2">Payment Method:</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="mr-2"
                />
                Cash on Pickup
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="paymongo"
                  checked={paymentMethod === "paymongo"}
                  onChange={() => setPaymentMethod("paymongo")}
                  className="mr-2"
                />
                GCash (via PayMongo)
              </label>
            </div>
          </div>

          <button
            onClick={() => {
              paymentMethod === "paymongo" ? Paymongo() : handlePayment();
            }}
            className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-md mt-4"
          >
            {paymentMethod === "paymongo"
              ? "Proceed to Paymongo"
              : "Place Order"}
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Action Required</h3>
              <button
                className="text-gray-500"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
            </div>
            <p className="text-gray-700">
              {cartItems.length === 0
                ? "Your cart is empty. Please add items to your cart before proceeding."
                : !pickupDateTime
                  ? "Please select a pickup date and time."
                  : "Invalid pickup time. Please choose a time between 6 AM and 10 PM."}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Baked Items Section */}
      <div className="mt-10">
        <h2 className="text-xl text-red-500 italic font-bold mb-5">
          COMPLETE YOUR PURCHASE
        </h2>
        <CakeRecom />
      </div>
    </div>
  );
};

export default AddCart;
