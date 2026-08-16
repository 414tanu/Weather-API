// // import { ClassNames } from "@emotion/react";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import "./InfoBox.css";
// import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
// import AcUnitIcon from '@mui/icons-material/AcUnit';
// import WbSunnyIcon from '@mui/icons-material/WbSunny';


// // Animation libraries
// import Lottie from "lottie-react";
// import { motion } from "framer-motion";

// import rainAnimation from "./animations/rain.json";
// import sunAnimation from "./animations/sun.json";
// import cloudAnimation from "./animations/cloud.json"

// export default function InfoBox({info}) {
//   const INIT_URL = "https://images.unsplash.com/photo-1610907647583-34a4d20ab15a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGR1c2t5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D"

//   const HOT_URL = "https://images.unsplash.com/photo-1447601932606-2b63e2e64331?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
//   const COLD_URL = "https://plus.unsplash.com/premium_photo-1661769737901-04648e2c9992?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvbGQlMjB3ZWF0aGVyfGVufDB8fDB8fHww";
//   const RAIN_URL = "https://images.unsplash.com/photo-1737472794232-4c8be24ba535?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHJhaW55JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";

//   return (
//     <div className="InfoBox">
//     <div className="cardContainer">
//     <Card sx={{ maxWidth: 345 }}>
//       <CardMedia
//         component="img"
//         alt="green iguana"
//         height="140"
//         image={info.humidity > 80 ? RAIN_URL : info.temp > 15 ? HOT_URL : COLD_URL}
//       />
//       <CardContent>
//         <Typography gutterBottom variant="h5" component="div">
//           {info.city}{""} {info.humidity > 80 ? ( <ThunderstormIcon />) : info.temp > 15 ? ( <WbSunnyIcon/>) : (<AcUnitIcon/>)}
//         </Typography>
//         <Typography variant="body2"  color='text.secondary' component={'span'}>
//           <p>Temperature = {info.temp}&deg;C</p>
//           <p>Humidity = {info.humidity}</p>
//           <p>Min Temp = {info.tempMin}&deg;C</p>
//           <p>Max Temp = {info.tempMax}&deg;C</p>
//           <p>The weather can be described as <i>{info.weather}</i> and feels like {info.feelslike}&deg;C</p>
//         </Typography>
//       </CardContent>
//     </Card>
//     </div>
//     </div>
//   );
// }




import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
              
              <div className="weather-stats-grid">
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
