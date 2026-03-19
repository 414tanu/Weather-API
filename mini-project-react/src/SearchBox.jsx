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



import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import "./SearchBox.css";

export default function SearchBox({ updateInfo, bgClass }) {
  let [city, setCity] = useState("");
  let [error, setError] = useState(false);
  let [loadingLocation, setLoadingLocation] = useState(false);
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
    };
    return result;
  };

  let handleChange = (evt) => {
    setCity(evt.target.value);
  };

  let handleSubmit = async (evt) => {
    if(evt) evt.preventDefault();
    if (!city.trim()) return;
    try {
      let newInfo = await getWeatherInfo("city", city);
      updateInfo(newInfo);
      saveToRecentSearches(newInfo.city);
      setError(false);
      setCity("");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  let handleHistoryClick = async (pastCity) => {
    try {
      let newInfo = await getWeatherInfo("city", pastCity);
      updateInfo(newInfo);
      saveToRecentSearches(newInfo.city);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
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
    <div className="SearchBox">
      <form className="search-form" onSubmit={handleSubmit}>
        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
          size="small"
        />
        <Button 
          variant="contained" 
          type="submit" 
          sx={{ ml: 2 }} 
          startIcon={<SearchIcon />}
          color="primary"
        >
          Search
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

      {error && <p style={{ color: "red" }}>No such place exists!</p>}

      {recentSearches.length > 0 && (
        <div className="recent-searches">
          <p className="history-title"><HistoryIcon fontSize="small"/> Recent:</p>
          <div className="chips-container">
            {recentSearches.map((search, index) => (
              <Chip 
                key={index} 
                label={search} 
                onClick={() => handleHistoryClick(search)} 
                variant="outlined" 
                clickable 
                sx={{ m: 0.5, color: '#2c3e50', borderColor: '#c1c7d0' }} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
