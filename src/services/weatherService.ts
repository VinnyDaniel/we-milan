import { WeatherInfo } from '@/types/wardrobe';

// WMO Weather interpretation codes (WW)
const WMO_CODE_MAP: Record<number, { condition: string; rainChance: number; summary: string }> = {
  0: { condition: 'Clear Sky', rainChance: 5, summary: 'Crisp, clear skies. Ideal for statement footwear and sun-friendly fabrics.' },
  1: { condition: 'Mainly Clear', rainChance: 10, summary: 'Bright skies with mild sun. Great for lightweight layering.' },
  2: { condition: 'Partly Cloudy', rainChance: 25, summary: 'Gentle cloud cover with warm ambient light.' },
  3: { condition: 'Overcast', rainChance: 40, summary: 'Diffused sunlight and cooler breeze. Mid-weight fabrics recommended.' },
  45: { condition: 'Foggy', rainChance: 30, summary: 'Cool mist and reduced visibility. Cozy textures and warm outerwear work best.' },
  48: { condition: 'Depositing Rime Fog', rainChance: 35, summary: 'Chilly damp mist. Structured protective layers advised.' },
  51: { condition: 'Light Drizzle', rainChance: 65, summary: 'Intermittent light drizzle. Water-resistant fabrics or quick-dry layers recommended.' },
  53: { condition: 'Moderate Drizzle', rainChance: 75, summary: 'Steady damp drizzle. Rain-safe footwear and outerwear advised.' },
  55: { condition: 'Dense Drizzle', rainChance: 85, summary: 'Heavy damp air. Avoid untreated silks and suede.' },
  61: { condition: 'Slight Rain', rainChance: 70, summary: 'Light rain showers expected. Choose water-repellent jackets.' },
  63: { condition: 'Moderate Rain', rainChance: 85, summary: 'Persistent rain. Waterproof layers and closed-toe footwear essential.' },
  65: { condition: 'Heavy Rain', rainChance: 95, summary: 'Torrential downpour. High hems, rain boots, and waterproof coats essential.' },
  71: { condition: 'Slight Snow', rainChance: 60, summary: 'Light snow flurries. Thermal layers and insulated woolens recommended.' },
  73: { condition: 'Moderate Snow', rainChance: 80, summary: 'Substantial snowfall. Heavy wool coats and weather-treated boots.' },
  75: { condition: 'Heavy Snow', rainChance: 95, summary: 'Deep snowfall and icy wind. Maximum insulation and grip footwear.' },
  80: { condition: 'Slight Rain Showers', rainChance: 65, summary: 'Scattered brief showers. Versatile layers with an umbrella handy.' },
  81: { condition: 'Moderate Showers', rainChance: 80, summary: 'Passing showers throughout the day. Water-resistant outerwear recommended.' },
  82: { condition: 'Violent Showers', rainChance: 95, summary: 'Heavy unpredictable squalls. Opt for resilient technical outerwear.' },
  95: { condition: 'Thunderstorm', rainChance: 90, summary: 'Stormy skies and thunder. Sturdy waterproof protection needed.' },
};

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
}

export class WeatherService {
  private static cachedWeather: WeatherInfo | null = null;
  private static lastFetchTime: number = 0;
  private static readonly SAVED_LOC_KEY = 'we_milan_saved_location_v1';

  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getSavedLocation(): { lat: number; lon: number; name: string } | null {
    if (!this.isBrowser()) return null;
    try {
      const data = localStorage.getItem(this.SAVED_LOC_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static saveLocation(loc: { lat: number; lon: number; name: string }): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(this.SAVED_LOC_KEY, JSON.stringify(loc));
    } catch {}
  }

  public static clearSavedLocation(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem(this.SAVED_LOC_KEY);
    } catch {}
  }

