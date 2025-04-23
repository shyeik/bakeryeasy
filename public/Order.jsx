import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useCart } from "../CartContext";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/orders/${userId}`
      );
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}`, {
        status: newStatus,
      });
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setFilteredOrders(
        filteredOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleBuyAgain = (order) => {
    console.log("Order object:", order);
    if (!order || !order.cartItems) {
      console.error("cartItems is undefined!", order);
      return;
    }

    order.cartItems.forEach((item) => {
      addToCart({
        userId: localStorage.getItem("id"),
        title: item.title,
        description: item.description,
        quantity: item.quantity,
        flavor: item.flavor,
        price: item.price,
        image: item.image,
        itemType: item.itemType,
      });
    });

    navigate("/cart");
  };

  const handleFilterChange = (status) => {
    setSelectedStatus(status);
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
  };

  const handleShowMore = (items) => {
    setSelectedOrderItems(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrderItems([]);
  };

  return (
    <div className="container mx-auto p-4 font-Roboto">
      <h1 className="text-2xl font-bold mb-4 text-pink-600">Orders</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="status-filter" className="font-medium mr-2">
          Filter by Status:
        </label>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Baking">Baking</option>
          <option value="Ready for Pickup">Ready for Pickup</option>
          <option value="Picked Up">Picked Up</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg shadow-lg bg-white overflow-hidden"
            >
              <div className="bg-gradient-to-r  from-pink-400 to-pink-500 p-4 text-white grid grid-cols-4 items-center gap-4">
                {/* Order Number */}
                <div>
                  <p className="text-xs font-roboto">Order Number:</p>
                  <p className="text-xs font-roboto">
                    #{order._id.slice(0, 7)}
                  </p>
                </div>

                {/* Pick up Time & Date */}
                <div>
                  <p className="text-xs font-roboto">Pick up Time & Date:</p>
                  <p className="text-xs font-roboto mr-4">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true, // Ensures AM/PM format
                    }).format(new Date(order.pickupDateTime))}
                  </p>
                </div>

                {/* Payment Method */}
                <div>
                  <p className="text-xs font-roboto">Payment Method:</p>
                  <p className="text-xs font-roboto">{order.paymentMethod}</p>
                </div>

                {/* Buy Again Button */}
                <div className="flex justify-end">
                  {order.status === "Picked Up" ? (
                    <button
                      onClick={() => handleBuyAgain(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-xs text-white font-semibold  py-2 px-4 rounded transition duration-300 ease-in-out"
                    >
                      Buy Again
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStatusChange(order._id, "Canceled")}
                      className={`py-2 px-4 rounded font-bold transition duration-300  text-xs ease-in-out ${
                        order.status === "Canceled" ||
                        order.status === "Baking" ||
                        order.status === "Ready for Pickup"
                          ? "bg-gray-200 border border-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 text-xs text-white"
                      }`}
                      disabled={
                        order.status === "Baking" ||
                        order.status === "Canceled" ||
                        order.status === "Ready for Pickup"
                      }
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 font-thin  relative">
                {/* Show More Button */}
                {order.cartItems.length > 1 && (
                  <button
                    onClick={() => handleShowMore(order.cartItems)}
                    className="absolute p-2 top-0 text-xs right-0 text-blue-500 hover:underline"
                  >
                    Show more ({order.cartItems.length - 1})
                  </button>
                )}

                {order.cartItems.slice(0, 1).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between mb-2"
                  >
                    <div className="flex text-xs items-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <p className="font-bold">{item.title}</p>
                    </div>
                    <p className="text-gray-700">x{item.quantity}</p>
                    <p className="font-roboto text-xs">
                      ₱ {item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 py-2 border-t border-pink-400">
                <p className="font-roboto text-xs text-red-500">
                  {order.status} {order.cancelreason}
                </p>
                <p className="font-roboto text-sm">₱ {order.totalAmount}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0  flex justify-center items-center">
          <div className=" p-6 bg-pink-200 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">Order Items</h2>
            {selectedOrderItems.map((item, index) => (
              <div key={index} className="flex text-xs items-center mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <p className="font-roboto">{item.title}</p>
                  <p className="text-xs text-gray-600">₱ {item.price}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs">x{item.quantity}</p>
                  <p className="font-roboto">₱ {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
            <button
              onClick={closeModal}
              className="mt-4 bg-pink-400 hover:bg-pink-500 text-white font-roboto py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
