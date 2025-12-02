
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

const API_KEY = 'DEIN_API_KEY'; // Hier deinen Google API-Key einfügen
const PLACE_ID = 'DEINE_PLACE_ID'; // Hier deine Place ID einfügen

app.get('/reviews', async (req, res) => {
    try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&key=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.result.reviews || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Reviews' });
    }
});

app.listen(3000, () => {
    console.log('Server läuft auf http://localhost:3000');
});
