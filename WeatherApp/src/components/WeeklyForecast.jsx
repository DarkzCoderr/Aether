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
import { formatDay, getWeatherIconKey, toDisplayTemp } from '../utils/formatters';

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

export default function WeeklyForecast({ forecast, unit }) {
  if (!forecast) {
    return <section className="weekly-grid" aria-hidden="true" />;
  }

  const lows = forecast.daily.map((item) => toDisplayTemp(item.temp_min, unit));
  const highs = forecast.daily.map((item) => toDisplayTemp(item.temp_max, unit));
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const range = Math.max(max - min, 1);

  return (
    <section className="weekly-grid">
      {forecast.daily.map((item, index) => {
        const day = index === 0 ? 'Today' : formatDay(item.dt, forecast.timezone_offset);
        const low = toDisplayTemp(item.temp_min, unit);
        const high = toDisplayTemp(item.temp_max, unit);
        const left = ((low - min) / range) * 100;
        const width = Math.max(((high - low) / range) * 100, 6);
        const rain = Math.round((item.pop ?? 0) * 100);
        const Icon = ICONS[getWeatherIconKey(item.condition.id, true)] || ICONS.default;

        return (
          <article className="weekly-row" key={item.dt}>
            <p className={`weekly-day ${index === 0 ? 'is-today' : ''}`}>{day}</p>
            <Icon size={22} />
            <p className="weekly-rain">{rain > 0 ? `${rain}%` : '-'}</p>

            <div className="weekly-track-wrap">
              <span>{low}{DEGREE}</span>
              <div className="weekly-track">
                <div className="weekly-fill" style={{ left: `${left}%`, width: `${width}%` }} />
              </div>
            </div>

            <p className="weekly-high">{high}{DEGREE}</p>
          </article>
        );
      })}
    </section>
  );
}
