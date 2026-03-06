# 🎿 Les 2 Alpes — Ski Dashboard

Mobiele ski-app voor Les 2 Alpes met:
- **Dashboard** met live weer & sneeuw-samenvatting
- **Weerpagina** — 3 dagen × 4 dagdelen × 4 hoogtes (1300m/1800m/2600m/3200m)
- **Sneeuwhoogte** per zone
- **Pistekaart** — interactief, zoombaar, met restaurants/bars/chill spots
- **Locaties toevoegen** — zelf spots pinnen op de kaart

## Deploy op Railway

```bash
git init
git add .
git commit -m "initial commit"
# push naar GitHub → nieuw project op railway.app
```

Railway detecteert automatisch Node.js. Geen env vars nodig.

## Lokaal draaien

```bash
npm install
npm start
# → http://localhost:3000
```

## Data bronnen

| Data | Bron | Kosten |
|------|------|--------|
| Weer (live) | Open-Meteo API | Gratis |
| Piste geometrie | OpenStreetMap Overpass | Gratis |
| Kaart tiles | OpenSnowMap + OSM | Gratis |
| Restaurants | Hardcoded + user-added | — |
