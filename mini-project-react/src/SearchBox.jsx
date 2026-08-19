import { useState, useEffect, useCallback } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import debounce from 'lodash.debounce';
import "./SearchBox.css";

export default function SearchBox({ updateInfo }) {
  let [city, setCity] = useState("");
  let [error, setError] = useState(false);
  let [loadingLocation, setLoadingLocation] = useState(false);
  let [loading, setLoading] = useState(false);
  let [recentSearches, setRecentSearches] = useState([]);

  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  // Use Vite env var. Set VITE_OPENWEATHER_API_KEY in Vercel environment variables.
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
  if (!API_KEY) {
    console.warn('VITE_OPENWEATHER_API_KEY is not set. Please set it in your environment variables.');
  }

  useEffect(() => {
    // Load recent searches from local storage on mount
    const savedSearches = JSON.parse(localStorage.getItem('weatherRecentSearches')) || [];
    setRecentSearches(savedSearches);
  }, []);

  const saveToRecentSearches = (cityName) => {
    let updatedSearches = [cityName, ...recentSearches.filter(c => c !== cityName)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(updatedSearches));
  };

  const handleDeleteSearch = (cityName) => {
    let updatedSearches = recentSearches.filter(c => c !== cityName);
    setRecentSearches(updatedSearches);
    localStorage.setItem('weatherRecentSearches', JSON.stringify(updatedSearches));
  };

  // Helper: aggregate day/eve/night temps from 3-hour forecast
  const aggregateFromForecast = (list, timezoneOffsetSeconds) => {
    // timezoneOffsetSeconds is seconds to add to UTC to get local time
    const segments = { day: [], evening: [], night: [] };
    const nowUtcMs = Date.now();
    const localNow = new Date(nowUtcMs + (timezoneOffsetSeconds * 1000));
    const targetLocalDate = localNow.toISOString().split('T')[0]; // YYYY-MM-DD

    list.forEach(item => {
      const utcMs = item.dt * 1000;
      const localMs = utcMs + (timezoneOffsetSeconds * 1000);
      const localDateObj = new Date(localMs);
      const localDateStr = localDateObj.toISOString().split('T')[0];
      if (localDateStr !== targetLocalDate) return; // only current day
      const hour = localDateObj.getUTCHours();
      // Map hour to segment: day (6-17), evening (17-21), night (21-5)
      if (hour >= 6 && hour < 17) segments.day.push(item.main.temp);
      else if (hour >= 17 && hour < 21) segments.evening.push(item.main.temp);
      else segments.night.push(item.main.temp);
    });

    const avg = (arr) => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length) : null;
    return {
      dayTemp: avg(segments.day),
      eveningTemp: avg(segments.evening),
      nightTemp: avg(segments.night)
    };
  };

  let getWeatherInfo = async (queryType, queryData) => {
    let url = "";
    if (queryType === "city") {
      url = `${API_URL}?q=${encodeURIComponent(queryData)}&appid=${API_KEY}&units=metric`;
    } else if (queryType === "coords") {
      url = `${API_URL}?lat=${queryData.lat}&lon=${queryData.lon}&appid=${API_KEY}&units=metric`;
    }

    let response = await fetch(url);
    let jsonResponse = await response.json();

    if (jsonResponse.cod !== 200 && String(jsonResponse.cod) !== "200") {
      throw new Error(jsonResponse.message || 'Failed to fetch weather');
    }

    // Prepare display and query names
    const cityNameRaw = jsonResponse.name || (queryData.city || '');
    const countryCode = jsonResponse.sys?.country || '';
    const cityDisplay = countryCode ? `${cityNameRaw}, ${countryCode}` : cityNameRaw;
    const cityQuery = cityNameRaw; // plain city for queries if needed

    // Add One Call API to grab daily temps (preferred)
    const lat = jsonResponse.coord.lat;
    const lon = jsonResponse.coord.lon;
    const timezone = jsonResponse.timezone || 0; // seconds

    let oneCallData = null;
    try {
      const oneCallUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`;
      const ocRes = await fetch(oneCallUrl);
      oneCallData = await ocRes.json();
      if (!oneCallData || !oneCallData.daily) oneCallData = null;
    } catch (e) {
      console.warn('One Call API fetch failed', e);
      oneCallData = null;
    }

    // If One Call failed, try 5-day forecast endpoint and aggregate for the current day
    let dayTemp = null, eveningTemp = null, nightTemp = null, dailyRaw = null;
    if (oneCallData) {
      dayTemp = oneCallData.daily?.[0]?.temp?.day ?? null;
      eveningTemp = oneCallData.daily?.[0]?.temp?.eve ?? null;
      nightTemp = oneCallData.daily?.[0]?.temp?.night ?? null;
      dailyRaw = oneCallData.daily ?? null;
    } else {
      try {
        const forecastUrl = `${API_URL.replace('/weather','/forecast')}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const fRes = await fetch(forecastUrl);
        const fJson = await fRes.json();
        if (fJson && fJson.list) {
          const agg = aggregateFromForecast(fJson.list, timezone);
          dayTemp = agg.dayTemp;
          eveningTemp = agg.eveningTemp;
          nightTemp = agg.nightTemp;
          dailyRaw = fJson.list;
        }
      } catch (e) {
        console.warn('Forecast aggregation failed', e);
      }
    }

    let result = {
      city: cityDisplay,      // display-friendly
      cityQuery: cityQuery,   // plain city for queries if needed
      lat: lat,
      lon: lon,
      temp: jsonResponse.main.temp,
      tempMin: jsonResponse.main.temp_min,
      tempMax: jsonResponse.main.temp_max,
      humidity: jsonResponse.main.humidity,
      feelslike: jsonResponse.main.feels_like,
      pressure: jsonResponse.main.pressure,
      weather: jsonResponse.weather[0].main,
      description: jsonResponse.weather[0].description,
      windSpeed: jsonResponse.wind.speed,
      visibility: jsonResponse.visibility / 1000, // convert to km
      sunrise: jsonResponse.sys.sunrise,
      sunset: jsonResponse.sys.sunset,
      timezone: jsonResponse.timezone,
      dayTemp: dayTemp !== null ? Math.round(dayTemp * 10) / 10 : null,
      eveningTemp: eveningTemp !== null ? Math.round(eveningTemp * 10) / 10 : null,
      nightTemp: nightTemp !== null ? Math.round(nightTemp * 10) / 10 : null,
      dailyRaw: dailyRaw
    };
    return result;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchCity) => {
      if (!searchCity || !searchCity.trim()) return;
      setLoading(true);
      try {
        let newInfo = await getWeatherInfo("city", searchCity);
        updateInfo(newInfo);
        saveToRecentSearches(newInfo.city);
        setError(false);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  // Cancel debounced calls on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel && debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  let handleChange = (evt) => {
    setCity(evt.target.value);
    debouncedSearch(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    if(evt) evt.preventDefault();
    if (!city.trim()) return;

    // Cancel the debounced call since we are manually submitting
    debouncedSearch.cancel && debouncedSearch.cancel();

    setLoading(true);
    try {
      let newInfo = await getWeatherInfo("city", city);
      updateInfo(newInfo);
      saveToRecentSearches(newInfo.city);
      setError(false);
      setCity("");
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  let handleHistoryClick = async (pastCity) => {
    setLoading(true);
    try {
      let newInfo = await getWeatherInfo("city", pastCity);
      updateInfo(newInfo);
      saveToRecentSearches(newInfo.city);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  let handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        try {
          let newInfo = await getWeatherInfo("coords", { lat, lon });
          updateInfo(newInfo);
          saveToRecentSearches(newInfo.city);
          setError(false);
        } catch (err) {
          console.error(err);
          setError(true);
        } finally {
          setLoadingLocation(false);
        }
      }, (error) => {
        console.error("Error getting location: ", error);
        setLoadingLocation(false);
        alert("Please allow location access to use this feature.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="SearchBox glass-card">
      <form className="search-form" onSubmit={handleSubmit}>
        <TextField
          id="location"
          label="Search Location"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
          size="small"
        />
        <Button 
          variant="contained" 
          type="submit" 
          sx={{ ml: 2, minWidth: '110px' }} 
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          color="primary"
          disabled={loading}
        >
          {loading ? "..." : "Search"}
        </Button>
      </form>
      
      <div className="location-btn-container">
        <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleGetLocation} 
            startIcon={<LocationOnIcon />}
            disabled={loadingLocation}
          >
            {loadingLocation ? "Locating..." : "Use Current Location"}
        </Button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, textAlign: 'left', backgroundColor: 'rgba(253, 237, 237, 0.9)' }}>
          <AlertTitle>Error</AlertTitle>
          City not found. Please try again.
        </Alert>
      )}

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <p className="history-title"><HistoryIcon fontSize="small"/> Recent:</p>
          <div className="chips-container">
            {recentSearches.map((search, index) => (
              <Chip 
                key={index} 
                label={search} 
                onClick={() => handleHistoryClick(search)} 
                onDelete={() => handleDeleteSearch(search)}
                variant="outlined" 
                clickable 
                sx={{ m: 0.5, color: 'inherit', borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.1)' }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
