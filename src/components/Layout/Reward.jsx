import React, { useEffect, useState } from "react";
import axios from "axios";
import DiscountedItem from "../baked/DiscountItem";
import ConfirmationModal from "./confirmationmodal/ConfirmationModal";
import { useCart } from "../CartContext";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Reward = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [status, setStatus] = useState("not active"); // Track the loyalty status
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [selectedDiscountedItem, setSelectedDiscountedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    const id = localStorage.getItem("id");
    setUserId(id);
    if (id) {
      fetchLoyaltyDetails(id);
    } else {
      setError("User is not authenticated. Please log in.");
    }
  }, []);

  const fetchLoyaltyDetails = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/loyalty/${id}`);
      setOrderCount(response.data.orderCount);
      setStatus(response.data.status); // Update loyalty status
    } catch (error) {
      console.error("Error fetching loyalty details:", error);
    }
  };

  useEffect(() => {
    const discountedItemInCart = cartItems.find(
      (item) => item.itemType === "discounted"
    );
    setSelectedDiscountedItem(
      discountedItemInCart ? discountedItemInCart.title : null
    );
  }, [cartItems]);

  const progress = Math.min((orderCount / 10) * 100, 100);
  const discountEligible = orderCount >= 10;

  const handleConfirmSelection = () => {
    if (pendingSelection) {
      const cartItem = {
        userId: localStorage.getItem("id"),
        title: pendingSelection,
        description: "A delicious treat just for you!",
        price: 1.0,
        image: "/Question.png",
        itemType: "discounted",
      };

      addToCart(cartItem);
      setSelectedDiscountedItem(pendingSelection);
      setPendingSelection(null);
      setShowModal(false);
    }
  };

  const handleCancelSelection = () => {
    setPendingSelection(null);
    setShowModal(false);
  };

  const handleSelectOffer = (item) => {
    setPendingSelection(item);
    setShowModal(true);
  };

  const isAnySelected = !!selectedDiscountedItem;

  return (
    <section className="w-full px-6 py-10">
      <div>
        <div className="w-full bg-white shadow-lg rounded-lg mb-10">
          <div className="bg-pink-500 p-6 text-center">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Your Loyalty Progress
            </h3>
            <p className="text-pink-100 text-sm">
              Earn rewards by completing more orders!
            </p>
          </div>
          <div className="p-6">
            {error ? (
              <p className="text-red-500 text-center text-lg">{error}</p>
            ) : (
              <>
                <div className="relative w-full bg-gray-200 rounded-full h-12 overflow-hidden mb-4">
                  <div
                    className="absolute top-0 left-0 h-full bg-pink-500 text-white text-sm font-medium flex items-center justify-center rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  >
                    {orderCount} Orders
                  </div>
                </div>
                <p className="text-center text-gray-600 text-lg">
                  Complete <span className="font-bold">10 orders</span> to
                  unlock a special offer!
                </p>
              </>
            )}
          </div>
        </div>

        <div className="w-full bg-white shadow-lg rounded-lg">
          <div className="bg-pink-500 p-6 text-center">
            <h3 className="text-2xl font-semibold text-white mb-2">
              Special Offers
            </h3>
            <p className="text-pink-100 text-sm">
              Select one discounted item if eligible!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {[
              "Special Birthday Cake",
              "Special Holiday Cake",
              "Special Anniversary Cake",
            ].map((item) => (
              <DiscountedItem
                key={item}
                title={item}
                description="A delicious treat just for you!"
                price={10}
                image="/Question.png"
                discountEligible={discountEligible}
                isSelected={selectedDiscountedItem === item}
                status={status} // Pass the status prop
                disabled={isAnySelected || status !== "active"} // Disable if already selected or not active
                onSelect={() => handleSelectOffer(item)}
              />
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showModal}
        onConfirm={handleConfirmSelection}
        onCancel={handleCancelSelection}
        message="Are you sure you want to select this offer? You cannot change it later."
      />
    </section>
  );
};

export default Reward;
