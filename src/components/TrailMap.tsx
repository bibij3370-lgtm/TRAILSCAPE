import React, { useState } from 'react';
import { Layers, Navigation } from 'lucide-react';
import { Trail, TrailWaypoint } from '../types/trail';

interface TrailMapProps {
  trail: Trail;
  progressPct?: number; // optional live progress along route (0-100)
  compact?: boolean;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  trail,
  progressPct,
  compact = false,
}) => {
  const [layerMode, setLayerMode] = useState<'contour' | 'relief'>('contour');
  const [selectedWaypoint, setSelectedWaypoint] = useState<TrailWaypoint | null>(
    trail.waypoints[trail.waypoints.length - 1] ?? null
  );

  const waypoints = trail.waypoints;
  const pathPoints = waypoints.map((w) => `${w.x * 4},${w.y * 2.4}`).join(' ');

  // Compute approximate live hiker marker along waypoint chain
  const hikerPos = (() => {
    if (progressPct === undefined || waypoints.length < 2) return null;
    const t = Math.max(0, Math.min(1, progressPct / 100));
    const scaled = t * (waypoints.length - 1);
    const idx = Math.min(waypoints.length - 2, Math.floor(scaled));
    const localT = scaled - idx;
    const a = waypoints[idx];
    const b = waypoints[idx + 1];
    return {
      x: (a.x + (b.x - a.x) * localT) * 4,
      y: (a.y + (b.y - a.y) * localT) * 2.4,
    };
  })();

  return (
    <div className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] overflow-hidden">
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-[#DDE5D6]/80">
        <div>
          <h3 className="font-display text-base font-bold text-[#242923]">Trail Route Map</h3>
          <p className="text-xs text-[#858B80] tabular-nums">
            {trail.coordinates.lat.toFixed(4)}° N, {Math.abs(trail.coordinates.lng).toFixed(4)}°{' '}
            {trail.coordinates.lng >= 0 ? 'E' : 'W'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLayerMode((m) => (m === 'contour' ? 'relief' : 'contour'))}
          aria-label="Switch map layer style"
          className="min-h-[40px] px-3 py-1.5 rounded-[12px] bg-[#F4F3EC] border border-[#DDE5D6] text-xs font-medium text-[#242923] inline-flex items-center gap-1.5 hover:bg-[#DDE5D6]/60 transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5 text-[#304B37]" aria-hidden="true" />
          <span>{layerMode === 'contour' ? 'Contour' : 'Alpine Relief'}</span>
        </button>
      </div>

      <div
        className={`relative w-full ${compact ? 'h-48' : 'h-64 sm:h-72'} transition-colors ${
          layerMode === 'contour' ? 'bg-[#ECEEE5]' : 'bg-[#DDE5D6]'
        }`}
      >
        <svg viewBox="0 0 400 240" className="w-full h-full" role="img" aria-label={`Route map for ${trail.name}`}>
          {/* Topographic contour rings */}
          <g fill="none" stroke={layerMode === 'contour' ? '#C7D3BE' : '#A6B79B'} strokeWidth="1.2">
            <ellipse cx="290" cy="70" rx="140" ry="90" />
            <ellipse cx="290" cy="70" rx="105" ry="66" />
            <ellipse cx="290" cy="70" rx="70" ry="42" />
            <ellipse cx="95" cy="185" rx="115" ry="70" />
            <ellipse cx="95" cy="185" rx="78" ry="46" />
            <path d="M0 120 Q 120 80 210 130 T 400 110" strokeOpacity="0.6" />
          </g>

          {/* Subtle river/stream line */}
          <path
            d="M 12 225 C 90 190, 145 140, 210 150 C 280 160, 325 110, 392 85"
            fill="none"
            stroke="#8EB0A5"
            strokeWidth="2.5"
            strokeOpacity="0.45"
          />

          {/* Trail route polyline */}
          {waypoints.length > 1 && (
            <>
              <polyline
                points={pathPoints}
                fill="none"
                stroke="#FAFAF5"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={pathPoints}
                fill="none"
                stroke="#304B37"
                strokeWidth="3"
                strokeDasharray="6 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Waypoints */}
          {waypoints.map((wp, idx) => {
            const cx = wp.x * 4;
            const cy = wp.y * 2.4;
            const isSelected = selectedWaypoint?.id === wp.id;
            return (
              <g
                key={wp.id}
                className="cursor-pointer"
                onClick={() => setSelectedWaypoint(wp)}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 10 : 7}
                  fill={idx === 0 ? '#77A77A' : idx === waypoints.length - 1 ? '#C87568' : '#304B37'}
                  stroke="#FAFAF5"
                  strokeWidth="2.5"
                />
                <text
                  x={cx}
                  y={cy - 13}
                  textAnchor="middle"
                  className="fill-[#242923] text-[9px] font-semibold select-none"
                >
                  {wp.label}
                </text>
              </g>
            );
          })}

          {/* Live Hiker Marker */}
          {hikerPos && (
            <g>
              <circle cx={hikerPos.x} cy={hikerPos.y} r="12" fill="#304B37" fillOpacity="0.22" />
              <circle cx={hikerPos.x} cy={hikerPos.y} r="6" fill="#304B37" stroke="#FAFAF5" strokeWidth="2.5" />
            </g>
          )}
        </svg>

        {selectedWaypoint && (
          <div className="absolute bottom-3 left-3 right-3 bg-[#FAFAF5]/92 backdrop-blur-md border border-[#DDE5D6] rounded-[14px] px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Navigation className="w-3.5 h-3.5 text-[#304B37] shrink-0" aria-hidden="true" />
              <span className="font-semibold text-[#242923] truncate">{selectedWaypoint.label}</span>
            </div>
            <span className="text-[#858B80] tabular-nums shrink-0">
              {selectedWaypoint.distanceKm.toFixed(1)} km · {selectedWaypoint.elevationM} m
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
