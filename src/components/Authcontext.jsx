import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure you install this: `npm install jwt-decode`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Check localStorage for an existing token to persist user state
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        return {
          id: decodedUser.id,
          name: decodedUser.name,
          email: decodedUser.email,
          token,
        };
      } catch (error) {
        console.error("Invalid token:", error);
        return null;
      }
    }
    return null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const navigate = useNavigate();

  const login = (token) => {
    try {
      const decodedUser = jwtDecode(token); // Decode JWT to retrieve user info
      const userData = {
        id: decodedUser.id,
        name: decodedUser.name,
        email: decodedUser.email,
        token,
      };

      setUser(userData);
      setIsAuthenticated(true);

      // Save the token in localStorage for persistence
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error decoding token:", error);
      logout(); // Clear any invalid state
    }
  };

  const logout = () => {
    setUser(null); // Clear user state
    setIsAuthenticated(false); // Update authentication state

    // Remove token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to landing or login page
    navigate("/landing");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
