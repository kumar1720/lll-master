import React, { useRef } from "react";
import "../assets/css/brand-slider.css";

// Using placeholder SVG logos styled in greyscale to match the screenshot
const brands = [
  {
    id: 1,
    name: "Infinity",
    svg: (
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <path
          d="M45 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15c4.5 0 8.5-2 11.25-5.1L52.5 30l-11.25-9.9C38.5 17 34.5 15 30 15"
          stroke="#bbb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M75 30c0 8.284 6.716 15 15 15s15-6.716 15-15-6.716-15-15-15c-4.5 0-8.5 2-11.25 5.1L52.5 30l11.25 9.9C66.5 43 70.5 45 75 45"
          stroke="#bbb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="50%"
          y="58"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          INFINITY
        </text>
      </svg>
    ),
  },
  {
    id: 2,
    name: "Elements",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <circle
          cx="60"
          cy="32"
          r="22"
          stroke="#bbb"
          strokeWidth="2"
          fill="none"
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + 22 * Math.cos(rad);
          const y = 32 + 22 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#bbb" />;
        })}
        <text
          x="50%"
          y="30"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5.5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          EST.
        </text>
        <text
          x="50%"
          y="37"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7.5"
          letterSpacing="1.5"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          ELEMENTS
        </text>
        <text
          x="50%"
          y="44"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          2018
        </text>
      </svg>
    ),
  },
  {
    id: 3,
    name: "Connection Design",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <path
          d="M52 25c0-8 6-14 14-14s14 6 14 14c0 5-2.5 9.5-6.5 12L80 50c4-3 6.5-7.5 6.5-12.5C86.5 26 79 18 70 18V8"
          stroke="#bbb"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 45c0 8-6 14-14 14S40 53 40 45c0-5 2.5-9.5 6.5-12L40 20c-4 3-6.5 7.5-6.5 12.5C33.5 44 41 52 50 52v10"
          stroke="#bbb"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="50%"
          y="65"
          textAnchor="middle"
          fill="#bbb"
          fontSize="6"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          connection
        </text>
        <text
          x="50%"
          y="72"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5.5"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          DESIGN
        </text>
      </svg>
    ),
  },
  {
    id: 4,
    name: "JP Company",
    svg: (
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <circle
          cx="42"
          cy="22"
          r="10"
          stroke="#bbb"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="42" cy="38" r="4" fill="#bbb" />
        <path
          d="M55 15h12c5 0 9 4 9 9s-4 9-9 9H55V15z"
          stroke="#bbb"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M55 15v28"
          stroke="#bbb"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x="72"
          y="42"
          fill="#bbb"
          fontSize="10"
          letterSpacing="1.5"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          COMPANY
        </text>
      </svg>
    ),
  },
  {
    id: 5,
    name: "Lorem Ipsum",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        {/* Outer rotated square */}
        <rect
          x="30"
          y="10"
          width="60"
          height="50"
          stroke="#bbb"
          strokeWidth="2"
          fill="none"
          transform="rotate(45 60 35)"
        />
        {/* Inner square */}
        <rect
          x="38"
          y="18"
          width="44"
          height="34"
          stroke="#bbb"
          strokeWidth="1.5"
          fill="none"
        />
        <text
          x="60"
          y="32"
          textAnchor="middle"
          fill="#bbb"
          fontSize="9"
          letterSpacing="1"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          LOREM
        </text>
        <text
          x="60"
          y="42"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7.5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          IPSUM
        </text>
      </svg>
    ),
  },
  // duplicate set for seamless loop
  {
    id: 6,
    name: "Infinity",
    svg: (
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <path
          d="M45 30c0-8.284-6.716-15-15-15s-15 6.716-15 15 6.716 15 15 15c4.5 0 8.5-2 11.25-5.1L52.5 30l-11.25-9.9C38.5 17 34.5 15 30 15"
          stroke="#bbb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M75 30c0 8.284 6.716 15 15 15s15-6.716 15-15-6.716-15-15-15c-4.5 0-8.5 2-11.25 5.1L52.5 30l11.25 9.9C66.5 43 70.5 45 75 45"
          stroke="#bbb"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="50%"
          y="58"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          INFINITY
        </text>
      </svg>
    ),
  },
  {
    id: 7,
    name: "Elements",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <circle
          cx="60"
          cy="32"
          r="22"
          stroke="#bbb"
          strokeWidth="2"
          fill="none"
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x = 60 + 22 * Math.cos(rad);
          const y = 32 + 22 * Math.sin(rad);
          return <circle key={i} cx={x} cy={y} r="3.5" fill="#bbb" />;
        })}
        <text
          x="50%"
          y="30"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5.5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          EST.
        </text>
        <text
          x="50%"
          y="37"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7.5"
          letterSpacing="1.5"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          ELEMENTS
        </text>
        <text
          x="50%"
          y="44"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          2018
        </text>
      </svg>
    ),
  },
  {
    id: 8,
    name: "Connection Design",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <path
          d="M52 25c0-8 6-14 14-14s14 6 14 14c0 5-2.5 9.5-6.5 12L80 50c4-3 6.5-7.5 6.5-12.5C86.5 26 79 18 70 18V8"
          stroke="#bbb"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M68 45c0 8-6 14-14 14S40 53 40 45c0-5 2.5-9.5 6.5-12L40 20c-4 3-6.5 7.5-6.5 12.5C33.5 44 41 52 50 52v10"
          stroke="#bbb"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        <text
          x="50%"
          y="65"
          textAnchor="middle"
          fill="#bbb"
          fontSize="6"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          connection
        </text>
        <text
          x="50%"
          y="72"
          textAnchor="middle"
          fill="#bbb"
          fontSize="5.5"
          letterSpacing="3"
          fontFamily="sans-serif"
        >
          DESIGN
        </text>
      </svg>
    ),
  },
  {
    id: 9,
    name: "JP Company",
    svg: (
      <svg
        viewBox="0 0 120 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <circle
          cx="42"
          cy="22"
          r="10"
          stroke="#bbb"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="42" cy="38" r="4" fill="#bbb" />
        <path
          d="M55 15h12c5 0 9 4 9 9s-4 9-9 9H55V15z"
          stroke="#bbb"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M55 15v28"
          stroke="#bbb"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <text
          x="72"
          y="42"
          fill="#bbb"
          fontSize="10"
          letterSpacing="1.5"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          COMPANY
        </text>
      </svg>
    ),
  },
  {
    id: 10,
    name: "Lorem Ipsum",
    svg: (
      <svg
        viewBox="0 0 120 70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="brand-svg"
      >
        <rect
          x="30"
          y="10"
          width="60"
          height="50"
          stroke="#bbb"
          strokeWidth="2"
          fill="none"
          transform="rotate(45 60 35)"
        />
        <rect
          x="38"
          y="18"
          width="44"
          height="34"
          stroke="#bbb"
          strokeWidth="1.5"
          fill="none"
        />
        <text
          x="60"
          y="32"
          textAnchor="middle"
          fill="#bbb"
          fontSize="9"
          letterSpacing="1"
          fontFamily="sans-serif"
          fontWeight="bold"
        >
          LOREM
        </text>
        <text
          x="60"
          y="42"
          textAnchor="middle"
          fill="#bbb"
          fontSize="7.5"
          letterSpacing="1"
          fontFamily="sans-serif"
        >
          IPSUM
        </text>
      </svg>
    ),
  },
];

const BrandSlider = () => {
  return (
    <section className="brand-section">
      <div className="brand-track-wrapper">
        <div className="brand-track">
          {brands.map((brand) => (
            <div className="brand-item" key={brand.id} title={brand.name}>
              {brand.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
