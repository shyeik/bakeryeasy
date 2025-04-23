import React from "react";

const Customize = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      className="size-4"
    >
      <defs>
        {/* Define the gradient here */}
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ stopColor: "rgb(0, 128, 0)", stopOpacity: 1 }}
          />{" "}
          {/* Green */}
          <stop
            offset="33%"
            style={{ stopColor: "rgb(255, 255, 0)", stopOpacity: 1 }}
          />{" "}
          {/* Yellow */}
          <stop
            offset="66%"
            style={{ stopColor: "rgb(255, 0, 0)", stopOpacity: 1 }}
          />{" "}
          {/* Red */}
          <stop
            offset="100%"
            style={{ stopColor: "rgb(0, 0, 255)", stopOpacity: 1 }}
          />{" "}
          {/* Blue */}
        </linearGradient>
      </defs>
      {/* Apply the gradient to the icon */}
      <path
        d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z"
        fill="url(#grad1)" // Use the gradient defined above
      />
      <path
        d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z"
        fill="url(#grad1)" // Apply the gradient here as well
      />
    </svg>
  );
};

export default Customize;
