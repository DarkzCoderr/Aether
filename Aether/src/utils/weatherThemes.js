/**
 * Maps OpenWeatherMap condition codes + time of day
 * to gradient stops, accent colors, and overlay tints.
 */

export const getWeatherTheme = (conditionCode, isDaytime = true) => {
  // Thunderstorm
  if (conditionCode >= 200 && conditionCode < 300) {
    return {
      gradientFrom: '#0d0d2b',
      gradientMid: '#1a1040',
      gradientTo: '#2d1b69',
      accent: '#9b59b6',
      accentLight: '#c39bd3',
      overlayColor: 'rgba(45, 27, 105, 0.4)',
      meshColors: [
        'rgba(155,89,182,0.35)',
        'rgba(52,31,151,0.25)',
        'rgba(20,10,60,0.4)',
      ],
      label: 'stormy',
    };
  }
  // Drizzle / Rain
  if (conditionCode >= 300 && conditionCode < 600) {
    return {
      gradientFrom: '#0f1923',
      gradientMid: '#1a2d42',
      gradientTo: '#1f3d5c',
      accent: '#5b9bd5',
      accentLight: '#aacfef',
      overlayColor: 'rgba(31, 61, 92, 0.4)',
      meshColors: [
        'rgba(72,144,226,0.3)',
        'rgba(30,90,160,0.2)',
        'rgba(15,30,50,0.5)',
      ],
      label: 'rainy',
    };
  }
  // Snow
  if (conditionCode >= 600 && conditionCode < 700) {
    return {
      gradientFrom: '#141e30',
      gradientMid: '#243b5a',
      gradientTo: '#2c5f8a',
      accent: '#b8d4f0',
      accentLight: '#deeeff',
      overlayColor: 'rgba(44, 95, 138, 0.3)',
      meshColors: [
        'rgba(184,212,240,0.25)',
        'rgba(100,160,220,0.2)',
        'rgba(20,30,48,0.5)',
      ],
      label: 'snowy',
    };
  }
  // Atmosphere (fog, mist, haze)
  if (conditionCode >= 700 && conditionCode < 800) {
    return {
      gradientFrom: '#1a1a2e',
      gradientMid: '#2d2d44',
      gradientTo: '#3d3d56',
      accent: '#a0a8b8',
      accentLight: '#c8cdd8',
      overlayColor: 'rgba(61, 61, 86, 0.4)',
      meshColors: [
        'rgba(160,168,184,0.2)',
        'rgba(100,110,130,0.15)',
        'rgba(26,26,46,0.5)',
      ],
      label: 'foggy',
    };
  }
  // Clear sky
  if (conditionCode === 800) {
    return isDaytime
      ? {
          gradientFrom: '#0d1b3e',
          gradientMid: '#1b3a6b',
          gradientTo: '#2e5fa3',
          accent: '#f5a623',
          accentLight: '#fcd38a',
          overlayColor: 'rgba(46, 95, 163, 0.3)',
          meshColors: [
            'rgba(245,166,35,0.25)',
            'rgba(72,144,226,0.3)',
            'rgba(13,27,62,0.4)',
          ],
          label: 'clear-day',
        }
      : {
          gradientFrom: '#020818',
          gradientMid: '#050f2e',
          gradientTo: '#0a1a4a',
          accent: '#a0b4e8',
          accentLight: '#c8d6f5',
          overlayColor: 'rgba(10, 26, 74, 0.5)',
          meshColors: [
            'rgba(160,180,232,0.2)',
            'rgba(80,110,200,0.15)',
            'rgba(2,8,24,0.7)',
          ],
          label: 'clear-night',
        };
  }
  // Clouds (801-804)
  if (conditionCode > 800) {
    const isHeavy = conditionCode >= 803;
    return {
      gradientFrom: '#111827',
      gradientMid: '#1f2d3d',
      gradientTo: '#2a3f56',
      accent: isHeavy ? '#7a90a8' : '#90adc4',
      accentLight: isHeavy ? '#aabcce' : '#b8d0e4',
      overlayColor: 'rgba(42, 63, 86, 0.35)',
      meshColors: [
        `rgba(${isHeavy ? '100,120,150' : '120,150,190'},0.25)`,
        'rgba(60,90,130,0.2)',
        'rgba(17,24,39,0.5)',
      ],
      label: isHeavy ? 'overcast' : 'cloudy',
    };
  }

  // Default fallback
  return {
    gradientFrom: '#0a0f1e',
    gradientMid: '#111827',
    gradientTo: '#1f2d3d',
    accent: '#7b8fa8',
    accentLight: '#a0b4c8',
    overlayColor: 'rgba(10, 15, 30, 0.5)',
    meshColors: [
      'rgba(120,119,198,0.2)',
      'rgba(72,144,226,0.15)',
      'rgba(10,15,30,0.6)',
    ],
    label: 'default',
  };
};

export const isDaytime = (sunrise, sunset) => {
  const now = Date.now() / 1000; // current Unix timestamp in seconds
  return now >= sunrise && now <= sunset;
};
