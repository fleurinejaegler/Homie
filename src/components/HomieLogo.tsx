/**
 * Homie Geometric 'h' Logo
 * Ultra-bold lowercase 'h' silhouette dissected diagonally by negative space.
 * Matches the official Homie brand asset.
 */
interface HomieLogoProps {
  size?: number;
  className?: string;
  color?: string;
}

export function HomieLogo({ size = 32, className = '', color = '#000000' }: HomieLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Homie Logo"
    >
      {/* 
        Upper & Left Main Body:
        Vertical stem with rounded top-left corner, horizontal top, inner vertical notch,
        curved shoulder bulb, dissected by a clean 45-degree diagonal cut from bottom-left to shoulder.
      */}
      {/* Upper Main Body: Vertical stem, curved arch, diagonal slice */}
      <path
        d="M20.5 24C20.5 19.5 24 16 28.5 16H44V36.5C46.5 35 51 34.5 56 36C59.5 37 61.5 39 61.5 42L20.5 83V24Z"
        fill={color}
      />
      {/* Lower Right Base: Diagonal cut face, curved right shoulder and rounded foot */}
      <path
        d="M56.5 60L71 42.5C76 47 79.5 54.5 79.5 63.5V77.5C79.5 81 76.5 83.5 73 83.5C70.5 83.5 68 82 66.5 79.5L56.5 60Z"
        fill={color}
      />
    </svg>
  );
}

export default HomieLogo;
