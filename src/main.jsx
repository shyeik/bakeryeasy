import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // This is fine if you prefer using .jsx
import "./index.css"; // Make sure you have this CSS file for global styles
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div className="max-w-6xl mx-auto">
        <App />
        <footer className="border-t p-8 text-center text-gray-500 mt-16">
          &copy; Bakery Easy
        </footer>
      </div>
    </BrowserRouter>
  </StrictMode>
);
