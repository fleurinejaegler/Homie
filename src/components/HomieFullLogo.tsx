import React from 'react';

interface HomieFullLogoProps {
  height?: number;
  className?: string;
  color?: string;
}

/**
 * Homie Full Wordmark Logo
 * Recreates the official brand logotype:
 * - Geometric sliced 'h' silhouette on the left
 * - Bold geometric lowercase 'omie' matching the exact stroke weight, x-height, and circular geometry
 */
export const HomieFullLogo: React.FC<HomieFullLogoProps> = ({
  height = 32,
  className = '',
  color = '#000000',
}) => {
  // Natural aspect ratio: 540 wide by 200 high (~2.7:1)
  const width = Math.round(height * 2.7);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 540 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="homie logo"
    >
      {/* 
        LETTER 'h':
        Geometric sliced 'h'
        Upper body: vertical stem (x=24 to x=66), horizontal top at y=36,
        inner notch down to y=88, curved shoulder apex around (115, 88),
        diagonal negative space slice from (24, 185) to (115, 88).
      */}
      <path
        d="M24 50C24 42 30 36 38 36H66V88C71 85 79 84 89 87C97 89 101 93 101 98L24 175V50Z"
        fill={color}
      />
      {/* Sliced lower-right foot of 'h' */}
      <path
        d="M87 132L116 99C125 108 132 121 132 138V165C132 171 127 175 121 175C116 175 111 172 108 167L87 132Z"
        fill={color}
      />

      {/* 
        LETTER 'o':
        Outer circle centered at x=195, y=131 with radius 44.
        Inner counter centered at x=195, y=131 with radius 20.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M195 87C170.699 87 151 106.699 151 131C151 155.301 170.699 175 195 175C219.301 175 239 155.301 239 131C239 106.699 219.301 87 195 87ZM195 110C206.598 110 216 119.402 216 131C216 142.598 206.598 152 195 152C183.402 152 174 142.598 174 131C174 119.402 183.402 110 195 110Z"
        fill={color}
      />

      {/* 
        LETTER 'm':
        Three vertical stems (width 23), two connecting arches at the top (x-height y=87).
        Left stem: x=252 to x=275.
        Middle stem: x=305 to x=328.
        Right stem: x=358 to x=381.
      */}
      <path
        d="M252 89H275V101.5C281.5 92 292.5 87 304.5 87C316.5 87 325 92.5 329.5 101.5C336.5 92 347.5 87 359.5 87C375 87 384 96.5 384 113.5V175H361V117C361 110 357.5 106.5 351.5 106.5C345 106.5 341 110.5 341 117.5V175H318V117C318 110 314.5 106.5 308.5 106.5C302 106.5 298 110.5 298 117.5V175H275H252V89Z"
        fill={color}
      />

      {/* 
        LETTER 'i':
        Stem: x=398 to x=421, y=89 to y=175.
        Circular dot: center (409.5, 54), radius 12.
      */}
      <rect x="398" y="89" width="23" height="86" fill={color} />
      <circle cx="409.5" cy="54" r="12" fill={color} />

      {/* 
        LETTER 'e':
        Outer curve centered at x=472, y=131, radius 44.
        Middle crossbar at y=125, height 22.
        Lower aperture opening from angle 20deg to -30deg.
      */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M472 87C447.699 87 428 106.699 428 131C428 155.301 447.699 175 472 175C491.5 175 507.5 162.5 513.5 145H489C485.5 150 479.5 153.5 472 153.5C460.5 153.5 451.5 145.5 451 135H515C515.5 133 516 130 516 128C516 105.5 496.5 87 472 87ZM451 120C453 112 461 106 472 106C482.5 106 490 112 492 120H451Z"
        fill={color}
      />
    </svg>
  );
};

export default HomieFullLogo;
