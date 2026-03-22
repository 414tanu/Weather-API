import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function WeatherChart({ data }) {
  if (!data || data.length === 0) return null;

  // Enhance data specifically for Recharts
  const chartData = data.map(day => ({
    name: day.day,
    High: Math.round(day.tempMax),
    Low: Math.round(day.tempMin)
  }));

  return (
    <Box sx={{ mt: 2, width: '100%', height: 150 }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: 'inherit', textAlign: 'left' }}>
        📈 Temperature Trend (&deg;C)
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" stroke="inherit" fontSize={10} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000', border: 'none' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Line type="monotone" dataKey="High" stroke="#ff7300" strokeWidth={3} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Low" stroke="#387908" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
