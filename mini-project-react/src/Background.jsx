import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export default function Background({ weatherType, timeOfDay }) {
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
    let theme = colors.default;
    if (weatherType.includes("rain") || weatherType.includes("drizzle") || weatherType.includes("thunder")) {
      theme = colors.rain;
    } else if (weatherType.includes("cloud")) {
      theme = colors.cloudy;
    } else if (weatherType.includes("clear") || weatherType.includes("sunny")) {
      theme = colors.sun;
    }

    // Adjust background color slightly based on time of day
    if (timeOfDay === "Night") {
      return { color: theme.color, backgroundColor: 0x0a0a14 }; // Darker at night
    } else if (timeOfDay === "Evening") {
      return { color: theme.color, backgroundColor: 0x1f1a24 }; // Evening hues
    } else if (timeOfDay === "Morning" || timeOfDay === "Afternoon") {
      return { color: theme.color, backgroundColor: 0x3a4a5a }; // Lighter in the day
    }

    return theme;
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
            filter: 'blur(50px)', /* Increased blur for a softer, more premium look */
            transition: 'all 1s ease'
        }} 
    />
  );
}
