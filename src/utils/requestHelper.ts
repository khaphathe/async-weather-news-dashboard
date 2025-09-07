import https from 'https';

export function fetchData(
  url: string,
  callback: (err: Error | null, data?: any) => void
): void {
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
        callback(null, parsed);
      } catch {
        callback(new Error('Failed to parse response'));
      }
    });
  }).on('error', (err) => {
    callback(new Error(`Request failed: ${err.message}`));
  });
}
