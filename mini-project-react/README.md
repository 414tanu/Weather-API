# Weather App (mini-project-react)

This directory contains the Vite + React weather app used in this repository.

Important setup for deployment

1. Environment variable

- The app requires an OpenWeather API key. Do NOT commit your key to source control.
- In Vite, environment variables exposed to the client must be prefixed with `VITE_`.
- Add the following environment variable in Vercel (or locally in `.env`):

  VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

2. Vercel settings

- Project Root Directory: `mini-project-react` (you mentioned this is already set)
- Build Command: `npm run build`
- Install Command: `npm ci` (or `npm install`)
- Output Directory: `dist`

3. Local testing

- cd mini-project-react
- create a `.env` with `VITE_OPENWEATHER_API_KEY=your_key`
- npm ci
- npm run dev

4. Notes

- I added Leaflet's CSS import in `src/main.jsx` to ensure map tiles and markers render correctly.
- The app now reads the OpenWeather API key from `import.meta.env.VITE_OPENWEATHER_API_KEY`.
- If the One Call API is not available on your plan, the app will still display current weather and a 5-day forecast; we can implement an hourly-aggregation fallback if needed.

If you want, I can also:
- Remove the old API key from the repository history, or
- Open a PR with these changes instead of pushing to main.
