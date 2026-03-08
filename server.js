const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── WEATHER ──────────────────────────────────────────────────────────────────
// Bron: Open-Meteo (gratis, geen API key nodig)
// Endpoint: https://api.open-meteo.com/v1/forecast
// 3 hoogtezones: dorp (1600m), hoog (2600m), gletsjer (3600m)
// Data: actueel weer + uurlijkse forecast (3 dagen) + sneeuwhoogte
// Verversing: elke keer dat de gebruiker de Weer-tab opent (live fetch)
app.get('/api/weather', async (req, res) => {
  try {
    const zones = [
      { name: 'Dorp',     alt: 1600, lat: 44.998, lng: 6.121 },
      { name: 'Hoog',     alt: 2600, lat: 45.012, lng: 6.135 },
      { name: 'Gletsjer', alt: 3600, lat: 45.022, lng: 6.143 }
    ];
    const results = await Promise.all(zones.map(async (z) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${z.lat}&longitude=${z.lng}&elevation=${z.alt}&current=temperature_2m,wind_speed_10m,wind_gusts_10m,weather_code,snowfall,snow_depth&hourly=temperature_2m,weather_code,precipitation,snowfall,snow_depth,wind_speed_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,weather_code&timezone=Europe%2FParis&forecast_days=3`;
      const r = await fetch(url);
      const d = await r.json();
      return { ...z, data: d };
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Weather failed' });
  }
});

// ─── PISTES ───────────────────────────────────────────────────────────────────
// Bron: OpenStreetMap via Overpass API
// Endpoint: https://overpass-api.de/api/interpreter
// Query: alle piste:type=downhill + alle aerialway (liften) in bounding box Les 2 Alpes
// Bounding box: lat 44.98–45.05, lng 6.09–6.18
// Tags doorgegeven: name, piste:difficulty, aerialway (type lift), piste:grooming
// Verversing: bij elke pageload (gecached door browser voor ~1 uur)
app.get('/api/pistes', async (req, res) => {
  try {
    const query = `[out:json][timeout:30];(way["piste:type"="downhill"](44.98,6.09,45.05,6.18);way["aerialway"](44.98,6.09,45.05,6.18););out body;>;out skel qt;`;
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST', body: query, headers: { 'Content-Type': 'text/plain' }
    });
    const data = await response.json();
    const nodes = {};
    data.elements.forEach(el => { if (el.type === 'node') nodes[el.id] = [el.lat, el.lon]; });
    const features = data.elements.filter(el => el.type === 'way' && el.nodes && el.tags).map(way => {
      const coords = way.nodes.map(id => nodes[id]).filter(Boolean).map(([lat, lon]) => [lon, lat]);
      if (coords.length < 2) return null;
      // aerialway type → emoji mapping
      const aerialway = way.tags['aerialway'];
      const liftEmoji = {
        gondola:      '🚡',
        cable_car:    '🚠',
        chair_lift:   '🪑',
        drag_lift:    '🎿',
        magic_carpet: '🟦',
        funicular:    '🛤',
        mixed_lift:   '🚡',
        t_bar:        '🎿',
        j_bar:        '🎿',
        platter:      '🎿',
      }[aerialway] || '🚡';
      return {
        type: 'Feature',
        properties: {
          id: way.id,
          name: way.tags.name || way.tags['piste:name'] || (aerialway ? 'Lift' : 'Piste'),
          difficulty: way.tags['piste:difficulty'] || 'unknown',
          isLift: !!aerialway,
          aerialway,
          liftEmoji,
          groomed: way.tags['piste:grooming'] === 'groomed',
          ref: way.tags.ref
        },
        geometry: { type: 'LineString', coordinates: coords }
      };
    }).filter(Boolean);
    res.json({ type: 'FeatureCollection', features });
  } catch (err) {
    res.status(500).json({ error: 'Piste fetch failed' });
  }
});

// ─── SNOW REPORT ──────────────────────────────────────────────────────────────
// Bron: Open-Meteo (live snow_depth + snowfall per hoogtezone)
// snow_depth is in meters → we convert to cm
// past_days=2 geeft sneeuwval afgelopen 48 uur via daily snowfall_sum
app.get('/api/snowreport', async (req, res) => {
  try {
    const zones = [
      { alt: 1600, label: 'Dorp',     lat: 44.998, lng: 6.121 },
      { alt: 2600, label: 'Hoog',     lat: 45.012, lng: 6.135 },
      { alt: 3600, label: 'Gletsjer', lat: 45.022, lng: 6.143 }
    ];
    const fetched = await Promise.all(zones.map(async (z) => {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${z.lat}&longitude=${z.lng}&elevation=${z.alt}&current=snow_depth,snowfall&daily=snowfall_sum&timezone=Europe%2FParis&forecast_days=1&past_days=2`;
      const r = await fetch(url);
      const d = await r.json();
      const depthCm = Math.round((d.current?.snow_depth || 0) * 100);
      // sum of past 2 days snowfall_sum for fresh snow 48h
      const sums = d.daily?.snowfall_sum || [];
      const fresh48h = Math.round((sums[0] || 0) + (sums[1] || 0));
      return { ...z, depth: depthCm, fresh48h };
    }));
    const topZone = fetched[fetched.length - 1];
    const fresh48h = Math.max(...fetched.map(z => z.fresh48h));
    res.json({
      snowDepthTop: topZone.depth,
      snowDepthBottom: fetched[0].depth,
      freshSnow48h: fresh48h,
      pistsOpen: 40, pistsTotal: 42,
      liftsOpen: 38, liftsTotal: 42,
      pistCondition: 'Goed geprepareerd',
      lastUpdated: new Date().toISOString(),
      zones: fetched.map(z => ({ alt: z.alt, label: z.label, depth: z.depth, fresh48h: z.fresh48h }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Snowreport failed' });
  }
});

// ─── CUSTOM LOCATIONS ─────────────────────────────────────────────────────────
const LOC_FILE = path.join(__dirname, 'locations.json');
const readLocs  = () => { try { return JSON.parse(fs.readFileSync(LOC_FILE, 'utf8')); } catch { return []; } };
const writeLocs = (l) => fs.writeFileSync(LOC_FILE, JSON.stringify(l, null, 2));

app.get('/api/locations',    (req, res) => res.json(readLocs()));
app.post('/api/locations',   (req, res) => {
  const locs = readLocs();
  const loc = { id: Date.now(), ...req.body, addedBy: 'user', createdAt: new Date().toISOString() };
  locs.push(loc);
  writeLocs(locs);
  res.json(loc);
});
app.delete('/api/locations/:id', (req, res) => {
  writeLocs(readLocs().filter(l => l.id !== Number(req.params.id)));
  res.json({ ok: true });
});

// ─── BIER KNOP (gedeeld tussen alle gebruikers) ───────────────────────────────
// Opgeslagen in bier.json met datum-key (YYYY-MM-DD)
// Automatisch leeg op een nieuwe dag
const BIER_FILE = path.join(__dirname, 'bier.json');
const todayKey  = () => new Date().toISOString().slice(0, 10); // "2025-03-07"
const readBier  = () => { try { return JSON.parse(fs.readFileSync(BIER_FILE, 'utf8')); } catch { return {}; } };
const writeBier = (d) => fs.writeFileSync(BIER_FILE, JSON.stringify(d, null, 2));

app.get('/api/bier', (req, res) => {
  const data = readBier();
  res.json(data[todayKey()] || []);
});

app.post('/api/bier', (req, res) => {
  const { naam } = req.body;
  if (!naam || typeof naam !== 'string') return res.status(400).json({ error: 'naam vereist' });
  const data  = readBier();
  const key   = todayKey();
  const namen = data[key] || [];
  if (!namen.includes(naam.trim())) {
    namen.push(naam.trim());
    data[key] = namen;
    writeBier(data);
  }
  res.json(namen);
});

app.delete('/api/bier/:naam', (req, res) => {
  const data  = readBier();
  const key   = todayKey();
  data[key]   = (data[key] || []).filter(n => n !== decodeURIComponent(req.params.naam));
  writeBier(data);
  res.json(data[key]);
});

app.listen(PORT, () => console.log(`🎿 Running on port ${PORT}`));
