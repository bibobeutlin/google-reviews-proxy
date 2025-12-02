import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;      // aus Render Env Vars
const PLACE_ID = process.env.PLACE_ID;    // aus Render Env Vars

app.get('/reviews', async (req, res) => {
  try {
    // Neues Places API (New) Format:
    // Doku: https://developers.google.com/maps/documentation/places/web-service/place-data-fields#places-field-review
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=reviews&key=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log('Google Places (New) response:', JSON.stringify(data, null, 2));

    if (!data || data.error) {
      return res.status(500).json({
        error: 'Google API error',
        details: data
      });
    }

    const reviews = data.reviews || [];

    res.json(reviews);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Reviews' });
  }
});

// Root-Route nur als einfache Check-Response
app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(3000, () => {
  console.log('Server läuft auf http://localhost:3000');
});
