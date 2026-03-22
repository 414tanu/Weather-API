import { useState } from "react"; 
import { Box } from "@mui/material";
import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import Background from "./Background";
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
  let bgClass = "bg-default";
  const wType = weatherInfo.weather ? weatherInfo.weather.toLowerCase() : "";
  if (wType.includes("rain") || wType.includes("drizzle") || wType.includes("thunder")) {
    bgClass = "bg-rain";
  } else if (wType.includes("cloud")) {
    bgClass = "bg-cloud";
  } else if (wType.includes("clear") || weatherInfo.temp > 25) {
    bgClass = "bg-sun";
  }

  return (
    <div className="WeatherApp">
      <Background weatherType={weatherInfo.weather} />
      <h2 style={{ marginBottom: "30px", fontSize: "2.5rem", fontWeight: "800", color: "#fff", position: 'relative', zIndex: 10 }}>WeatheRate</h2>
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <SearchBox updateInfo={updateInfo} />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <InfoBox info={weatherInfo} />
      </Box>
    </div>
  )
}