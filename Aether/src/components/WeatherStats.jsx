import { motion as Motion } from 'framer-motion';
import { MdVisibility } from 'react-icons/md';
import { WiBarometer, WiDaySunny, WiHumidity, WiStrongWind, WiThermometer } from 'react-icons/wi';
import { formatVisibility, formatWindSpeed, getUVLabel, toDisplayTemp } from '../utils/formatters';

const DEGREE = '\u00B0';

const StatTile = ({ icon, label, value, unit, tone, delay }) => {
  const IconComponent = icon;

  return (
    <Motion.article
      className="stat-item"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay }}
    >
      <div className="stat-title-row">
        <IconComponent size={20} />
        <p>{label}</p>
      </div>
      <p className="stat-value" style={{ color: tone }}>{value}</p>
      <p className="stat-unit">{unit}</p>
    </Motion.article>
  );
};

export default function WeatherStats({ weather, unit }) {
  if (!weather) {
    return <div className="stats-grid" />;
  }

  const uv = weather.uvi ?? 0;
  const uvLabel = getUVLabel(uv);

  const stats = [
    { icon: WiHumidity, label: 'Humidity', value: `${weather.main.humidity}%`, unit: 'Relative moisture', tone: 'var(--dynamic-accent)' },
    { icon: WiStrongWind, label: 'Wind Speed', value: formatWindSpeed(weather.wind?.speed ?? 0, unit), unit: 'Surface flow', tone: 'var(--text-primary)' },
    { icon: WiDaySunny, label: 'UV Index', value: uv.toString(), unit: uvLabel.label, tone: uvLabel.color },
    { icon: MdVisibility, label: 'Visibility', value: formatVisibility(weather.visibility ?? 10000), unit: 'Distance', tone: 'var(--text-primary)' },
    { icon: WiBarometer, label: 'Pressure', value: `${weather.main.pressure}`, unit: 'hPa', tone: 'var(--text-primary)' },
    {
      icon: WiThermometer,
      label: 'Feels Like',
      value: `${toDisplayTemp(weather.main.feels_like, unit)}${DEGREE}${unit}`,
      unit: 'Perceived temperature',
      tone: 'var(--dynamic-accent)',
    },
  ];

  return (
    <section className="stats-grid">
      {stats.map((entry, index) => (
        <StatTile key={entry.label} {...entry} delay={index * 0.04} />
      ))}
    </section>
  );
}
