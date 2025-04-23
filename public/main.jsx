import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // This is fine if you prefer using .jsx
import "./index.css"; // Make sure you have this CSS file for global styles
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <App className="flex-grow" />
        <footer className="border-t p-8 text-center text-gray-500">
          &copy; Bakery Easy
        </footer>
      </div>
    </BrowserRouter>
  </StrictMode>
);
