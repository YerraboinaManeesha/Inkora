export default function Logo({ size = 56, showRing = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 92 92"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer ring */}
      {showRing && (
        <circle
          cx="46"
          cy="46"
          r="42"
          stroke="var(--rose)"
          strokeWidth="3"
        />
      )}

      {/* Blush pink logo background */}
      <circle
        cx="46"
        cy="46"
        r="35"
        fill="#E8C4D4"
      />

      {/* Left page */}
      <path
        d="M27 35
           C33 32 39 33 46 38
           V62
           C39 58 33 57 27 60
           Z"
        fill="var(--plum)"
      />

      {/* Right page */}
      <path
        d="M65 35
           C59 32 53 33 46 38
           V62
           C53 58 59 57 65 60
           Z"
        fill="var(--rose)"
      />

      {/* Book spine */}
      <path
        d="M46 38V62"
        stroke="#E8C4D4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Left page writing */}
      <path
        d="M31 41C35 40 40 41 43 44"
        stroke="#E8C4D4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M31 47C35 46 40 47 43 50"
        stroke="#E8C4D4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Right page writing */}
      <path
        d="M61 41C57 40 52 41 49 44"
        stroke="#E8C4D4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M61 47C57 46 52 47 49 50"
        stroke="#E8C4D4"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Writing / ink stroke */}
      <path
        d="M34 68C40 65 52 65 58 68"
        stroke="var(--rose)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}