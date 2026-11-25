import React, { useId, useState } from 'react';

interface ElevationPoint {
  distanceKm: number;
  elevationM: number;
}

interface ElevationChartProps {
  points: ElevationPoint[];
  height?: number;
  label?: string;
}

export const ElevationChart: React.FC<ElevationChartProps> = ({
  points,
  height = 170,
  label = 'Elevation profile',
}) => {
  const gradId = useId();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (points.length < 2) return null;

  const width = 560;
  const padX = 24;
  const padY = 20;
  const minElev = Math.min(...points.map((p) => p.elevationM));
  const maxElev = Math.max(...points.map((p) => p.elevationM));
  const elevRange = Math.max(50, maxElev - minElev);
  const maxDist = Math.max(1, points[points.length - 1].distanceKm);

  const coords = points.map((p) => {
    const x = padX + (p.distanceKm / maxDist) * (width - padX * 2);
    const y = padY + (1 - (p.elevationM - minElev) / elevRange) * (height - padY * 2);
    return { ...p, x, y };
  });

  const linePath = coords
    .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  const areaPath = `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${
    height - padY
  } L ${coords[0].x.toFixed(1)} ${height - padY} Z`;

  const selected = activeIdx !== null ? coords[activeIdx] : coords[Math.floor(coords.length / 2)];

  return (
    <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="font-display text-base font-bold text-[#242923]">{label}</h3>
          <p className="text-xs text-[#858B80] tabular-nums">
            Min {minElev}m · Peak {maxElev}m
          </p>
        </div>
        <div className="text-right tabular-nums">
          <div className="font-display text-sm font-bold text-[#304B37]">
            {selected.elevationM} m
          </div>
          <div className="text-xs text-[#858B80]">at {selected.distanceKm.toFixed(1)} km</div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label={`${label} from ${minElev}m to ${maxElev}m`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A6B79B" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#DDE5D6" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Horizontal contour grid lines */}
        {[0.25, 0.5, 0.75].map((ratio) => {
          const y = padY + ratio * (height - padY * 2);
          return (
            <line
              key={ratio}
              x1={padX}
              x2={width - padX}
              y1={y}
              y2={y}
              stroke="#DDE5D6"
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradId})`} />
        <path
          d={linePath}
          fill="none"
          stroke="#304B37"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((pt, idx) => {
          const isSelected = activeIdx === idx || (activeIdx === null && idx === Math.floor(coords.length / 2));
          return (
            <g key={pt.distanceKm}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? 6 : 4}
                fill={isSelected ? '#304B37' : '#FAFAF5'}
                stroke="#304B37"
                strokeWidth="2"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              />
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex items-center justify-between text-[11px] text-[#858B80] tabular-nums">
        <span>0.0 km</span>
        <span>{(maxDist / 2).toFixed(1)} km</span>
        <span>{maxDist.toFixed(1)} km</span>
      </div>
    </div>
  );
};
