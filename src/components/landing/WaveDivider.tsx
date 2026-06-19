type WaveDividerProps = {
  fill?: string;
  className?: string;
  flip?: boolean;
};

export function WaveDivider({ fill = "#ffffff", className = "", flip = false }: WaveDividerProps) {
  return (
    <div
      className={`relative w-full leading-[0] ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block h-12 w-full md:h-16"
      >
        <path
          d="M0,64 C180,120 360,0 540,48 C720,96 900,16 1080,64 C1260,112 1380,80 1440,64 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
