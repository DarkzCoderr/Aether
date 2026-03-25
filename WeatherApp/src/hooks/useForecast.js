import { useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const useForecast = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchForecast = useCallback(async (lat, lon) => {
    if (!lat || !lon) return;
    setLoading(true);
    setError(null);
    try {
      // Use the free /forecast endpoint (5-day / 3-hour intervals)
      const res = await axios.get(`${BASE_URL}/forecast`, {
        params: { lat, lon, appid: API_KEY, cnt: 40 },
      });
      const list = res.data.list;

      // Build hourly: next 24 entries (3h * 8 = 24h)
      const hourly = list.slice(0, 8).map((item) => ({
        dt: item.dt,
        temp: item.main.temp,
        feels_like: item.main.feels_like,
        humidity: item.main.humidity,
        condition: item.weather[0],
        pop: item.pop ?? 0,
        wind_speed: item.wind.speed,
      }));

      // Build daily: group by day (UTC date), take max/min
      const dayMap = {};
      list.forEach((item) => {
        const date = new Date(item.dt * 1000).toUTCString().split(' ').slice(0, 4).join(' ');
        if (!dayMap[date]) {
          dayMap[date] = {
            dt: item.dt,
            temps: [],
            conditions: [],
            pops: [],
          };
        }
        dayMap[date].temps.push(item.main.temp);
        dayMap[date].conditions.push(item.weather[0]);
        dayMap[date].pops.push(item.pop ?? 0);
      });

      const daily = Object.values(dayMap)
        .slice(0, 7)
        .map((day) => ({
          dt: day.dt,
          temp_max: Math.max(...day.temps),
          temp_min: Math.min(...day.temps),
          condition: day.conditions[Math.floor(day.conditions.length / 2)],
          pop: Math.max(...day.pops),
        }));

      setForecast({ hourly, daily, timezone_offset: res.data.city.timezone });
      return { hourly, daily, timezone_offset: res.data.city.timezone };
    } catch {
      setError('Failed to fetch forecast data.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { forecast, loading, error, fetchForecast };
};

