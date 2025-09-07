import https from 'https';

export function fetchData(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'async-weather-news-dashboard/1.0 (Mpho)',
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(rawData);
          resolve(parsed);
        } catch {
          reject(new Error('Failed to parse response'));
        }
      });
    }).on('error', (err) => {
      reject(new Error(`Request failed: ${err.message}`));
    });
  });
}
