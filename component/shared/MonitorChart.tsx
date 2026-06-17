interface MonitorChartProps {
  data: number[];
  type?: "line" | "bar";
  labels?: string[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export default function MonitorChart({
  data,
  type = "line",
  labels,
  width = 500,
  height = 150,
  color = "#3b82f6", // Blue-500
  className = "",
}: MonitorChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-zinc-400">
        No chart data
      </div>
    );
  }

  // Calculate coordinates
  const max = Math.max(...data, 100) * 1.1; // Add 10% padding
  const min = Math.min(...data, 0);
  const range = max - min;

  const points = data.map((val, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((val - min) / (range || 1)) * height;
    return { x, y };
  });

  // Build path strings
  let linePath = "";
  let areaPath = "";

  if (type === "line" && points.length > 0) {
    // Start of line
    linePath = `M ${points[0].x} ${points[0].y}`;

    // Smooth bezier or simple line
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }

    // Close the area path for the gradient fill
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  }

  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line
          x1="0"
          y1={height * 0.25}
          x2={width}
          y2={height * 0.25}
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          className="dark:stroke-zinc-800"
        />
        <line
          x1="0"
          y1={height * 0.5}
          x2={width}
          y2={height * 0.5}
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          className="dark:stroke-zinc-800"
        />
        <line
          x1="0"
          y1={height * 0.75}
          x2={width}
          y2={height * 0.75}
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          className="dark:stroke-zinc-800"
        />

        {/* Line mode rendering */}
        {type === "line" && areaPath && (
          <path d={areaPath} fill="url(#chartGradient)" />
        )}
        {type === "line" && linePath && (
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Line mode end marker dot */}
        {type === "line" &&
          points.map((pt, idx) => {
            if (idx === points.length - 1) {
              return (
                <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
                  <circle cx="0" cy="0" r="5" fill={color} />
                </g>
              );
            }
            return null;
          })}

        {/* Bar mode rendering */}
        {type === "bar" &&
          data.map((val, idx) => {
            const barWidth = (width / data.length) * 0.7;
            const barHeight = ((val - min) / (range || 1)) * height;
            const x =
              (idx / data.length) * width + (width / data.length) * 0.15;
            const y = height - barHeight;
            return (
              <rect
                key={idx}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={color}
                opacity={0.8}
                rx="2"
                className="hover:opacity-100 hover:fill-indigo-400 transition-all duration-200"
              />
            );
          })}
      </svg>

      {labels && labels.length > 0 && (
        <div className="flex justify-between mt-2 text-[10px] font-semibold text-zinc-500">
          {labels.length === 2 ? (
            <>
              <span>{labels[0]}</span>
              <span>{labels[1]}</span>
            </>
          ) : (
            <>
              <span>{labels[0]}</span>
              <span>{labels[Math.floor(labels.length / 2)]}</span>
              <span>{labels[labels.length - 1]}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
