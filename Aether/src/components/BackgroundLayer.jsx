import { useMemo } from 'react';
import { getWeatherTheme } from '../utils/weatherThemes';

const classifyWeather = (code) => {
  if (code >= 200 && code < 300) return 'storm';
  if (code >= 300 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code === 800) return 'clear';
  if (code > 800) return 'cloud';
  return 'mist';
};

const BackgroundLayer = ({ conditionCode, isDaytime }) => {
  const safeCode = conditionCode ?? 800;
  const theme = useMemo(() => getWeatherTheme(safeCode, isDaytime), [safeCode, isDaytime]);
  const family = classifyWeather(safeCode);

  const accentByWeather = useMemo(() => {
    if (family === 'clear') return 'var(--accent-warm)';
    if (family === 'storm') return 'var(--accent-storm)';
    if (family === 'snow') return 'var(--accent-snow)';
    return 'var(--accent-cool)';
  }, [family]);

  return (
    <>
      <div className="fixed inset-0 z-0" style={{ background: 'var(--bg-base)' }} />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 86% 12%, color-mix(in srgb, ${accentByWeather} 75%, transparent) 0%, transparent 58%),
            radial-gradient(circle at 10% 88%, color-mix(in srgb, ${theme.accent} 70%, transparent) 0%, transparent 56%)
          `,
          opacity: 0.22,
          filter: 'blur(2px)',
          animation: 'blobDrift 20s ease-in-out infinite alternate',
          transition: 'background 1.2s ease',
        }}
      />

      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.85'/%3E%3C/svg%3E\")",
          opacity: 0.04,
          mixBlendMode: 'soft-light',
        }}
      />

      {family === 'clear' && (
        <div className="fixed inset-0 z-0 pointer-events-none ambient-orbs" aria-hidden="true">
          {Array.from({ length: 10 }).map((_, idx) => (
            <span
              key={`orb-${idx}`}
              className="ambient-orb"
              style={{
                left: `${(idx * 11) % 100}%`,
                top: `${(idx * 19) % 100}%`,
                animationDelay: `${idx * 1.3}s`,
                animationDuration: `${14 + (idx % 4) * 5}s`,
                background: `color-mix(in srgb, ${accentByWeather} 65%, transparent)`,
              }}
            />
          ))}
        </div>
      )}

      {(family === 'rain' || family === 'storm') && (
        <div className="fixed inset-0 z-0 pointer-events-none rain-layer" aria-hidden="true">
          <span className="rain-sheet" />
        </div>
      )}

      <style>{`
        @keyframes blobDrift {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-3%, 2%, 0) scale(1.08); }
          100% { transform: translate3d(2%, -2%, 0) scale(0.96); }
        }

        .ambient-orb {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          opacity: 0.35;
          filter: blur(0.5px);
          animation-name: orbFloat;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes orbFloat {
          0% { transform: translate3d(0, 0, 0); opacity: 0.15; }
          50% { transform: translate3d(20px, -18px, 0); opacity: 0.42; }
          100% { transform: translate3d(-14px, -35px, 0); opacity: 0.08; }
        }

        .rain-sheet {
          position: absolute;
          inset: -16%;
          background-image: repeating-linear-gradient(
            125deg,
            rgba(180, 205, 240, 0.09) 0px,
            rgba(180, 205, 240, 0.09) 1px,
            transparent 1px,
            transparent 11px
          );
          animation: rainDrift 12s linear infinite;
          opacity: 0.33;
          filter: blur(0.3px);
        }

        @keyframes rainDrift {
          0% { transform: translate3d(-8%, -8%, 0); }
          100% { transform: translate3d(8%, 8%, 0); }
        }
      `}</style>
    </>
  );
};

export default BackgroundLayer;

