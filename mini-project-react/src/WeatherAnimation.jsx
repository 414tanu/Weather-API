import Lottie from "lottie-react";

// High-quality Lottie URLs for other weather types (3D style)
const LOTTIE_URLS = {
  clear: "https://assets5.lottiefiles.com/packages/lf20_U1tpOq.json",
  snow: "https://assets5.lottiefiles.com/packages/lf20_rhbzpten.json",
  clouds: "https://assets5.lottiefiles.com/packages/lf20_pw9i61of.json",
  rain: "https://assets5.lottiefiles.com/packages/lf20_b9puvvpx.json",
  thunder: "https://assets5.lottiefiles.com/packages/lf20_C697Ab.json",
  mist: "https://assets5.lottiefiles.com/packages/lf20_k9wYmPr6pP.json",
  drizzle: "https://assets5.lottiefiles.com/packages/lf20_b9puvvpx.json",
};

export default function WeatherAnimation({ weatherType, temp, humidity }) {
  const type = weatherType ? weatherType.toLowerCase() : "";

  let animationURL = null;

  if (type.includes("clear") || (type === "" && temp > 25)) {
    animationURL = LOTTIE_URLS.clear;
  } else if (type.includes("snow")) {
    animationURL = LOTTIE_URLS.snow;
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
      <Lottie path={animationURL} loop={true} style={{ height: "100%" }} />
    </div>
  );
}
