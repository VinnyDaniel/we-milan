'use client';

import React, { useState } from 'react';
import { WeatherInfo } from '@/types/wardrobe';
import { CloudRain, SunMedium, Umbrella, CheckCircle2, RefreshCw, MapPin } from 'lucide-react';
import { WeatherService } from '@/services/weatherService';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  onWeatherUpdate?: (weather: WeatherInfo) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, onWeatherUpdate }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const updated = await WeatherService.getCurrentWeather(true);
      onWeatherUpdate?.(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#272A4B]/80 to-[#181A31] border border-[rgba(242,236,221,0.12)] rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between">
        {/* Left: Temp and conditions */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#3E437A]/50 border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#CCA166] shrink-0">
            {weather.rainChance >= 40 ? (
              <CloudRain className="w-6 h-6 stroke-[1.8] text-[#38BDF8]" />
            ) : (
              <SunMedium className="w-6 h-6 stroke-[1.8] text-[#CCA166]" />
            )}
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-semibold text-[#F2ECDD]">
                {weather.temp}°C
              </span>
              <span className="font-sans text-xs text-[#9C9FBE]">
                {weather.condition}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-[#CCA166]" />
              <p className="font-mono text-[10px] text-[#9C9FBE] tracking-tight truncate max-w-[140px]">
                {weather.location}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Rain chance & Rain-safe status & Refresh button */}
        <div className="text-right flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[#E44C4E] font-mono text-xs font-medium">
              <Umbrella className="w-3.5 h-3.5" />
              <span>{weather.rainChance}% rain</span>
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Detect real local weather"
              className="w-6 h-6 rounded-full bg-[#181A31] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#9C9FBE] hover:text-[#CCA166] transition-all"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#CCA166]' : ''}`} />
            </button>
          </div>

          {weather.isRainSafe ? (
            <div className="flex items-center gap-1 bg-[#CCA166]/15 border border-[#CCA166]/30 text-[#CCA166] px-2 py-0.5 rounded-full font-mono text-[9px] font-semibold tracking-wider">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>Rain-safe ✓</span>
            </div>
          ) : (
            <span className="font-mono text-[9px] text-[#9C9FBE]/80">
              Clear & Dry
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
