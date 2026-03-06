# 🎿 Les 2 Alpes — Ski Dashboard

Real-time ski dashboard voor Les 2 Alpes met:
- Interactieve kaart met echte piste data (OpenStreetMap)
- Live weer via Open-Meteo (gratis, geen API key nodig)
- Klikbare pistes met moeilijkheidsgraad, grooming status & drukteindicator
- 3-daagse weersvoorspelling
- Sneeuwhoogtes & pistestatussen

## Data bronnen

| Data | Bron | Kosten |
|------|------|--------|
| Piste geometrie | Overpass API (OpenStreetMap) | Gratis |
| Weer & sneeuw | Open-Meteo | Gratis |
| Sneeuwhoogte (statisch) | Handmatig bijhouden of paid API | — |
| Kaart tiles | OpenSnowMap + OSM | Gratis |

## Lokaal draaien

```bash
npm install
npm start
# → http://localhost:3000
```

## Deploy op Railway

1. Push naar GitHub
2. Nieuw project op [railway.app](https://railway.app)
3. "Deploy from GitHub repo" → selecteer deze repo
4. Railway detecteert automatisch Node.js en draait `npm start`
5. Done ✅

Geen environment variables nodig — alles is gratis en zonder API keys.

## Uitbreiden

- **Drukte (echt)**: Integreer Skiapi.com via RapidAPI voor lift queue data
- **Piste status**: Scraper op skipass-2alpes.com/en/opening
- **Push notificaties**: Service worker + Web Push API
- **Weer alerts**: Open-Meteo heeft ook alerts endpoint
