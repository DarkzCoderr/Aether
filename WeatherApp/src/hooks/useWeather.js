import { useState, useCallback } from 'react';
import axios from 'axios';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const getErrorMessage = (err, context = '') => {
  if (err.response?.status === 401) {
    return `API key error (401). ${
      !API_KEY || API_KEY === 'your_openweathermap_api_key_here'
        ? 'No API key set - add your key to the .env file.'
        : 'Key may still be activating (takes up to 2 hours for new free-tier keys).'
    }`;
  }
  if (err.response?.status === 404) return `${context} not found. Check the spelling.`;
  if (err.response?.status === 429) return 'Too many requests - free tier limit reached. Try again in a minute.';
  if (!navigator.onLine) return 'No internet connection. Check your network.';
  return `Failed to load weather data. ${err.message || ''}`;
};

export const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByCity = useCallback(async (city) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/weather`, {
        params: { q: city, appid: API_KEY },
      });
      setWeather(res.data);
      return res.data;
    } catch (err) {
      setError(getErrorMessage(err, `City "${city}"`));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/weather`, {
        params: { lat, lon, appid: API_KEY },
      });
      setWeather(res.data);
      return res.data;
    } catch (err) {
      setError(getErrorMessage(err, 'Location'));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchByCity, fetchByCoords };
};
