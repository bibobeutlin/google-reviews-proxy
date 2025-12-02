import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;      // kommt aus Render Env Vars
const PLACE_ID = process.env.PLACE_ID;    // kommt aus Render Env Vars

app.get('/reviews', async (req, res) => {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Zum Debuggen: komplette Antwort von Google ins Log schreiben
    console.log('Google API response:', JSON.stringify(data, null, 2));

    if (!data || data.status !== 'OK') {
      // Wenn Google einen Fehler zurückgibt, zeigen wir ihn direkt nach außen
      return res.status(500).json({
        error: 'Google API error',
        details: data
      });
    }

    const reviews =
      data.result && data.result.reviews
        ? data.result.reviews
        : [];

    res.json(reviews);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Reviews' });
  }
});

// Root-Route, damit nicht mehr "Cannot GET /" erscheint
app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
