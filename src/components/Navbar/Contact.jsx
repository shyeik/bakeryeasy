import React from "react";

const Contact = () => {
  return (
    <div className="bg-pink-50 min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary text-center mb-6">
          Contact Us
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          We’d love to hear from you! Please fill out the form below or use the
          details provided to reach us.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="4"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-dark transition"
              >
                Send Message
              </button>
            </form>
          </div>
          {/* Contact Details */}
          <div className="flex flex-col justify-center gap-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Address</h2>
              <p className="text-gray-700">Sorsogon City, Sorsogon</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Phone</h2>
              <p className="text-gray-700">+63 954-4533-332</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Email</h2>
              <p className="text-gray-700">contact@bakeryeasy.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