  /**
   * Detects real local weather in real time via:
   * 1. Saved custom location (if user chose one)
   * 2. Browser Geolocation (high-accuracy GPS)
   * 3. IP Geolocation auto-detection (CORS-friendly, no permission prompt needed)
   * 4. Open-Meteo real-time weather API
   */
  public static async getCurrentWeather(forceRefresh: boolean = false, forceDetectLive: boolean = false): Promise<WeatherInfo> {
    const now = Date.now();
    // Cache for 3 minutes unless forced
    if (!forceRefresh && !forceDetectLive && this.cachedWeather && now - this.lastFetchTime < 180000) {
      return this.cachedWeather;
    }

    // Default fallback
    const fallbackWeather: WeatherInfo = {
      temp: 24,
      condition: 'Partly Cloudy',
      rainChance: 25,
      isRainSafe: false,
      location: 'Milan, Italy',
      humidity: 52,
      windSpeed: '10 km/h',
      summary: 'Pleasant ambient warmth with soft breeze in the fashion district.',
      advice: 'Breathable linen or cotton twill paired with structured accessories.'
    };

    if (!this.isBrowser()) {
      return fallbackWeather;
    }

    try {
      let lat = 45.4642;
      let lon = 9.1900;
      let locationName = 'Milan, Italy';

      // 1. Check saved custom location unless forcing fresh detection
      const savedLoc = !forceDetectLive ? this.getSavedLocation() : null;
      if (savedLoc) {
        lat = savedLoc.lat;
        lon = savedLoc.lon;
        locationName = savedLoc.name;
      } else {
        // 2. Try browser GPS first with generous timeout
        const gpsCoords = await this.getUserCoordinates();
        if (gpsCoords) {
          lat = gpsCoords.latitude;
          lon = gpsCoords.longitude;
          const reverseName = await this.reverseGeocode(lat, lon);
          locationName = reverseName || `Local (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
        } else {
          // 3. Fallback to IP-based auto-detection
          const ipLoc = await this.getLocationFromIP();
          if (ipLoc) {
            lat = ipLoc.lat;
            lon = ipLoc.lon;
            locationName = ipLoc.name;
          }
        }
      }

      // 4. Fetch real-time live forecast for these coordinates
      const weather = await this.fetchWeatherForCoords(lat, lon, locationName);
      if (weather) {
        this.cachedWeather = weather;
        this.lastFetchTime = Date.now();
        return weather;
      }
    } catch (e) {
      console.warn('Real-time weather detection encountered an issue, falling back:', e);
    }

    this.cachedWeather = fallbackWeather;
    this.lastFetchTime = Date.now();
    return fallbackWeather;
  }

  /**
   * Fetch live weather directly for specific coordinates
   */
  public static async fetchWeatherForCoords(lat: number, lon: number, locationName: string): Promise<WeatherInfo | null> {
    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
      const res = await fetch(weatherUrl, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) return null;

      const data = await res.json();
      const currentTemp = Math.round(data.current?.temperature_2m ?? 24);
      const humidity = Math.round(data.current?.relative_humidity_2m ?? 50);
      const windSpeed = `${Math.round(data.current?.wind_speed_10m ?? 10)} km/h`;
      const weatherCode = data.current?.weather_code ?? 0;

      const hourlyRainProbs: number[] = data.hourly?.precipitation_probability || [20];
      const maxRainProb = Math.max(...hourlyRainProbs);

      const wmoInfo = WMO_CODE_MAP[weatherCode] || {
        condition: currentTemp > 22 ? 'Clear / Mild' : 'Cool / Overcast',
        rainChance: maxRainProb,
        summary: `Current conditions around ${currentTemp}°C with ${humidity}% humidity.`
      };

      const finalRainChance = Math.max(wmoInfo.rainChance, maxRainProb);
      const isRainSafe = finalRainChance >= 40;

      let advice = 'Breathable lightweight layers suited for comfortable movement.';
      if (currentTemp >= 28) {
        advice = 'Heat-adapted styling: breathable linen, open silhouettes, and UV-safe shades.';
      } else if (currentTemp <= 15) {
        advice = 'Cold-adapted layering: structured wool blend, fine knitwear, and sturdy boots.';
      } else if (isRainSafe) {
        advice = 'Rain-safe choice: water-resistant footwear and tailored crops to avoid damp hems.';
      }

      return {
        temp: currentTemp,
        condition: wmoInfo.condition,
        rainChance: finalRainChance,
        isRainSafe,
        location: locationName,
        humidity,
        windSpeed,
        summary: wmoInfo.summary,
        advice
      };
    } catch (e) {
      console.warn('Failed to fetch from Open-Meteo:', e);
      return null;
    }
  }

  /**
   * Search cities using Open-Meteo free geocoding API
   */
  public static async searchCities(query: string): Promise<GeocodedCity[]> {
    if (!query || query.trim().length < 2) return [];
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        return data.results || [];
      }
    } catch (e) {
      console.warn('City geocoding search failed:', e);
    }
    return [];
  }

  /**
   * User manually sets a specific city/location
   */
  public static async setManualLocation(lat: number, lon: number, name: string): Promise<WeatherInfo> {
    this.saveLocation({ lat, lon, name });
    const weather = await this.fetchWeatherForCoords(lat, lon, name);
    if (weather) {
      this.cachedWeather = weather;
      this.lastFetchTime = Date.now();
      return weather;
    }
    return this.getCurrentWeather(true);
  }

  /**
   * User triggers live GPS detection
   */
  public static async detectLiveLocation(): Promise<WeatherInfo> {
    this.clearSavedLocation();
    this.cachedWeather = null;
    return this.getCurrentWeather(true, true);
  }

  /**
   * Browser GPS with 7-second timeout
   */
  private static getUserCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        return resolve(null);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        () => {
          // Denied or timed out
          resolve(null);
        },
        { timeout: 7000, maximumAge: 300000, enableHighAccuracy: true }
      );
    });
  }

  /**
   * Reverse geocodes coordinates to human-readable City, Country
   */
  private static async reverseGeocode(lat: number, lon: number): Promise<string | null> {
    try {
      const geoRes = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { signal: AbortSignal.timeout(3000) }
      );
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        const city = geoData.city || geoData.locality || geoData.principalSubdivision;
        const country = geoData.countryCode || geoData.countryName;
        if (city) {
          return `${city}${country ? `, ${country}` : ''}`;
        }
      }
    } catch {}
    return null;
  }

  /**
   * Auto-detect location from caller's IP (zero permission prompt needed)
   */
  private static async getLocationFromIP(): Promise<{ lat: number; lon: number; name: string } | null> {
    // 1. BigDataCloud IP client lookup
    try {
      const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        const lat = data.latitude;
        const lon = data.longitude;
        const city = data.city || data.locality || data.principalSubdivision;
        const country = data.countryCode || data.countryName;
        if (typeof lat === 'number' && typeof lon === 'number') {
          return {
            lat,
            lon,
            name: city ? `${city}${country ? `, ${country}` : ''}` : 'Local Region'
          };
        }
      }
    } catch {}

    // 2. FreeIPAPI secondary fallback
    try {
      const res = await fetch('https://freeipapi.com/api/json', {
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const data = await res.json();
        const lat = data.latitude;
        const lon = data.longitude;
        const city = data.cityName;
        const country = data.countryCode;
        if (typeof lat === 'number' && typeof lon === 'number') {
          return {
            lat,
            lon,
            name: city ? `${city}${country ? `, ${country}` : ''}` : 'Local Region'
          };
        }
      }
    } catch {}

    return null;
  }

  public static getOutfitWeatherGuidance(weather: WeatherInfo): string[] {
    const tips: string[] = [];
    if (weather.temp >= 25) {
      tips.push(`Warm weather (${weather.temp}°C): lightweight breathable fabrics (linen/cotton) to maximize comfort.`);
    } else if (weather.temp <= 16) {
      tips.push(`Brisk climate (${weather.temp}°C): structured layering with knitwear or a jacket.`);
    } else {
      tips.push(`Mild temperature (${weather.temp}°C): balanced transition pieces with versatile silhouettes.`);
    }

    if (weather.rainChance >= 40) {
      tips.push(`Rain probability ${weather.rainChance}%: rain-safe fabrics prioritized, avoiding delicate silks and floor-grazing hems.`);
    } else {
      tips.push(`Low rain probability (${weather.rainChance}%): optimal for open sandals, suede textures, and delicate drapery.`);
    }

    return tips;
  }
}
