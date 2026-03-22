import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import WeatherChart from './WeatherChart';

export default function Forecast({ city }) {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";
  const API_KEY = "aa2cf8819475d67e138795bdba57a945"; // replace if needed

  useEffect(() => {
    if (!city) return;

    const getForecast = async () => {
      setLoading(true);
      setError(false);
      try {
        let response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        let jsonResponse = await response.json();
        
        if (jsonResponse.cod !== "200") {
          throw new Error(jsonResponse.message);
        }

        const dailyData = [];
        const seenDates = new Set();
        
        jsonResponse.list.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!seenDates.has(date) && seenDates.size < 5) {
             seenDates.add(date);
             dailyData.push({
               date: date,
               day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
               tempMax: item.main.temp_max,
               tempMin: item.main.temp_min,
               icon: item.weather[0].icon,
               description: item.weather[0].main
             });
          } else if (seenDates.has(date)) {
             const dayObj = dailyData.find(d => d.date === date);
             if (item.main.temp_max > dayObj.tempMax) dayObj.tempMax = item.main.temp_max;
             if (item.main.temp_min < dayObj.tempMin) dayObj.tempMin = item.main.temp_min;
          }
        });
        
        setForecast(dailyData);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    getForecast();
  }, [city]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress color="inherit" /></Box>;
  if (error) return null; 

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ pt: 1, pb: 1, fontWeight: 'bold', color: 'inherit', textAlign: 'left', fontSize: '1.1rem' }}>
        📅 5-Day Forecast
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: 2, 
        pb: 1,
        '&::-webkit-scrollbar': { height: '6px' }, 
        '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '4px' } 
      }}>
        {forecast.map((day, index) => (
          <Box key={index} className="glass-card" sx={{ 
            minWidth: 90, 
            p: 1.5, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{day.day}</Typography>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt={day.description} style={{ width: 50, height: 50 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {Math.round(day.tempMax)}&deg; <span style={{opacity: 0.7, fontWeight: 'normal'}}>{Math.round(day.tempMin)}&deg;</span>
            </Typography>
          </Box>
        ))}
      </Box>
      <WeatherChart data={forecast} />
    </Box>
  );
}
