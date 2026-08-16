import Lottie from "lottie-react";
import clearAnimation from "./animations/clear.json";
import snowAnimation from "./animations/snow.json";

// High-quality Lottie URLs for other weather types (3D style)
const CLOUDS_URL = "https://fonts.gstatic.com/s/i/short-term/release/googlestandardsymbols/cloudy/default/24px.svg"; // Fallback to SVG if needed, but we want Lottie
const LOTTIE_URLS = {
  clouds: "https://assets5.lottiefiles.com/packages/lf20_pw9i61of.json",
  rain: "https://assets5.lottiefiles.com/packages/lf20_b9puvvpx.json",
  thunder: "https://assets5.lottiefiles.com/packages/lf20_C697Ab.json",
  mist: "https://assets5.lottiefiles.com/packages/lf20_k9wYmPr6pP.json",
  drizzle: "https://assets5.lottiefiles.com/packages/lf20_b9puvvpx.json",
};

export default function WeatherAnimation({ weatherType, temp, humidity }) {
  const type = weatherType ? weatherType.toLowerCase() : "";

  let animationData = null;
  let animationURL = null;

  if (type.includes("clear") || (type === "" && temp > 25)) {
    animationData = clearAnimation;
  } else if (type.includes("snow")) {
    animationData = snowAnimation;
  } else if (type.includes("rain") || type.includes("drizzle")) {
    animationURL = LOTTIE_URLS.rain;
  } else if (type.includes("thunder")) {
    animationURL = LOTTIE_URLS.thunder;
  } else if (type.includes("cloud")) {
    animationURL = LOTTIE_URLS.clouds;
  } else if (type.includes("mist") || type.includes("smoke") || type.includes("haze") || type.includes("fog")) {
    animationURL = LOTTIE_URLS.mist;
  } else {
    // Default to clouds or clear based on temp
    animationURL = temp > 20 ? LOTTIE_URLS.clouds : LOTTIE_URLS.mist;
  }

  return (
    <div style={{ width: "100%", height: "180px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      {animationData ? (
        <Lottie animationData={animationData} loop={true} style={{ height: "100%" }} />
      ) : (
        <Lottie path={animationURL} loop={true} style={{ height: "100%" }} />
      )}
    </div>
  );
}
