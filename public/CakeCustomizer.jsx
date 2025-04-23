import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import CanvasContent from "../Customise/CanvasContent";
import ShapeSelection from "./ShapeSelection";
import LayerSelection from "./LayerSelection";
import ArrowDown from "../../assets/arrowdown.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Camera from "/camera.png";
import ProcedureModal from "./ProcedureModal";
import Procedure from "/procedure.png";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SuccessModal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
    <div className="bg-white p-6 rounded-lg shadow-lg border border-pink-300 text-center">
      <p className="text-red-600 font-ssans text-lg mb-4">{message}</p>
      <button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
      >
        Close
      </button>
    </div>
  </div>
);

const FinalizedCakeDetails = ({
  price,
  screenshot,
  onBack,
  onAddToCart,
  flavor,
  frosting,
  fillings,
}) => (
  <div className="w-full p-5 bg-white rounded-md shadow">
    <div className="flex flex-col md:flex-row md:items-center">
      {" "}
      {/* Flex container for layout */}
      {/* Left Side: Text Content */}
      <div className="md:w-1/2 md:pr-4">
        {" "}
        {/* Adjust width as needed */}
        <h1 className="text-2xl font-bold mb-4">Customize Cake Details</h1>
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">Flavor:</span>
            <span>{flavor || "No flavor selected"}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">Filling:</span>
            <span>{fillings || "No filling selected"}</span>
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold mr-2">Frosting:</span>
            <span>{frosting || "No frosting selected"}</span>
          </div>
        </div>
        <p className="text-xl font-bold">
          <span className="mr-2">Price:</span> ₱{price.toFixed(2)}
        </p>
      </div>
      {/* Right Side: Image */}
      <div className="md:w-1/2 mt-4 md:mt-0">
        {" "}
        {/* Adjust width as needed */}
        {screenshot && (
          <img
            src={screenshot}
            alt="Cake Screenshot"
            className="border border-gray-300 w-full rounded-md"
          />
        )}
      </div>
    </div>

    {/* Buttons */}
    <div className="mt-6 flex justify-between">
      <button
        onClick={onBack}
        className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded"
      >
        Back
      </button>
      <button
        onClick={onAddToCart}
        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
      >
        Add to Cart
      </button>
    </div>
  </div>
);

