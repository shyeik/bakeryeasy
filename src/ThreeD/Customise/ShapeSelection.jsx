// ShapeSelection.js
import React from "react";
import Shapes from "../../assets/shape.svg";
import Circles from "../../assets/circle.svg";
import Squares from "../../assets/square.svg";
import Hearts from "../../assets/heart.svg";
import Rectangles from "../../assets/rectangle.svg";

function ShapeSelection({ setCurrentShape }) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        margin: "5px",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: "bold",
          fontSize: "14px",
        }}
      >
        <img
          src={Shapes}
          alt="shape icon"
          height={35}
          width={35}
          className="-ml-8 mr-15 -mt-6 "
        />
        Select Shape
      </label>
      <span className="px-4 py-2">Step 2</span>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "5px",
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
            padding: "5px",
          }}
        >
          <img src="./cricleshape.png" alt="circle" height={30} width={30} />
          <span style={{ fontSize: "12px" }}>Circle</span>
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
            padding: "5px",
          }}
        >
          <img src="./squareshape.png" alt="square" height={30} width={30} />
          <span style={{ fontSize: "12px" }}>Square</span>
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
            padding: "5px",
          }}
        >
          <img src="./heartshape.png" alt="heart" height={30} width={30} />
          <span style={{ fontSize: "12px" }}>Heart</span>
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
            padding: "5px",
          }}
        >
          <img
            src="./rectangleshape.png"
            alt="rectangle"
            height={30}
            width={30}
          />
          <span style={{ fontSize: "12px" }}>Rectangle</span>
        </button>
      </div>
    </div>
  );
}

export default ShapeSelection;
