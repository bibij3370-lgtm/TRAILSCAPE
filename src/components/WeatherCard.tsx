import React from 'react';
import { CloudSun, Droplets, Eye, Wind } from 'lucide-react';
import { TrailWeather } from '../types/trail';

interface WeatherCardProps {
  weather: TrailWeather;
  locationLabel: string;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, locationLabel }) => {
  return (
    <section
      aria-label="Trailhead weather"
      className="bg-[#FAFAF5] border border-[#DDE5D6] rounded-[24px] p-5 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[#858B80]">Trailhead Forecast · {locationLabel}</p>
          <div className="mt-1 flex items-baseline gap-2.5">
            <span className="font-display text-3xl font-bold text-[#242923] tabular-nums">
              {weather.tempC}°C
            </span>
            <span className="text-sm font-medium text-[#304B37]">{weather.condition}</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-[12px] bg-[#DDE5D6]/60 text-[#304B37] flex items-center justify-center shrink-0">
          <CloudSun className="w-6 h-6" aria-hidden="true" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[#DDE5D6]/70 text-xs">
        <div className="flex items-center gap-2 text-[#242923]">
          <Wind className="w-4 h-4 text-[#858B80] shrink-0" aria-hidden="true" />
          <div>
            <div className="text-[#858B80]">Wind</div>
            <div className="font-semibold tabular-nums">{weather.windKmh} km/h</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#242923]">
          <Droplets className="w-4 h-4 text-[#858B80] shrink-0" aria-hidden="true" />
          <div>
            <div className="text-[#858B80]">Humidity</div>
            <div className="font-semibold tabular-nums">{weather.humidityPct}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#242923]">
          <Eye className="w-4 h-4 text-[#858B80] shrink-0" aria-hidden="true" />
          <div>
            <div className="text-[#858B80]">Visibility</div>
            <div className="font-semibold tabular-nums">{weather.visibility}</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-[#304B37] bg-[#F4F3EC] rounded-[12px] px-3.5 py-2.5">
        Trail surface: <span className="font-medium text-[#242923]">{weather.trailCondition}</span>
      </p>
    </section>
  );
};
