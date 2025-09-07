import { fetchData } from '../utils/requestHelper.async';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const WEATHER_API_KEY = 'fdb068bf5a7808093dc5bd128c8d5ca3';

const geoIPURL = 'https://ipapi.co/json/';
const newsURL = 'https://dummyjson.com/posts';

console.log('Starting async/await ...');

async function runDashboard() {
  try {
    const geoData: { city?: string } = await fetchData(geoIPURL);
    const city = geoData.city || 'pretoria';
    console.log(`City: ${city}`);

    const geoLookupURL = `${GEO_URL}/direct?q=${city}&limit=1&appid=${WEATHER_API_KEY}`;
    const coordData: { lat: number; lon: number }[] = await fetchData(geoLookupURL);

    if (!coordData?.length) throw new Error('No coordinates found');
    const { lat, lon } = coordData[0];
    console.log(`Coordinates: (${lat}, ${lon})`);

    const weatherURL = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
    const [weatherData, newsData]: [any, { posts: { title: string; body: string }[] }] = await Promise.all([
      fetchData(weatherURL),
      fetchData(newsURL)
    ]);

    if (!weatherData?.main || !weatherData?.weather?.length) {
      throw new Error('Invalid weather data');
    }

    console.log(`Temperature: ${weatherData.main.temp}°C`);
    console.log(`Wind Speed: ${weatherData.wind.speed} m/s`);
    console.log(`Condition: ${weatherData.weather[0].description}`);

    if (!newsData?.posts || !Array.isArray(newsData.posts)) {
      throw new Error('Invalid news ');
    }

    console.log('News Headlines:');
    newsData.posts.slice(2, 4).forEach((post: any, i: number) => {
      console.log(`${i + 1}. ${post.title}`);
    });

    console.log('All data fetched using async/await.');
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

runDashboard();
