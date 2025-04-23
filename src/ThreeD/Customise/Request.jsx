//Request.jsx
import React, { useState } from "react";
import Close from "../../assets/close.svg";

function RequestModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    request: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formData.request) {
      onSave(formData);
      onClose();
    } else {
      alert("Please fill out all fields.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white min-w-96 p-6 rounded-lg shadow-lg relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          onClick={onClose}
        >
          <img src={Close} alt="Close" className="w-6 h-6" />
        </button>

        <h1 className="text-lg font-bold text-pink-500 mb-4">
          Submit a Request
        </h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Request
          </label>
          <textarea
            name="request"
            value={formData.request}
            onChange={handleChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
            placeholder="Write your request here..."
          ></textarea>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-md bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestModal;
