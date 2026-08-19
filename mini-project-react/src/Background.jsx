import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

export default function Background({ weatherType = "", timeOfDay = "" }) {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  // Define base colors based on weather
  const colors = {
    rain: { color: 0x4fc3f7, backgroundColor: 0x0f2027 },
    sun: { color: 0xff9a9e, backgroundColor: 0x2c3e50 },
    cloudy: { color: 0xbdc3c7, backgroundColor: 0x232526 },
    default: { color: 0x4fc3f7, backgroundColor: 0x1a1a2e }
  };

  const getTheme = () => {
    const wt = (weatherType || "").toLowerCase();
    let theme = colors.default;
    if (wt.includes("rain") || wt.includes("drizzle") || wt.includes("thunder")) {
      theme = colors.rain;
    } else if (wt.includes("cloud")) {
      theme = colors.cloudy;
    } else if (wt.includes("clear") || wt.includes("sun") || wt.includes("sunny")) {
      theme = colors.sun;
    }

    // Return base theme; time-based adjustments applied later
    return { ...theme };
  };

  // Time-of-day specific visual tweaks
  const timeOptions = (td) => {
    // td expected values: "Morning", "Afternoon", "Evening", "Night" (case-sensitive from WeatherApp)
    switch ((td || "").toLowerCase()) {
      case "morning":
        return {
          blur: "6px",
          points: 16,
          maxDistance: 28,
          spacing: 12,
          scale: 1.3,
          scaleMobile: 1.1,
          bgAdjust: 0x88c0ff // subtle lighter tint
        };
      case "afternoon":
        return {
          blur: "0px",
          points: 20,
          maxDistance: 36,
          spacing: 10,
          scale: 1.5,
          scaleMobile: 1.1,
          bgAdjust: 0x6fb3e6
        };
      case "evening":
        return {
          blur: "20px",
          points: 12,
          maxDistance: 20,
          spacing: 14,
          scale: 1.05,
          scaleMobile: 1.0,
          bgAdjust: 0x2d1830
        };
      case "night":
        return {
          blur: "50px",
          points: 8,
          maxDistance: 14,
          spacing: 18,
          scale: 0.95,
          scaleMobile: 0.9,
          bgAdjust: 0x05060a
        };
      default:
        return {
          blur: "30px",
          points: 10,
          maxDistance: 20,
          spacing: 15,
          scale: 1.0,
          scaleMobile: 1.0,
          bgAdjust: 0x1a1a2e
        };
    }
  };

  const theme = getTheme();
  const opts = timeOptions(timeOfDay);

  useEffect(() => {
    // Combine theme backgroundColor and bgAdjust (prefer bgAdjust when provided)
    const bgColor = opts.bgAdjust || theme.backgroundColor;

    if (!vantaEffect) {
      const effect = NET({
        el: vantaRef.current,
        THREE,
        color: theme.color,
        backgroundColor: bgColor,
        points: opts.points,
        maxDistance: opts.maxDistance,
        spacing: opts.spacing,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: opts.scale,
        scaleMobile: opts.scaleMobile
      });
      setVantaEffect(effect);
    } else {
      // update options for dynamic transitions
      try {
        vantaEffect.setOptions({
          color: theme.color,
          backgroundColor: bgColor,
          points: opts.points,
          maxDistance: opts.maxDistance,
          spacing: opts.spacing,
          scale: opts.scale,
          scaleMobile: opts.scaleMobile
        });
      } catch (e) {
        // If updating options fails, destroy and recreate
        vantaEffect.destroy();
        const effect = NET({
          el: vantaRef.current,
          THREE,
          color: theme.color,
          backgroundColor: bgColor,
          points: opts.points,
          maxDistance: opts.maxDistance,
          spacing: opts.spacing,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: opts.scale,
          scaleMobile: opts.scaleMobile
        });
        setVantaEffect(effect);
      }
    }

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
    // We intentionally depend on weatherType and timeOfDay to update visuals
  }, [weatherType, timeOfDay]);

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
        filter: opts.blur ? `blur(${opts.blur})` : 'none',
        transition: 'filter 900ms ease, background-color 900ms ease'
      }}
    />
  );
}
