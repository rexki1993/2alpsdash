const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Les 2 Alpes coordinates
const LAT = 45.0167;
const LNG = 6.1333;

// ─── Weather API (Open-Meteo, free) ───────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LNG}&current=temperature_2m,wind_speed_10m,wind_direction_10m,snowfall,weather_code,relative_humidity_2m,apparent_temperature&daily=snowfall_sum,temperature_2m_max,temperature_2m_min,precipitation_sum&hourly=temperature_2m,snowfall&timezone=Europe%2FParis&forecast_days=3`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Weather API error:', err);
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

// ─── Piste data from OpenStreetMap Overpass API ────────────────────────────────
app.get('/api/pistes', async (req, res) => {
  try {
    // Bounding box for Les 2 Alpes ski area
    const query = `
      [out:json][timeout:30];
      (
        way["piste:type"="downhill"](44.98,6.09,45.05,6.18);
        way["aerialway"](44.98,6.09,45.05,6.18);
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query,
      headers: { 'Content-Type': 'text/plain' }
    });

    const data = await response.json();

    // Build a node lookup map
    const nodes = {};
    data.elements.forEach(el => {
      if (el.type === 'node') nodes[el.id] = [el.lat, el.lon];
    });

    // Convert ways to GeoJSON features
    const features = data.elements
      .filter(el => el.type === 'way' && el.nodes && el.tags)
      .map(way => {
        const coords = way.nodes
          .map(id => nodes[id])
          .filter(Boolean)
          .map(([lat, lon]) => [lon, lat]); // GeoJSON is [lng, lat]

        if (coords.length < 2) return null;

        const difficulty = way.tags['piste:difficulty'] || 'unknown';
        const isLift = !!way.tags['aerialway'];
        const name = way.tags.name || way.tags['piste:name'] || (isLift ? 'Lift' : 'Piste');
        const groomed = way.tags['piste:grooming'] === 'groomed' || way.tags['piste:grooming'] === 'classic';

        return {
          type: 'Feature',
          properties: {
            id: way.id,
            name,
            difficulty,
            isLift,
            aerialway: way.tags['aerialway'],
            groomed,
            oneway: way.tags['oneway'] || way.tags['piste:oneway'],
            ref: way.tags.ref,
            tags: way.tags
          },
          geometry: {
            type: 'LineString',
            coordinates: coords
          }
        };
      })
      .filter(Boolean);

    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    console.error('Overpass API error:', err);
    res.status(500).json({ error: 'Piste data fetch failed', details: err.message });
  }
});

// ─── Snow report proxy (snow-forecast scraping fallback) ──────────────────────
app.get('/api/snowreport', async (req, res) => {
  // Static snow data as fallback (updated manually or via cron)
  // In production: scrape les2alpes.com or use a paid API
  res.json({
    snowDepthTop: 185,
    snowDepthBottom: 60,
    freshSnow48h: 12,
    pistsOpen: 89,
    pistsTotal: 96,
    liftsOpen: 40,
    liftsTotal: 42,
    pistCondition: 'Goed geprepareerd',
    lastUpdated: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🎿 Les 2 Alpes Dashboard running on port ${PORT}`);
});
