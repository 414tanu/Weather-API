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
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import "./InfoBox.css";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThunderstormIcon from "@mui/icons-material/Thunderstorm";
import CloudIcon from "@mui/icons-material/Cloud";
import { motion } from "framer-motion";

export default function InfoBox({ info, bgClass }) {
  // Safe and working URLs from Unsplash
  const INIT_URL = "https://images.unsplash.com/photo-1610907647583-34a4d20ab15a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGR1c2t5JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
  const HOT_URL = "https://images.unsplash.com/photo-1447601932606-2b63e2e64331?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";
  const COLD_URL = "https://plus.unsplash.com/premium_photo-1661769737901-04648e2c9992?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvbGQlMjB3ZWF0aGVyfGVufDB8fDB8fHww";
  const RAIN_URL = "https://images.unsplash.com/photo-1737472794232-4c8be24ba535?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHJhaW55JTIwd2VhdGhlcnxlbnwwfHwwfHx8MA%3D%3D";

  // Determine Image Mapping
  const weatherType = info.weather ? info.weather.toLowerCase() : "";
  let imageUrl = INIT_URL;

  if (weatherType.includes("rain") || weatherType.includes("drizzle") || weatherType.includes("thunderstorm")) {
    imageUrl = RAIN_URL;
  } else if (info.humidity > 80) {
    imageUrl = RAIN_URL;
  } else if (info.temp > 15) {
    imageUrl = HOT_URL;
  } else {
    imageUrl = COLD_URL;
  }

  // Choose the appropriate icon
  let WeatherIcon = CloudIcon;
  if (info.humidity > 80 || weatherType.includes("rain")) {
    WeatherIcon = ThunderstormIcon;
  } else if (info.temp > 15) {
    WeatherIcon = WbSunnyIcon;
  }

  return (
    <div className="InfoBox">
      <motion.div
        className="cardContainer"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Card className={bgClass} sx={{ 
          width: 350, 
          backdropFilter: 'blur(15px)', 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardMedia
            component="img"
            height="180"
            image={imageUrl}
            alt="weather condition"
          />

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'inherit' }}>
              {info.city} <WeatherIcon fontSize="large" sx={{ verticalAlign: 'middle', mb: 1 }}/>
            </Typography>

            <Typography variant="body1" component={'div'} sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1, color: 'inherit' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{Math.round(info.temp)}&deg;C</div>
              <p style={{ textTransform: 'capitalize', fontSize: '1.2rem', fontStyle: 'italic', margin: 0 }}>
                {info.description || info.weather}
              </p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                <div>💧 Humidity: <b>{info.humidity}%</b></div>
                <div>🌡️ Feels Like: <b>{Math.round(info.feelslike)}&deg;C</b></div>
                {info.windSpeed && <div>💨 Wind: <b>{info.windSpeed} m/s</b></div>}
                {info.pressure && <div>🧭 Pressure: <b>{info.pressure} hPa</b></div>}
                {info.visibility && <div>👁️ Vis: <b>{info.visibility} km</b></div>}
              </div>
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
