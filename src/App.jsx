import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import About from "./components/Navbar/About";
import Hero from "./components/Layout/Hero";
import Contact from "./components/Navbar/Contact";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login/Login";
import Register from "./components/Login/Register";
import Header from "./components/Layout/Header";
import ProfileEdit from "./components/Pages/ProfileEdit";
import { AuthProvider } from "./components/Authcontext";
import { CartProvider } from "./components/CartContext";
import AddCart from "./components/baked/AddCart";

import CakeCustomizer from "./ThreeD/Customise/CakeCustomizer";
import LandingPage from "./components/Layout/LandingPage";
import OrderConfirmation from "./components/baked/OrderConfirmation";
import Order from "./components/baked/Order";
import Cake from "./components/Layout/Cake";
import Reward from "./components/Layout/Reward";

function App() {
  const userId = localStorage.getItem("id");
  return (
    <AuthProvider>
      <CartProvider>
        <div className="bg-secondary">
          <Header />

          <Routes>
            <Route path="/" element={<Navigate to="/hero" />} />

            <Route path="/hero" element={<Hero />} />

            <Route path="/about" element={<About />} />
            <Route path="/landingpage" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<AddCart />} />
            <Route path="/cake" element={<Cake />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order" element={<Order />} />
            <Route path="/reward" element={<Reward />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/profile/:userId" element={<ProfileEdit />} />
            <Route
              path="/customise"
              element={<CakeCustomizer userId={userId} />}
            />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
