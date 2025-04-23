//ModelView
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import ModelOne from "../Model/ModelOne";
import Pallete from "../assets/colorpallete.svg";
import Layer from "../assets/layer.svg";
import OneLayer from "/1layer.png";
import TwoLayer from "/2layer.png";
import ThreeLayer from "/3layer.png";
import CakeText from "./CakeText";
import Camera from "/camera.png";
import Shapes from "../assets/shape.svg";
import Circles from "../assets/circle.svg";
import Squares from "../assets/square.svg";
import Hearts from "../assets/heart.svg";
import Rectangles from "../assets/rectangle.svg";
import { SquareModel } from "../Model/SquareModel";
import { Box3, Vector3 } from "three";

import * as THREE from "three";
function CanvasContent({
  layer1,
  layer2,
  layer3,
  text,
  textColor,
  numberOfLayers,
  currentShape,
}) {
  const { gl, scene, camera } = useThree();

  const handleCaptureScreenshot = () => {
    if (gl && scene && camera) {
      // Introduce a timeout to allow the scene to render completely
      setTimeout(() => {
        gl.render(scene, camera);
        const image = gl.domElement.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "3d_screenshot.png";
        link.click();
      }, 1000); // Adjust the delay (in milliseconds) as needed
    } else {
      console.error("Canvas or Three.js objects not found");
    }
  };

  useEffect(() => {
    // Set the background color
    scene.background = new THREE.Color("lightblue"); // Or any hex color, e.g., 0x0000ff
  }, [scene]); // Re-run the effect if the scene changes

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <spotLight
        intensity={1}
        angle={0.1}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      />
      <ModelOne
        customColors={{ layer1, layer2, layer3, textColor }}
        text={text}
        numberOfLayers={numberOfLayers}
        shape={currentShape}
        position={[6, 6, 6]}
        rotation={[0, Math.PI, 0]}
      />
      <CakeText text={text} color={textColor} position={[0, 2.4, 0]} />
      <OrbitControls makeDefault />

      {/* Use Html component from drei to embed HTML content */}
      <Html>
        <div className="fixed items-center justify-center -bottom-80 -right-10">
          <button
            onClick={handleCaptureScreenshot}
            className=" justify-center bg-red-400 bg-opacity-50 text-white text-lg p-5 rounded-full"
          >
            <img
              src={Camera}
              alt="Capture"
              height={70}
              width={70}
              className="mr-9"
            />
          </button>
        </div>
      </Html>
    </>
  );
}

function CakeCustomizer() {
  const [layer1, setLayer1] = useState("#A52A2A");
  const [layer2, setLayer2] = useState("#8B4513");
  const [layer3, setLayer3] = useState("#DC143C");
  const [textColor, setTextColor] = useState("#ffffff");
  const [numberOfLayers, setNumberOfLayers] = useState(2);
  const [cakeText, setCakeText] = useState("Happy Birthday");
  const [font, setFont] = useState(null); // Store the loaded font
  const [currentShape, setCurrentShape] = useState("circle");

  useEffect(() => {
    const loader = new FontLoader();
    loader.load(
      "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
      (loadedFont) => setFont(loadedFont)
    );
  }, []);

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        padding: "20px",
        height: "800px",
      }}
    >
      {/* Left Control Panel */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "300px",
          height: "800px",
        }}
      >
        {/* Shape Selection */}
        <div
          style={{
            border: "1px solid #ccc",
            padding: "15px",
            borderRadius: "5px",
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "10px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            <img
              src={Shapes}
              alt="color"
              height={35}
              width={35}
              className="-ml-8 mr-15 -mt-6 "
            />
            Select Shape
          </label>
          {/* 2x2 Grid for Shapes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setCurrentShape("circle")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img src={Circles} alt="layer" height={45} width={45} />
              <span>Circle</span>
            </button>
            <button
              onClick={() => setCurrentShape("square")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img src={Squares} alt="layer" height={45} width={45} />
              <span>Square</span>
            </button>
            <button
              onClick={() => setCurrentShape("heart")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img src={Hearts} alt="layer" height={45} width={45} />
              <span>Heart</span>
            </button>
            <button
              onClick={() => setCurrentShape("rectangle")}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              <img src={Rectangles} alt="layer" height={45} width={45} />
              <span>Rectangle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Canvas and Capture Button */}
      <div
        style={{
          backgroundColor: "#ffff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{ position: [0, 10, 20] }}
          style={{ width: "500px", height: "700px", background: "#ffffff" }}
        >
          <Suspense fallback={null}>
            <CanvasContent
              layer1={layer1}
              layer2={layer2}
              layer3={layer3}
              textColor={textColor}
              text={cakeText}
              numberOfLayers={numberOfLayers}
              currentShape={currentShape}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Control Panel */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "300px",
          height: "800px",
        }}
      >
        {/* Text Input */}
        <div>
          <label htmlFor="cake-text" style={{ display: "block" }}>
            Cake Text:
          </label>
          <input
            type="text"
            value={cakeText}
            onChange={(e) => setCakeText(e.target.value)}
            placeholder="Enter text for cake"
            style={{ marginBottom: "10px" }}
          />
          <input
            id="cake-text-color"
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {/* Color and Layer Selection - combined */}
        <div>
          {/* Color Picker */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <img
                src={Pallete}
                alt="color"
                height={35}
                width={35}
                className="-ml-8 mr-15 -mt-6 "
              />
              Select Cake Layer Colors
            </label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div>
                <label htmlFor="layer1">Layer 1:</label>
                <input
                  type="color"
                  id="layer1"
                  value={layer1}
                  onChange={(e) => setLayer1(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label htmlFor="layer2">Layer 2:</label>
                <input
                  type="color"
                  id="layer2"
                  value={layer2}
                  onChange={(e) => setLayer2(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              {numberOfLayers === 3 && (
                <div>
                  <label htmlFor="layer3">Layer 3:</label>
                  <input
                    type="color"
                    id="layer3"
                    value={layer3}
                    onChange={(e) => setLayer3(e.target.value)}
                    style={{ width: "100%" }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Layer Selection */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              <img
                src={Layer}
                alt="color"
                height={35}
                width={35}
                className="-ml-8 mr-15 -mt-6 "
              />
              Select Number of Layers
            </label>
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              <button
                onClick={() => setNumberOfLayers(1)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <img src={OneLayer} alt="layer" height={55} width={55} />
                <span>1 layer</span>
              </button>
              <button
                onClick={() => setNumberOfLayers(2)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <img src={TwoLayer} alt="layer" height={55} width={55} />
                <span>2 layers</span>
              </button>
              <button
                onClick={() => setNumberOfLayers(3)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                <img src={ThreeLayer} alt="layer" height={55} width={55} />
                <span>3 layers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CakeCustomizer;
