import { useMemo } from 'react';
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
import { formatHour, getWeatherIconKey, toDisplayTemp } from '../utils/formatters';

const DEGREE = '\u00B0';

const ICONS = {
  'clear-day': WiDaySunny,
  'clear-night': WiNightClear,
  'partly-cloudy-day': WiDayCloudy,
  'partly-cloudy-night': WiNightAltCloudy,
  cloudy: WiCloudy,
  overcast: WiCloudy,
  fog: WiFog,
  drizzle: WiSprinkle,
  rain: WiRain,
  thunderstorm: WiThunderstorm,
  snow: WiSnow,
  default: WiDaySunny,
};

const HourCard = ({ item, unit, timezoneOffset, sunrise, sunset, active }) => {
  const hour = formatHour(item.dt, timezoneOffset);
  const precipitation = Math.round((item.pop ?? 0) * 100);
  const day = item.dt >= sunrise && item.dt <= sunset;
  const iconKey = getWeatherIconKey(item.condition.id, day);
  const Icon = ICONS[iconKey] || ICONS.default;

  return (
    <article className={`hour-card ${active ? 'is-active' : ''}`}>
      <p className="hour-card-time">{hour}</p>
      <Icon size={24} className="hour-card-icon" />
      <p className="hour-card-temp">{toDisplayTemp(item.temp, unit)}{DEGREE}</p>
      <p className="hour-card-rain">{precipitation > 0 ? `${precipitation}% rain` : ''}</p>
    </article>
  );
};

export default function HourlyForecast({ forecast, unit, sunrise, sunset }) {
  const activeIndex = useMemo(() => 0, []);

  if (!forecast) {
    return <section className="hourly-strip" aria-hidden="true" />;
  }

  return (
    <section className="hourly-strip">
      <div className="hourly-scroll">
        {forecast.hourly.map((item, index) => (
          <HourCard
            key={item.dt}
            item={item}
            unit={unit}
            timezoneOffset={forecast.timezone_offset}
            sunrise={sunrise}
            sunset={sunset}
            active={index === activeIndex}
          />
        ))}
      </div>
    </section>
  );
}
