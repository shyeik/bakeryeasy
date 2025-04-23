import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = ({ onClose }) => {
  // Pass onClose as a prop to handle closing modal
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // State to store success message
  const [errorMessage, setErrorMessage] = useState(""); // State to store error message

  const handleClick = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:5000/register", {
        name,
        email,
        password,
      });
      console.log(result);
      setMessage("User Created Successfully!");
      setErrorMessage(""); // Clear error message on success
      // Clear the input fields after success
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.message || "User already exists."); // Set error message from server
      } else {
        setErrorMessage("An error occurred. Please try again."); // Generic error message
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <button
        onClick={onClose} // Close modal on clicking ×
        className="absolute top-4 right-4 text-gray-600 text-5xl w-16 h-16 hover:text-gray-800 flex items-center justify-center"
      >
        &times;
      </button>
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
        <section className="font-Roboto mt-4">
          <h1 className="text-center text-primary text-4xl mb-4">Register</h1>
          {message && (
            <p className="text-center text-green-600">{message}</p> // Conditionally rendering success message
          )}
          {errorMessage && (
            <p className="text-center text-red-600">{errorMessage}</p> // Conditionally rendering error message
          )}
          <form className="block max-w-xs mx-auto" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              autoComplete="off"
              name="name"
              value={name} // Controlled input
              onChange={(e) => setName(e.target.value)}
              required // Make it required
              className="mb-4 w-full border rounded-lg p-2"
            />
            <input
              type="email"
              placeholder="Email"
              autoComplete="off"
              name="email"
              value={email} // Controlled input
              onChange={(e) => setEmail(e.target.value)}
              required // Make it required
              className="mb-4 w-full border rounded-lg p-2"
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="off"
              name="password"
              value={password} // Controlled input
              onChange={(e) => setPassword(e.target.value)}
              required // Make it required
              className="mb-4 w-full border rounded-lg p-2"
            />
            <button
              className="font-Roboto bg-primary text-white justify-center w-full rounded-xl px-6 py-2"
              type="submit"
            >
              Register
            </button>
            <div className="my-4 text-center text-gray-500">
              or login with provider
            </div>
            <button className="flex gap-4 justify-center w-full text-gray-700 font-semibold border border-gray-500 rounded-xl px-6 py-2">
              <img src={"/google.png"} alt={""} width={24} height={24} />
              Login with Google
            </button>
            <button
              className="text-center ml-10 my-4 text-gray-500 border-t pt-4"
              onClick={handleClick}
            >
              Existing account?{" "}
              <Link to="/Login" className="underline">
                Login here &raquo;
              </Link>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
