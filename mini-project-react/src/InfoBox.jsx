// // import { ClassNames } from "@emotion/react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';
import "./InfoBox.css";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudIcon from "@mui/icons-material/Cloud";
import { motion } from "framer-motion";
import WeatherInsights from "./WeatherInsights";
import Forecast from "./Forecast";
import WeatherMap from "./WeatherMap";
import WeatherAnimation from "./WeatherAnimation";

export default function InfoBox({ info, timeDetails }) {
  // Determine the appropriate icon for the title
  const weatherType = info.weather ? info.weather.toLowerCase() : "";
  let WeatherIcon = CloudIcon;
  if (info.humidity > 80 || weatherType.includes("rain") || weatherType.includes("thunder")) {
    WeatherIcon = ThunderstormIcon;
  } else if (info.temp > 15 || weatherType.includes("clear") || weatherType.includes("sun")) {
    WeatherIcon = WbSunnyIcon;
  }

  return (
    <div className="InfoBox">
      <motion.div
        className="cardContainer"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Card className="glass-card" sx={{ 
          width: 380, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: 'transparent', // Let CSS handle glassmorphism
          boxShadow: 'none',
          color: '#fff'
        }}>
          {/* Dynamic Weather Animation instead of static photo */}
          <div className="animation-container">
            <WeatherAnimation 
              weatherType={info.weather} 
              temp={info.temp} 
              humidity={info.humidity} 
            />
          </div>

          <CardContent sx={{ flexGrow: 1, p: 3 }}>
            {timeDetails && timeDetails.timeStr && (
              <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.8, mb: -1 }}>
                Good {timeDetails.timeOfDay} • Local Time: {timeDetails.timeStr}
              </Typography>
            )}
            <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 1 }}>
              {info.city} <WeatherIcon fontSize="large" sx={{ color: '#ffb347' }}/>
            </Typography>

            <Typography variant="body1" component={'div'} sx={{ mt: 1, textAlign: 'center' }}>
              <div className="temp-display">{Math.round(info.temp)}&deg;C</div>
              <p className="weather-desc">
                {info.description || info.weather}
              </p>
              
              {/* If daily temps are available, show Day/Evening/Night */}
              { (info.dayTemp !== null && info.dayTemp !== undefined) ? (
                <div className="day-temp-row" style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: 8 }}>
                  <div className="stat-pill">Day: {Math.round(info.dayTemp)}&deg;C</div>
                  <div className="stat-pill">Evening: {Math.round(info.eveningTemp)}&deg;C</div>
                  <div className="stat-pill">Night: {Math.round(info.nightTemp)}&deg;C</div>
                </div>
              ) : null }

              <div className="weather-stats-grid" style={{ marginTop: 12 }}>
                <div className="stat-pill">💧 {info.humidity}%</div>
                <div className="stat-pill">🌡️ {Math.round(info.feelslike)}&deg;C</div>
                {info.windSpeed && <div className="stat-pill">💨 {info.windSpeed}m/s</div>}
                {info.pressure && <div className="stat-pill">🧭 {info.pressure}hPa</div>}
              </div>
            </Typography>

            <Box sx={{ mt: 3 }}>
              <WeatherInsights info={info} />
              <Forecast city={info.city} />
              <WeatherMap lat={info.lat} lon={info.lon} city={info.city} />
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
