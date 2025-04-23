import React, { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import ModelOne from "../Model/ModelOne";
import CakeText from "./CakeText";

function CanvasContent({
  layer1,
  layer2,
  layer3,
  greetingsText,
  fromText,
  textColor,
  numberOfLayers,
  currentShape,
  onScreenshotTake,
  captureScreenshotRef,
  font,
}) {
  const { gl, scene, camera } = useThree();
  const textRef = useRef();

  const handleCaptureScreenshot = () => {
    if (gl && scene && camera) {
      setTimeout(() => {
        gl.render(scene, camera);
        const image = gl.domElement.toDataURL("image/png");
        onScreenshotTake(image); // Pass image data to parent
      }, 1000);
    } else {
      console.error("Canvas or Three.js objects not found");
    }
  };

  // Expose function via ref
  useEffect(() => {
    if (captureScreenshotRef) {
      captureScreenshotRef.current = handleCaptureScreenshot;
    }
  }, [captureScreenshotRef]);

  useEffect(() => {
    scene.background = new THREE.Color("white");
  }, [scene]);

  const calculateTextProperties = () => {
    const layerHeights = {
      circle: [2.7, 3.8, 2.9],
      square: [2.9, 1.54, 2.9],
      heart: [2.7, 3.8, 1.8],
      rectangle: [3.44, 2.18, 1.51],
    };

    const maxTextLengths = {
      circle: { 1: -20, 2: -20, 3: -30 },
      square: { 1: -35, 2: -40, 3: -45 },
      heart: { 1: -20, 2: -20, 3: -20 },
      rectangle: { 1: -30, 2: -20, 3: -30 },
    };

    const shapeHeights = layerHeights[currentShape] || layerHeights.circle;
    const totalHeight = shapeHeights
      .slice(0, numberOfLayers)
      .reduce((sum, height) => sum + height, 0);

    const baseYOffset = totalHeight;

    const layerOffsets = {
      greetings: baseYOffset + 0.7,
      from: baseYOffset - 0.44,
    };

    const textPositions = {
      circle: {
        greetings: {
          1: [-3.9, layerOffsets.greetings - 1.1, -2],
          2: [-2.9, layerOffsets.greetings - 1.24, -2],
          3: [-2, layerOffsets.greetings - 1.12, -1.5],
        },
        from: {
          1: [-3.5, layerOffsets.from, +1.5],
          2: [-2.5, layerOffsets.from - 0.1, +0.6],
          3: [-2, layerOffsets.from, +0.5],
        },
      },
      square: {
        greetings: {
          1: [-2.9, layerOffsets.greetings - 1.1, -2],
          2: [-2.2, layerOffsets.greetings - 0.25, -1.5],
          3: [-1.2, layerOffsets.greetings - 1.42, -0.9],
        },
        from: {
          1: [-2.9, layerOffsets.from + 0.02, +1.2],
          2: [-2.2, layerOffsets.from + 0.89, +0.8],
          3: [-1.2, layerOffsets.from - 0.28, +0.5],
        },
      },
      heart: {
        greetings: {
          1: [-3.5, layerOffsets.greetings - 1.2, -4],
          2: [-2.5, layerOffsets.greetings - 1.88, -1.7],
          3: [-2.0, layerOffsets.greetings - 1.3, -1.6],
        },
        from: {
          1: [-2.4, layerOffsets.from - 0.029, +0.001],
          2: [-2.5, layerOffsets.from - 0.72, +0.7],
          3: [-2, layerOffsets.from - 0.15, +0.22],
        },
      },
      rectangle: {
        greetings: {
          1: [-5, layerOffsets.greetings - 1.2, -2.2],
          2: [-4.3, layerOffsets.greetings - 1.3, -1.7],
          3: [-3, layerOffsets.greetings - 1.15, -0.9],
        },
        from: {
          1: [-5, layerOffsets.from, +1.5],
          2: [-4.3, layerOffsets.from - 0.15, +1.0],
          3: [-3, layerOffsets.from, +1.1],
        },
      },
    };

    // Retrieve the text positions dynamically
    const currentPositions =
      textPositions[currentShape] || textPositions.circle;
    const greetingsPosition = currentPositions.greetings[numberOfLayers];
    const fromPosition = currentPositions.from[numberOfLayers];

    const layerFontSizes = {
      1: 1.5,
      2: 1.2,
      3: 0.99,
    };

    const baseFontSize = layerFontSizes[numberOfLayers] || 0.9;

    const maxLength =
      maxTextLengths[currentShape]?.[numberOfLayers] ||
      maxTextLengths.circle[1];

    const combinedTextLength = greetingsText.length + fromText.length;
    const fontSizeReduction = 0.007;
    const fontSizeAdjustment =
      combinedTextLength > maxLength
        ? (combinedTextLength - maxLength) * fontSizeReduction
        : 0;

    const adjustedFontSize = Math.max(baseFontSize - fontSizeAdjustment, 0.15);

    return {
      greetings: {
        position: greetingsPosition,
        fontSize: adjustedFontSize,
      },
      from: {
        position: fromPosition,
        fontSize: adjustedFontSize * 0.8,
      },
    };
  };

  const textProperties = calculateTextProperties();

  return (
    <>
      <ambientLight intensity={0.0} />
      <directionalLight position={[0, 9, 0]} intensity={1} />
      <spotLight
        intensity={7}
        angle={0.8}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      />
      <ModelOne
        customColors={{ layer1, layer2, layer3, textColor }}
        numberOfLayers={numberOfLayers}
        shape={currentShape}
        position={[0, 0, 0]}
        rotation={[0, Math.PI, -1]}
      />

      <CakeText
        font={font}
        text={greetingsText}
        color={textColor}
        position={textProperties.greetings.position}
        fontSize={textProperties.greetings.fontSize}
        anchorX="center"
        anchorY="middle"
      />
      <CakeText
        text={fromText}
        color={textColor}
        position={textProperties.from.position}
        fontSize={textProperties.from.fontSize}
        anchorX="center"
        anchorY="middle"
      />

      <OrbitControls makeDefault />
    </>
  );
}

export default CanvasContent;
