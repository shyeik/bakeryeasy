import React from "react";

const ColorSelection = () => {
  return (
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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
    </div>
  );
};

export default ColorSelection;
