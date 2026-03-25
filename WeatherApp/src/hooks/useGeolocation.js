import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Search for a city above.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('Unable to retrieve location.');
        }
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return { coords, error, loading };
};
