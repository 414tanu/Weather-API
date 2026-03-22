import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export default function Background({ weatherType }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Define colors based on weather
  const colors = {
    rain: { color: 0x4fc3f7, backgroundColor: 0x0f2027 }, // Very dark blue/black
    sun: { color: 0xff9a9e, backgroundColor: 0x2c3e50 },  // Dark slate
    cloudy: { color: 0xbdc3c7, backgroundColor: 0x232526 }, // Dark grey/black
    default: { color: 0x4fc3f7, backgroundColor: 0x1a1a2e } // Deep midnight blue
  };

  const getTheme = () => {
    if (weatherType.includes("rain") || weatherType.includes("drizzle") || weatherType.includes("thunder")) return colors.rain;
    if (weatherType.includes("cloud")) return colors.cloudy;
    if (weatherType.includes("clear") || weatherType.includes("sunny")) return colors.sun;
    return colors.default;
  };

  const theme = getTheme();

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          THREE,
          color: theme.color,
          backgroundColor: theme.backgroundColor,
          points: 10,
          maxDistance: 20,
          spacing: 15,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
        })
      );
    } else {
        // Update colors dynamically if effect exists
        vantaEffect.setOptions({
            color: theme.color,
            backgroundColor: theme.backgroundColor
        });
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect, theme.color, theme.backgroundColor]);

  return (
    <div 
        ref={vantaRef} 
        style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100vh", 
            zIndex: -1,
            filter: 'blur(3px)', /* Added subtle blur for depth */
            transition: 'all 1s ease'
        }} 
    />
  );
}
