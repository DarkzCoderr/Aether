import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiAlertCircle, FiMapPin } from 'react-icons/fi';
import { WiCloud } from 'react-icons/wi';

import BackgroundLayer from './components/BackgroundLayer';
import SearchBar from './components/SearchBar';
import WeatherHero from './components/WeatherHero';
import WeatherStats from './components/WeatherStats';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';

import { useGeolocation } from './hooks/useGeolocation';
import { useWeather } from './hooks/useWeather';
import { useForecast } from './hooks/useForecast';
import { getWeatherIconKey } from './utils/formatters';
import { isDaytime as checkDaytime } from './utils/weatherThemes';

const MAX_RECENT = 5;
const RECENT_KEY = 'aether_recent_searches';
const DEGREE = '\u00B0';

const loadRecent = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecent = (city, previous) => {
  const normalized = city.trim();
  const next = [normalized, ...previous.filter((c) => c.toLowerCase() !== normalized.toLowerCase())].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // no-op
  }
  return next;
};

const accentFamily = (code) => {
  if (code >= 200 && code < 300) return 'storm';
  if (code >= 300 && code < 600) return 'cool';
  if (code >= 600 && code < 700) return 'snow';
  if (code === 800) return 'warm';
  return 'cool';
};

const HeaderUnitToggle = ({ unit, onChange }) => (
  <div className="unit-toggle" role="group" aria-label="Temperature unit">
    {['C', 'F'].map((nextUnit) => (
      <button
        key={nextUnit}
        type="button"
        className={`unit-button ${unit === nextUnit ? 'is-active' : ''}`}
        onClick={() => onChange(nextUnit)}
      >
        {nextUnit}{DEGREE}
      </button>
    ))}
  </div>
);

const ErrorBanner = ({ message }) => (
  <Motion.aside
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="error-banner"
  >
    <FiAlertCircle size={16} />
    <p>{message}</p>
  </Motion.aside>
);

const EmptyState = ({ geoLoading, geoError }) => (
  <section className="empty-state weather-card">
    <div className="empty-pill">
      <FiMapPin size={14} />
      <span>Aether Weather</span>
    </div>
    <h2>Sky Conditions</h2>
    <p>
      {geoLoading
        ? 'Detecting your location and preparing weather details.'
        : geoError
          ? 'Location permission is unavailable. Search for a city to continue.'
          : 'Allow location access or search for a city to begin.'}
    </p>
  </section>
);

const LoadingState = () => (
  <div className="loading-wrap">
    <Motion.div
      className="loading-ring weather-card"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
    />
  </div>
);

export default function App() {
  const [unit, setUnit] = useState('C');
  const [recentSearches, setRecentSearches] = useState(loadRecent);
  const [conditionCode, setConditionCode] = useState(800);
  const [isDaytime, setIsDaytime] = useState(true);
  const [iconKey, setIconKey] = useState('clear-day');
  const [viewKey, setViewKey] = useState(0);
  const geoTriggeredRef = useRef(false);

  const { coords, loading: geoLoading, error: geoError } = useGeolocation();
  const { weather, loading: weatherLoading, error: weatherError, fetchByCity, fetchByCoords } = useWeather();
  const { forecast, loading: forecastLoading, error: forecastError, fetchForecast } = useForecast();

  const updateTheme = useCallback((data) => {
    if (!data) return;
    const code = data.weather?.[0]?.id ?? 800;
    const day = checkDaytime(data.sys?.sunrise, data.sys?.sunset);
    setConditionCode(code);
    setIsDaytime(day);
    setIconKey(getWeatherIconKey(code, day));
  }, []);

  useEffect(() => {
    if (!coords || geoTriggeredRef.current) return;
    geoTriggeredRef.current = true;
    fetchByCoords(coords.lat, coords.lon).then((data) => {
      if (!data) return;
      updateTheme(data);
      fetchForecast(data.coord.lat, data.coord.lon);
    });
  }, [coords, fetchByCoords, fetchForecast, updateTheme]);

  const handleSearch = useCallback(async (city) => {
    const data = await fetchByCity(city);
    if (!data) return;
    setRecentSearches((prev) => saveRecent(city, prev));
    setViewKey((prev) => prev + 1);
    updateTheme(data);
    await fetchForecast(data.coord.lat, data.coord.lon);
  }, [fetchByCity, fetchForecast, updateTheme]);

  const handleGeolocate = useCallback(() => {
    if (!coords) return;
    fetchByCoords(coords.lat, coords.lon).then((data) => {
      if (!data) return;
      updateTheme(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      setViewKey((prev) => prev + 1);
    });
  }, [coords, fetchByCoords, fetchForecast, updateTheme]);

  const isLoading = weatherLoading || forecastLoading;
  const error = weatherError || forecastError;

  const accent = useMemo(() => {
    const family = accentFamily(conditionCode);
    if (family === 'warm') return 'var(--accent-warm)';
    if (family === 'storm') return 'var(--accent-storm)';
    if (family === 'snow') return 'var(--accent-snow)';
    return 'var(--accent-cool)';
  }, [conditionCode]);

  const appStyle = useMemo(() => ({
    '--dynamic-accent': accent,
    '--dynamic-accent-soft': `color-mix(in srgb, ${accent} 20%, transparent)`,
  }), [accent]);

  return (
    <div className="app-shell" style={appStyle}>
      <BackgroundLayer conditionCode={conditionCode} isDaytime={isDaytime} />

      <div className="app-surface">
        <header className="app-header">
          <div className="brand-wrap">
            <div className="brand-core">
              <img src="/logo.png" alt="Logo" width={32} />
              <span className="brand-title">Aether</span>
            </div>
            <span className="brand-tag">Atmospheric Edition</span>
          </div>

          <div className="header-actions">
            <SearchBar
              onSearch={handleSearch}
              onGeolocate={handleGeolocate}
              isGeoLoading={geoLoading}
              recentSearches={recentSearches}
            />
            <HeaderUnitToggle unit={unit} onChange={setUnit} />
          </div>
        </header>

        <AnimatePresence>{error ? <ErrorBanner message={error} /> : null}</AnimatePresence>

        {!weather && !isLoading ? <EmptyState geoLoading={geoLoading} geoError={geoError} /> : null}
        {isLoading && !weather ? <LoadingState /> : null}

        <AnimatePresence mode="wait">
          {(weather || (isLoading && weather)) && (
            <Motion.main
              key={viewKey}
              className="dashboard"
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(3px)' }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <section className="hero-column">
                <WeatherHero
                  weather={weather}
                  unit={unit}
                  iconKey={iconKey}
                  accentColor={accent}
                  timezoneOffset={forecast?.timezone_offset}
                  hourly={forecast?.hourly}
                  sunrise={weather?.sys?.sunrise}
                  sunset={weather?.sys?.sunset}
                />
              </section>

              <section className="data-column weather-card">
                <div className="data-stack">
                  <WeatherStats weather={weather} unit={unit} />
                  <HourlyForecast
                    forecast={forecast}
                    unit={unit}
                    sunrise={weather?.sys?.sunrise}
                    sunset={weather?.sys?.sunset}
                  />
                  <WeeklyForecast forecast={forecast} unit={unit} />
                </div>
              </section>
            </Motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
