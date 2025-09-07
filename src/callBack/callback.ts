import { fetchData } from '../utils/requestHelper';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const WEATHER_API_KEY = 'fdb068bf5a7808093dc5bd128c8d5ca3';
const geoIPURL = 'https://ipapi.co/json/';
const newsURL = 'https://dummyjson.com/posts';

console.log('Starting callback fetch...');

fetchData(geoIPURL, (geoErr, geoData) => {
  if (geoErr) {
    console.error('Geolocation error:', geoErr.message);
    return;
  }
  const city = geoData.city || 'Pretoria';
  console.log(`City: ${city}`);
  console.log('Getting coordinates...');

  const geoLookupURL = `${GEO_URL}/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;
  fetchData(geoLookupURL, (coordErr, coordData) => {
    if (coordErr || !coordData?.length) {
      console.error('Coordinate error:', coordErr?.message);
      return;
    }

    const { lat, lon } = coordData[0];
    console.log(`Coordinates: (${lat}, ${lon})`);
    console.log('Fetching weather info...');
    console.log('---');

    const weatherURL = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
    fetchData(weatherURL, (weatherErr, weatherData) => {
      if (weatherErr || !weatherData?.main) {
        console.error('Weather error:', weatherErr?.message);
        return;
      }
      console.log('Weather Information:');
      console.log(`Temperature: ${weatherData.main.temp}°C`);
      console.log(`Wind Speed: ${weatherData.wind.speed} m/s`);
      console.log(`Condition: ${weatherData.weather[0].description}`);

      fetchData(newsURL, (newsErr, newsData) => {
        if (newsErr || !newsData?.posts || !Array.isArray(newsData.posts)) {
          console.error('News error:', newsErr?.message);
          return;
        }
        console.log('News Headlines:');
        newsData.posts.slice(0, 3).forEach((post: any, index: number) => {
          console.log(`${index + 1}. ${post.title}`);
        });

        console.log('All data fetched using callbacks.');
      });
    });
  });
});
