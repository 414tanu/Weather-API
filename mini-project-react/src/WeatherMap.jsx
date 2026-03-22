import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function WeatherMap({ lat, lon, city }) {
  if (!lat || !lon) return null;

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" sx={{ pt: 1, pb: 1, fontWeight: 'bold', color: 'inherit', textAlign: 'left', fontSize: '1.1rem' }}>
        📍 Location Map
      </Typography>
      <Box className="glass-card" sx={{ height: 200, width: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.3)', p: 0 }}>
        <MapContainer 
          key={`${lat}-${lon}`} 
          center={[Number(lat), Number(lon)]} 
          zoom={10} 
          scrollWheelZoom={false} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[Number(lat), Number(lon)]}>
            <Popup>{city}</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
}
