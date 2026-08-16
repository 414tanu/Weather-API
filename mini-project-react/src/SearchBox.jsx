// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import "./SearchBox.css";
// import { useState } from 'react';

// export default function SearchBox({ updateInfo }) {
//   let [city, setCity] = useState("");
//   let [error, setError] = useState(false);
//   const API_URL = "https://api.openweathermap.org/data/2.5/weather";
//   const API_KEY = "2eee08186a33bdbdabfe7bef3887f3f2";

//   let getWeatherInfo = async () => {
//     let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
//     let jsonResponse = await response.json();
//     console.log(jsonResponse);

//     // yahan error check
//     if (jsonResponse.cod !== 200) {
//       throw new Error(jsonResponse.message);
//     }

//     let result = {
//       city: city,
//       temp: jsonResponse.main.temp,
//       tempMin: jsonResponse.main.temp_min,
//       tempMax: jsonResponse.main.temp_max,
//       humidity: jsonResponse.main.humidity,
//       feelsLike: jsonResponse.main.feels_like,
//       weather: jsonResponse.weather[0].description,
//     };
//     console.log(result);
//     return result;
//   };

//   let handleChange = (evt) => {
//     setCity(evt.target.value);
//   };

//   let handleSubmit = async (evt) => {
//     evt.preventDefault();
//     console.log(city);
//     setCity("");
//     try {
//       let newInfo = await getWeatherInfo();
//       updateInfo(newInfo);
//       setError(false); // success pe error hatao
//       setCity("");
//     } catch (err) {
//       console.error(err);
//       setError(true);
//     }
//   };

//   return (
//     <div className="SearchBox">
//       <form onSubmit={handleSubmit}>
//         <TextField
//           id="city"
//           label="City Name"
//           variant="outlined"
//           required
//           value={city}
//           onChange={handleChange}
//         />
//         <br /><br />
//         <br></br>
//         <Button variant="contained" type="submit">Search</Button>
//         {error && <p style={{ color: "red" }}>No such place exists!</p>}
//       </form>
//     </div>
//   );
// }



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
  const API_KEY = "aa2cf8819475d67e138795bdba57a945"; // replace with your key

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

  let getWeatherInfo = async (queryType, queryData) => {
    let url = "";
    if (queryType === "city") {
      url = `${API_URL}?q=${queryData}&appid=${API_KEY}&units=metric`;
    } else if (queryType === "coords") {
      url = `${API_URL}?lat=${queryData.lat}&lon=${queryData.lon}&appid=${API_KEY}&units=metric`;
    }

    let response = await fetch(url);
    let jsonResponse = await response.json();

    if (jsonResponse.cod !== 200) {
      throw new Error(jsonResponse.message);
    }

    let result = {
      city: jsonResponse.name,
      lat: jsonResponse.coord.lat,
      lon: jsonResponse.coord.lon,
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
    };
    return result;
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchCity) => {
      if (!searchCity.trim()) return;
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

  let handleChange = (evt) => {
    setCity(evt.target.value);
    debouncedSearch(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    if(evt) evt.preventDefault();
    if (!city.trim()) return;
    
    // Cancel the debounced call since we are manually submitting
    debouncedSearch.cancel();
    
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
