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

export class WeatherService {
  private static cachedWeather: WeatherInfo | null = null;
  private static lastFetchTime: number = 0;

  /**
   * Detects real local weather via browser geolocation, querying Open-Meteo live API.
   * Falls back gracefully to default Milan weather if permission denied or offline.
   */
  public static async getCurrentWeather(forceRefresh: boolean = false): Promise<WeatherInfo> {
    const now = Date.now();
    // Cache for 5 minutes unless forced
    if (!forceRefresh && this.cachedWeather && now - this.lastFetchTime < 300000) {
      return this.cachedWeather;
    }

    // Default fallback (Milan Fashion District)
    const fallbackWeather: WeatherInfo = {
      temp: 26,
      condition: 'Partly Cloudy',
      rainChance: 35,
      isRainSafe: false,
      location: 'Milan, Italy',
      humidity: 54,
      windSpeed: '12 km/h',
      summary: 'Pleasant ambient warmth with soft breeze in the fashion district.',
      advice: 'Breathable linen or cotton twill paired with structured accessories.'
    };

    if (typeof window === 'undefined') {
      return fallbackWeather;
    }

    try {
      // 1. Try to get user's real browser coordinates
      const coords = await this.getUserCoordinates();
      
      let lat = 45.4642;
      let lon = 9.1900;
      let locationName = 'Milan, Italy';

      if (coords) {
        lat = coords.latitude;
        lon = coords.longitude;
        locationName = `Local (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`;
        
        // Reverse geocode city name if possible via open-meteo geocoding or bigdatacloud free endpoint
        try {
          const geoRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
            { signal: AbortSignal.timeout(2500) }
          );
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const city = geoData.city || geoData.locality || geoData.principalSubdivision;
            const country = geoData.countryCode || geoData.countryName;
            if (city) {
              locationName = `${city}${country ? `, ${country}` : ''}`;
            }
          }
        } catch {
          // If reverse geocoding times out, keep lat/lon label
        }
      }

      // 2. Fetch live real-time forecast from Open-Meteo
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=precipitation_probability&forecast_days=1`;
      
      const res = await fetch(weatherUrl, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
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

        const isRainSafe = maxRainProb >= 45;
        let advice = 'Breathable lightweight layers suited for comfortable movement.';
        if (currentTemp >= 28) {
          advice = 'Heat-adapted styling: breathable linen, open silhouettes, and UV-safe shades.';
        } else if (currentTemp <= 15) {
          advice = 'Cold-adapted layering: structured wool blend, fine knitwear, and sturdy boots.';
        } else if (isRainSafe) {
          advice = 'Rain-safe choice: water-resistant footwear and tailored crops to avoid damp hems.';
        }

        const detectedWeather: WeatherInfo = {
          temp: currentTemp,
          condition: wmoInfo.condition,
          rainChance: Math.max(wmoInfo.rainChance, maxRainProb),
          isRainSafe,
          location: locationName,
          humidity,
          windSpeed,
          summary: wmoInfo.summary,
          advice
        };

        this.cachedWeather = detectedWeather;
        this.lastFetchTime = Date.now();
        return detectedWeather;
      }
    } catch {
      // Fallback
    }

    this.cachedWeather = fallbackWeather;
    this.lastFetchTime = Date.now();
    return fallbackWeather;
  }

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
        { timeout: 3500, maximumAge: 600000 }
      );
    });
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
