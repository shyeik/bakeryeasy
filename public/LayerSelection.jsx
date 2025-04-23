// LayerSelection.js
import React from "react";
import Pallete from "../../assets/colorpallete.svg";
import Layer from "../../assets/layer.svg";
import OneLayer from "/1layer.png";
import TwoLayer from "/2layer.png";
import ThreeLayer from "/3layer.png";

function LayerSelection({
  layer1,
  layer2,
  layer3,
  setLayer1,
  setLayer2,
  setLayer3,
  numberOfLayers,
  setNumberOfLayers,
}) {
  return (
    <>
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
            fontSize: "14px",
          }}
        >
          <img
            src={Pallete}
            alt="color"
            height={35}
            width={35}
            className="-ml-8 mr-15 -mt-6 "
          />
          Select Cake Tiers Colors
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <label htmlFor="layer1">Tier 1:</label>
            <input
              type="color"
              id="layer1"
              value={layer1}
              onChange={(e) => setLayer1(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>
          {numberOfLayers >= 2 && (
            <div>
              <label htmlFor="layer2">Tier 2:</label>
              <input
                type="color"
                id="layer2"
                value={layer2}
                onChange={(e) => setLayer2(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          )}
          {numberOfLayers === 3 && (
            <div>
              <label htmlFor="layer3">Tier 3:</label>
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
          marginTop: "10px",
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
          Select Number of Tiers
        </label>
        <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
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
            <span>1 tier</span>
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
            <span>2 tier</span>
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
            <span>3 tier</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default LayerSelection;
