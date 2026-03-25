import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
  WiCloudy,
  WiDayCloudy,
  WiDaySunny,
  WiFog,
  WiNightAltCloudy,
  WiNightClear,
  WiRain,
  WiSnow,
  WiSprinkle,
  WiThunderstorm,
} from 'react-icons/wi';
import { formatFullDate, formatHour, getWeatherIconKey, toDisplayTemp } from '../utils/formatters';

const DEGREE = '\u00B0';

const ICONS = {
  'clear-day': { Icon: WiDaySunny, color: 'var(--accent-warm)' },
  'clear-night': { Icon: WiNightClear, color: 'var(--accent-cool)' },
  'partly-cloudy-day': { Icon: WiDayCloudy, color: 'var(--accent-warm)' },
  'partly-cloudy-night': { Icon: WiNightAltCloudy, color: 'var(--accent-cool)' },
  cloudy: { Icon: WiCloudy, color: 'var(--accent-cool)' },
  overcast: { Icon: WiCloudy, color: 'var(--accent-cool)' },
  fog: { Icon: WiFog, color: 'var(--text-muted)' },
  drizzle: { Icon: WiSprinkle, color: 'var(--accent-cool)' },
  rain: { Icon: WiRain, color: 'var(--accent-cool)' },
  thunderstorm: { Icon: WiThunderstorm, color: 'var(--accent-storm)' },
  snow: { Icon: WiSnow, color: 'var(--accent-snow)' },
  default: { Icon: WiDaySunny, color: 'var(--dynamic-accent)' },
};

const formatClock = (unix, offset = 0) => {
  const date = new Date((unix + offset) * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  });
};

const MiniHour = ({ entry, unit, timezoneOffset, sunrise, sunset }) => {
  const isDay = entry.dt >= sunrise && entry.dt <= sunset;
  const iconKey = getWeatherIconKey(entry.condition.id, isDay);
  const { Icon } = ICONS[iconKey] || ICONS.default;
  return (
    <article className="mini-hour-card">
      <p>{formatHour(entry.dt, timezoneOffset)}</p>
      <Icon size={20} />
      <strong>{toDisplayTemp(entry.temp, unit)}{DEGREE}</strong>
    </article>
  );
};

export default function WeatherHero({ weather, unit, iconKey, accentColor, timezoneOffset, hourly, sunrise, sunset }) {
  if (!weather) {
    return <div className="hero-skeleton" aria-hidden="true" />;
  }

  const { Icon, color } = ICONS[iconKey] || ICONS.default;
  const temp = toDisplayTemp(weather.main.temp, unit);
  const feelsLike = toDisplayTemp(weather.main.feels_like, unit);
  const miniHours = (hourly || []).slice(0, 4);

  const regionText = weather?.coord
    ? `${weather.coord.lat.toFixed(2)}${DEGREE}, ${weather.coord.lon.toFixed(2)}${DEGREE}`
    : 'Coordinates unavailable';

  return (
    <article className="hero-panel">
      <div className="hero-head">
        <p className="hero-time">{formatClock(weather.dt, timezoneOffset)} Local</p>
        <p className="hero-date">{formatFullDate(weather.dt, timezoneOffset)}</p>
        <p className="hero-region">{weather.sys?.country || 'N/A'} - {regionText}</p>
        <h2 className="hero-city">{weather.name}</h2>
      </div>

      <div className="hero-core">
        <div className="hero-temp-stack">
          <AnimatePresence mode="wait">
            <Motion.p
              key={`${temp}-${unit}`}
              className="hero-temp"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ color: accentColor }}
            >
              {temp}
              <span>{DEGREE}{unit}</span>
            </Motion.p>
          </AnimatePresence><br />

          <p className="hero-condition">{weather.weather?.[0]?.description || 'Condition unavailable'}</p>
          <p className="hero-feels">Feels like <strong>{feelsLike}{DEGREE}{unit}</strong></p>
        </div>
      </div>

      <Motion.div
        className="hero-icon"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
      >
        <Icon size={126} style={{ color, filter: 'drop-shadow(0 0 20px rgba(0,0,0,0.35))' }} />
      </Motion.div>

      <div className="hero-foot">
        <p className="micro-label">Now to next 12 hours</p>
        <div className="mini-hour-list">
          {miniHours.map((entry) => (
            <MiniHour
              key={entry.dt}
              entry={entry}
              unit={unit}
              timezoneOffset={timezoneOffset}
              sunrise={sunrise}
              sunset={sunset}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
