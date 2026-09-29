'use client';

import React, { useState, useEffect } from 'react';
import { WeatherInfo } from '@/types/wardrobe';
import {
  CloudRain,
  SunMedium,
  Umbrella,
  CheckCircle2,
  RefreshCw,
  MapPin,
  Search,
  Navigation,
  X,
  Compass
} from 'lucide-react';
import { WeatherService, GeocodedCity } from '@/services/weatherService';
import sound from '@/services/soundService';

interface WeatherWidgetProps {
  weather: WeatherInfo;
  onWeatherUpdate?: (weather: WeatherInfo) => void;
}

const FASHION_CAPITALS = [
  { name: 'Milan', country: 'Italy', lat: 45.4642, lon: 9.1900, emoji: '🇮🇹' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, emoji: '🇫🇷' },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, emoji: '🇬🇧' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.0060, emoji: '🇺🇸' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, emoji: '🇯🇵' },
];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, onWeatherUpdate }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Live city search debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await WeatherService.searchCities(searchQuery);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleRefresh = async () => {
    sound.playCuteClick();
    setIsRefreshing(true);
    try {
      const updated = await WeatherService.getCurrentWeather(true);
      onWeatherUpdate?.(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDetectLiveLocation = async () => {
    sound.playCuteClick();
    setIsDetecting(true);
    try {
      const updated = await WeatherService.detectLiveLocation();
      onWeatherUpdate?.(updated);
      setIsModalOpen(false);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSelectCity = async (lat: number, lon: number, displayName: string) => {
    sound.playCuteClick();
    setIsRefreshing(true);
    setIsModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    try {
      const updated = await WeatherService.setManualLocation(lat, lon, displayName);
      onWeatherUpdate?.(updated);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <div className="w-full bg-gradient-to-br from-[#272A4B]/80 to-[#181A31] border border-[rgba(242,236,221,0.12)] rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all">
        <div className="flex items-center justify-between">
          {/* Left: Temp, conditions & clickable location */}
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

              {/* Clickable Location pill to change or detect location */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 mt-0.5 text-left group hover:opacity-90 transition-opacity"
                title="Click to detect real location or search city"
              >
                <MapPin className="w-3 h-3 text-[#CCA166] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="font-mono text-[10px] text-[#9C9FBE] group-hover:text-[#F2ECDD] tracking-tight truncate max-w-[130px] border-b border-dashed border-[#9C9FBE]/40">
                  {weather.location}
                </span>
                <span className="font-mono text-[8px] text-[#CCA166] opacity-75">
                  edit
                </span>
              </button>
            </div>
          </div>

          {/* Right: Rain chance & Rain-safe status & Action buttons */}
          <div className="text-right flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 text-[#E44C4E] font-mono text-xs font-medium">
                <Umbrella className="w-3.5 h-3.5" />
                <span>{weather.rainChance}% rain</span>
              </div>

              {/* Detect location icon button */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                title="Change or detect real location"
                className="w-6 h-6 rounded-full bg-[#181A31] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#CCA166] transition-all active:scale-95"
              >
                <Compass className="w-3 h-3" />
              </button>

              {/* Refresh weather button */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh real-time weather"
                className="w-6 h-6 rounded-full bg-[#181A31] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#9C9FBE] hover:text-[#CCA166] transition-all active:scale-95"
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

      {/* Location Picker & Detection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#181A31] border border-[rgba(242,236,221,0.15)] rounded-2xl p-5 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.08)]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
                  Live Location & Weather
                </h3>
                <p className="font-sans text-[11px] text-[#9C9FBE]">
                  Style adapts to your real-time climate
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real-time GPS Detection Button */}
            <button
              onClick={handleDetectLiveLocation}
              disabled={isDetecting}
              className="w-full bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-60"
            >
              <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
              <span>{isDetecting ? 'Detecting real location...' : 'Detect My Real Location'}</span>
            </button>

            {/* City Search Input */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
                Or Search Any City
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#9C9FBE]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, Bengaluru..."
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F2ECDD] placeholder-[#9C9FBE]/60 focus:outline-none focus:border-[#CCA166]"
                />
              </div>
            </div>

            {/* Search Results */}
            {isSearching && (
              <p className="font-mono text-[10px] text-[#CCA166] text-center py-2 animate-pulse">
                Searching worldwide cities...
              </p>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-1 divide-y divide-[rgba(242,236,221,0.06)] pr-1">
                {searchResults.map((city) => {
                  const label = `${city.name}${city.admin1 ? `, ${city.admin1}` : ''}, ${city.country}`;
                  return (
                    <button
                      key={city.id}
                      onClick={() => handleSelectCity(city.latitude, city.longitude, `${city.name}, ${city.country}`)}
                      className="w-full text-left py-1.5 px-2 hover:bg-[#272A4B] rounded-lg transition-colors flex items-center justify-between group"
                    >
                      <span className="font-sans text-xs text-[#F2ECDD] group-hover:text-[#CCA166]">
                        {label}
                      </span>
                      <span className="font-mono text-[9px] text-[#9C9FBE]">Select →</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quick Fashion Capitals Chips */}
            <div>
              <span className="block font-mono text-[9.5px] uppercase tracking-wider text-[#9C9FBE] mb-2">
                Fashion Capitals
              </span>
              <div className="flex flex-wrap gap-1.5">
                {FASHION_CAPITALS.map((cap) => (
                  <button
                    key={cap.name}
                    onClick={() => handleSelectCity(cap.lat, cap.lon, `${cap.name}, ${cap.country}`)}
                    className="text-[11px] font-sans px-2.5 py-1 rounded-lg bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.1)] flex items-center gap-1 transition-all active:scale-95"
                  >
                    <span>{cap.emoji}</span>
                    <span>{cap.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
