import { useState } from "react"; 
import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import "./WeatherApp.css"; 


export default function WeatherApp() {
  const [weatherInfo, setWeatherInfo] = useState({
    city: "Switzerland",
    feelslike: 24.84,
    temp: 25.05,
    tempMin: 25.05,
    tempMax: 25.05,
    humidity: 47,
    weather: "Clouds",
    description: "scattered clouds",
    windSpeed: 3.5,
    visibility: 10,
    sunrise: 1670000000,
    sunset: 1670040000,
  });

  let updateInfo = (newInfo) => {
    setWeatherInfo(newInfo);
  };

  // Determine Background Class
  let bgClass = "weather-default";
  const wType = weatherInfo.weather ? weatherInfo.weather.toLowerCase() : "";
  if (wType.includes("rain") || wType.includes("drizzle") || wType.includes("thunder")) {
    bgClass = "weather-rain";
  } else if (weatherInfo.temp > 20) {
    bgClass = "weather-hot";
  } else if (weatherInfo.temp <= 20) {
    bgClass = "weather-cold";
  }

  return (
    <div className="WeatherApp">
      <h2 style={{ marginBottom: "30px", fontSize: "2.5rem", fontWeight: "800", color: "#2c3e50" }}>WeatheRate</h2>
      <SearchBox updateInfo={updateInfo} bgClass={bgClass} />
      <InfoBox info={weatherInfo} bgClass={bgClass} />
    </div>
  )
}