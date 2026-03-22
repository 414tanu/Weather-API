import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Icons
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

export default function WeatherInsights({ info }) {
  const getInsights = () => {
    let insights = [];
    const weatherType = info.weather ? info.weather.toLowerCase() : "";
    const description = info.description ? info.description.toLowerCase() : "";
    
    const isRaining = weatherType.includes("rain") || weatherType.includes("drizzle") || weatherType.includes("thunderstorm");
    const isSnowing = weatherType.includes("snow");
    
    // 1. Clothing Recommendation
    let clothing = { text: "Light and comfortable clothing.", icon: <CheckroomIcon color="primary" /> };
    if (isRaining) {
      clothing.text = "Don't forget your umbrella and raincoat!";
    } else if (isSnowing) {
      clothing.text = "Heavy winter coat, gloves, and warm boots.";
    } else if (info.feelslike < 10) {
      clothing.text = "Wear a warm jacket and layer up.";
    } else if (info.feelslike < 18) {
      clothing.text = "A light sweater or jacket is recommended.";
    } else if (info.feelslike > 30) {
      clothing.text = "Light, breathable summer clothing. Don't forget sunglasses.";
    }
    insights.push(clothing);

    // 2. Activity / Lifestyle Guide
    let activity = { text: "Great weather for outdoor activities!", icon: <DirectionsWalkIcon sx={{ color: '#4caf50' }} /> };
    if (isRaining || isSnowing) {
      activity = { text: "Perfect time for indoor activities like reading or a movie.", icon: <DirectionsWalkIcon color="disabled" /> };
    } else if (info.feelslike > 35) {
      activity = { text: "It's extremely hot. Stay indoors during peak afternoon hours.", icon: <WarningAmberIcon color="error" /> };
    } else if (info.visibility < 3) {
      activity = { text: "Low visibility. Avoid driving or cycling if possible.", icon: <WarningAmberIcon color="warning" /> };
    }
    insights.push(activity);

    // 3. Health & Safety advice
    if (info.feelslike > 35 && info.humidity > 60) {
      insights.push({ text: "High risk of heat exhaustion. Drink plenty of water and stay in AC.", icon: <WarningAmberIcon color="error" /> });
    } else if (info.visibility < 2) {
      insights.push({ text: "Thick fog reported. Use low-beam headlights if driving.", icon: <WarningAmberIcon color="warning" /> });
    } else if (description.includes("smoke") || description.includes("haze")) {
      insights.push({ text: "Poor air quality. Consider wearing a mask and limit outdoor exertion.", icon: <WarningAmberIcon color="warning" /> });
    }

    // 4. Farming / Gardening Tip
    let gardening = { text: "Soil might be drying. Good time to water your plants.", icon: <LocalFloristIcon sx={{ color: '#8bc34a' }} /> };
    if (isRaining) {
      gardening = { text: "Rain expected! You can skip watering the garden today.", icon: <LocalFloristIcon color="info" /> };
    } else if (info.temp > 30 && !isRaining) {
      gardening = { text: "High heat! Water plants early morning or late evening.", icon: <LocalFloristIcon sx={{ color: '#ff9800' }} /> };
    } else if (isSnowing || info.temp < 0) {
      gardening = { text: "Freezing temperatures! Protect sensitive outdoor plants.", icon: <LocalFloristIcon color="primary" /> };
    }
    insights.push(gardening);

    return insights;
  };

  const insights = getInsights();

  return (
    <Box sx={{ mt: 3, mb: 1, width: '100%' }}>
      <Paper elevation={0} sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.15)', 
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <Typography variant="h6" sx={{ pt: 2, px: 2, pb: 0, fontWeight: 'bold', color: 'inherit', textAlign: 'left', fontSize: '1.1rem' }}>
          💡 Real-World Insights
        </Typography>
        <List dense>
          {insights.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.9rem', color: 'inherit', fontWeight: 500 }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
