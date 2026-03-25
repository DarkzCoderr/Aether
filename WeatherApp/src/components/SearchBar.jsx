import { motion as Motion } from 'framer-motion';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { useRef, useState } from 'react';

export default function SearchBar({ onSearch, onGeolocate, isGeoLoading, recentSearches }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef(null);
  const suppressRecentRef = useRef(false);

  const submit = (event) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
    setMobileExpanded(false);
    setShowRecent(false);
    inputRef.current?.blur();
  };

  const pickRecent = (city) => {
    setQuery(city);
    onSearch(city);
    setMobileExpanded(false);
    setShowRecent(false);
  };

  const clearQuery = () => {
    setQuery('');
    setShowRecent(false);
    suppressRecentRef.current = true;
    inputRef.current?.focus();
  };

  return (
    <div className={`search-box ${isFocused ? 'is-focused' : ''} ${mobileExpanded ? 'is-expanded' : ''}`}>
      <button
        type="button"
        className="search-collapsed"
        aria-label="Open city search"
        onClick={() => {
          setMobileExpanded(true);
          setTimeout(() => inputRef.current?.focus(), 10);
        }}
      >
        <FiSearch size={14} />
      </button>

      <form className="search-form" onSubmit={submit}>
        <FiSearch size={14} />

        <div className="search-input-wrap">
          <input
            ref={inputRef}
            id="city-search-input"
            className="search-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search city"
            onFocus={() => {
              setIsFocused(true);
              if (suppressRecentRef.current) {
                suppressRecentRef.current = false;
                return;
              }
              setShowRecent(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setMobileExpanded(false);
                setShowRecent(false);
              }, 130);
            }}
          />

          {query.length > 0 ? (
            <button type="button" className="search-clear" onClick={clearQuery} aria-label="Clear search">
              ×
            </button>
          ) : null}

          <button type="button" className="search-geo" id="geolocate-btn" onClick={onGeolocate} aria-label="Use my location">
            <Motion.span
              animate={isGeoLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isGeoLoading ? { repeat: Infinity, ease: 'linear', duration: 1 } : { duration: 0.2 }}
            >
              <FiMapPin size={13} />
            </Motion.span>
          </button>
        </div>
      </form>

      {isFocused && showRecent && recentSearches?.length ? (
        <div className="search-dropdown">
          {recentSearches.slice(0, 5).map((city) => (
            <button key={city} type="button" className="search-dropdown-item" onMouseDown={() => pickRecent(city)}>
              <FiMapPin size={12} />
              <span>{city}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
