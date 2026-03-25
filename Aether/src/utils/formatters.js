/**
 * Utility helpers - temperature conversion, date/time formatting.
 */

export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);
export const fahrenheitToCelsius = (f) => Math.round(((f - 32) * 5) / 9);

export const toDisplayTemp = (kelvin, unit = 'C') => {
  const celsius = Math.round(kelvin - 273.15);
  return unit === 'F' ? celsiusToFahrenheit(celsius) : celsius;
};

export const formatHour = (unixTimestamp, timezoneOffset = 0) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}${suffix}`;
};

export const formatDay = (unixTimestamp, timezoneOffset = 0) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
};

export const formatFullDate = (unixTimestamp, timezoneOffset = 0) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

export const formatTime = (unixTimestamp, timezoneOffset = 0) => {
  const date = new Date((unixTimestamp + timezoneOffset) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${minutes} ${suffix}`;
};

export const formatWindSpeed = (mps, unit = 'C') => {
  if (unit === 'F') {
    return `${Math.round(mps * 2.237)} mph`;
  }
  return `${Math.round(mps * 3.6)} km/h`;
};

export const formatVisibility = (meters) => {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters} m`;
};

export const getUVLabel = (uvi) => {
  if (uvi <= 2) return { label: 'Low', color: '#4ade80' };
  if (uvi <= 5) return { label: 'Moderate', color: '#facc15' };
  if (uvi <= 7) return { label: 'High', color: '#fb923c' };
  if (uvi <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#a855f7' };
};

export const getWeatherIconKey = (conditionCode, isDay = true) => {
  if (conditionCode >= 200 && conditionCode < 300) return 'thunderstorm';
  if (conditionCode >= 300 && conditionCode < 400) return 'drizzle';
  if (conditionCode >= 500 && conditionCode < 600) return 'rain';
  if (conditionCode >= 600 && conditionCode < 700) return 'snow';
  if (conditionCode >= 700 && conditionCode < 800) return 'fog';
  if (conditionCode === 800) return isDay ? 'clear-day' : 'clear-night';
  if (conditionCode === 801) return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
  if (conditionCode >= 802 && conditionCode <= 804) return 'cloudy';
  return 'default';
};
