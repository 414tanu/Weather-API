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
    timezone: 3600,
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

  const getLocalTimeDetails = () => {
    if (weatherInfo.timezone === undefined) return { timeOfDay: 'day', timeStr: '' };
    
    const utcTime = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (weatherInfo.timezone * 1000));
    const hours = localTime.getHours();
    
    let timeOfDay = "";
    if (hours >= 5 && hours < 12) timeOfDay = "Morning";
    else if (hours >= 12 && hours < 17) timeOfDay = "Afternoon";
    else if (hours >= 17 && hours < 20) timeOfDay = "Evening";
    else timeOfDay = "Night";

    return {
      timeOfDay: timeOfDay,
      timeStr: localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const timeDetails = getLocalTimeDetails();

  return (
    <div className="WeatherApp">
      <Background weatherType={weatherInfo.weather} timeOfDay={timeDetails.timeOfDay} />
      <h2 style={{ marginBottom: "30px", fontSize: "2.5rem", fontWeight: "800", color: "#fff", position: 'relative', zIndex: 10 }}>WeatheRate</h2>
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <SearchBox updateInfo={updateInfo} />
      </Box>
      <Box sx={{ position: 'relative', zIndex: 10 }}>
        <InfoBox info={weatherInfo} timeDetails={timeDetails} />
      </Box>
    </div>
  )
}