function CakeCustomizer({ userId }) {
  const [layer1, setLayer1] = useState("#f0a3a3");
  const [layer2, setLayer2] = useState("#d4a5a5");
  const [layer3, setLayer3] = useState("#c19a9a");
  const [greetingsText, setGreetingsText] = useState(
    "Happy Birthday\nYour Name"
  );
  const [fromText, setFromText] = useState("From: Your Name");
  const [textColor, setTextColor] = useState("#ffffff");
  const [numberOfLayers, setNumberOfLayers] = useState(2);
  const [currentShape, setCurrentShape] = useState("circle");
  const [price, setPrice] = useState(0);
  const [screenshot, setScreenshot] = useState(null);
  const [isFinalized, setIsFinalized] = useState(false);
  const [flavor, setFlavor] = useState("vanilla");
  const [frosting, setFrosting] = useState("whipping");
  const [fillings, setFilling] = useState("ube");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const captureScreenshotRef = useRef(null);
  const modalTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ErrorModal = ({ message, onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-red-300 text-center">
        <p className="text-red-600 font-sans text-lg mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-red-500 hover:bg-red-600 text-white font-sans py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  const handleScreenshotTake = (image) => setScreenshot(image);

  const handleTakeScreenshot = () => {
    if (captureScreenshotRef.current) {
      console.log("Triggering screenshot...");
      captureScreenshotRef.current(); // Trigger screenshot function inside CanvasContent
    } else {
      console.warn("captureScreenshotRef is not set yet!");
    }
  };
  const calculatePrice = () => {
    let basePrice = 10;
    const layerPrices = { 1: 150, 2: 250, 3: 350 };
    const shapePrices = {
      circle: 100,
      square: 200,
      heart: 300,
      rectangle: 150,
    };

    basePrice += layerPrices[numberOfLayers] + shapePrices[currentShape];
    setPrice(basePrice);
  };

  useEffect(() => calculatePrice(), [numberOfLayers, currentShape]);

  const handleFinalize = () => setIsFinalized(true);
  const handleCancel = () => setIsFinalized(false);

  const dataURLtoBlob = (dataurl) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleAddToCart = async () => {
    try {
      if (!userId || !screenshot || !flavor) {
        setErrorMessage("You are not logged in, or the cake image is missing.");
        setShowErrorModal(true);
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("price", price);
      formData.append("title", "Customized Cake");
      formData.append("category", "customized");
      formData.append("flavor", flavor);
      formData.append("fillings", fillings);
      formData.append("frosting", frosting);
      formData.append("image", screenshot);

      if (screenshot) {
        const blob = dataURLtoBlob(screenshot);
        formData.append("image", blob, "cake-screenshot.png");
      } else {
        setErrorMessage("Screenshot is not available.");
        setShowErrorModal(true);
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/customcarts`,
        formData
      );
      console.log("Added to cart:", response.data);

      setShowSuccessModal(true);
      modalTimeoutRef.current = setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/hero");
      }, 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage("Failed to add to cart. Please try again.");
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    return () => clearTimeout(modalTimeoutRef.current);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-4 overflow-hidden">
      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message="Cake added to cart!"
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <ErrorModal
          message={errorMessage}
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {isFinalized ? (
        <FinalizedCakeDetails
          price={price}
          screenshot={screenshot}
          onBack={handleCancel}
          onAddToCart={handleAddToCart}
          flavor={flavor}
          frosting={frosting}
          fillings={fillings}
        />
      ) : (
        <>
          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-md shadow-lg">
                <p className="text-green-600 font-medium">
                  Cake added to cart!
                </p>
              </div>
            </div>
          )}

          <ProcedureModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />

          <div className="flex flex-col md:flex-row gap-6">
            {/* Layer Selection */}
            <div className="flex-grow md:flex-grow-0 md:w-1/4 h-1/4 bg-white p-5 rounded-md shadow">
              <LayerSelection
                layer1={layer1}
                layer2={layer2}
                layer3={layer3}
                setLayer1={setLayer1}
                setLayer2={setLayer2}
                setLayer3={setLayer3}
                numberOfLayers={numberOfLayers}
                setNumberOfLayers={setNumberOfLayers}
              />
            </div>
            <div className="flex-grow md:w-1/2 bg-white h-1/2 rounded-md shadow p-4">
              <button onClick={() => setIsModalOpen(true)}>
                <img src={Procedure} alt="Procedure" height={24} width={24} />
              </button>

              <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 20, 10], fov: 60 }}
                style={{ width: "100%", height: "400px" }} // Adjust height here
              >
                <CanvasContent
                  layer1={layer1}
                  layer2={layer2}
                  layer3={layer3}
                  greetingsText={greetingsText}
                  fromText={fromText}
                  textColor={textColor}
                  numberOfLayers={numberOfLayers}
                  currentShape={currentShape}
                  onScreenshotTake={handleScreenshotTake}
                  captureScreenshotRef={captureScreenshotRef}
                />
                {/* Overlay Button Inside Canvas */}
              </Canvas>

              <div className="absolute left-1/2 transform -translate-x-1/2">
                {" "}
                {/* Positioned camera icon here */}
                <button
                  onClick={handleTakeScreenshot}
                  className="justify-center bg-slate-100 bg-opacity-50 text-lg p-2 rounded-full"
                >
                  <img src={Camera} alt="Capture" height={40} width={30} />
                </button>
              </div>
              <div className="bg-white p-2  rounded-md h-80 shadow max-h-40 mt-14 md:w-auto mx-auto">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block font-semibold">Frosting:</label>
                    <select
                      value={frosting}
                      onChange={(e) => setFrosting(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="whipping">Whipping</option>
                      <option value="buttercream">Buttercream</option>
                      <option value="chocolate cream">Chocolate Cream</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold">Filling:</label>
                    <select
                      value={fillings}
                      onChange={(e) => setFilling(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="ube">Ube</option>
                      <option value="leche flan">Leche Flan</option>
                      <option value="macapuno">Macapuno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold">Flavor:</label>
                    <select
                      value={flavor}
                      onChange={(e) => setFlavor(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="vanilla">Vanilla</option>
                      <option value="chocolate">Chocolate</option>
                      <option value="strawberry">Strawberry</option>
                    </select>
                  </div>
                </div>
                <p className="text-lg mt-2 font-semibold">
                  Price: ₱{price.toFixed(2)}
                </p>
                <button
                  onClick={handleFinalize}
                  className="w-full bg-primary hover:bg-red-700 text-white py-1 px-4 rounded mt-1"
                >
                  Done
                </button>
              </div>
            </div>
            <div className="flex-grow md:flex-grow-0 md:w-1/4 bg-white h-1/4 p-5 rounded-md shadow">
              <ShapeSelection setCurrentShape={setCurrentShape} />
              <label className="block font-bold text-lg my-2">
                Greetings Text
              </label>
              <textarea
                value={greetingsText}
                onChange={(e) => setGreetingsText(e.target.value)}
                maxLength={40} // Set the maximum length for greetings text
                className="w-full p-2 text-lg rounded-md border"
                rows="4" // Set a default number of rows (lines) for the textarea
              />
              <p className="text-sm text-gray-500">
                {greetingsText.length}/40 characters
              </p>

              <label className="block font-bold text-lg my-2">From Text</label>
              <textarea
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
                maxLength={20} // Set the maximum length for from text
                className="w-full p-2 text-lg rounded-md border"
                rows="4" // Set a default number of rows (lines) for the textarea
              />
              <p className="text-sm text-gray-500">
                {fromText.length}/20 characters
              </p>

              <label className="block mt-2">Text Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full"
              />
              <div className="gap-2">
                <div className="flex items-center mt-2">
                  <label className="block">Your Design</label>
                  <img
                    src={ArrowDown}
                    width={24}
                    height={24}
                    className="ml-2"
                  />
                </div>
                {screenshot && (
                  <img
                    src={screenshot}
                    alt="Cake Screenshot"
                    className="mt-4 border border-gray-300 w-80 h-90 rounded-md"
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CakeCustomizer;
