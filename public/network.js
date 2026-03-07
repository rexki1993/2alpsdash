// ════════════════════════════════════════════════════════════════════════
// LES 2 ALPES — VOLLEDIG LIFTNETWERK & PISTE CONNECTIES
// Route planner graph definitie
//
// Structuur:
//   STATIONS  = knooppunten (lift-top, lift-bottom, piste-kruispunten)
//   LIFTS     = edges OMHOOG (mechanisch vervoer)
//   PISTES    = edges OMLAAG (skiën / wandelen)
//   TRANSFERS = lopen tussen nabije stations (< 5 min)
//
// Coördinaten: WGS84 lat/lng
// Tijden: minuten
// ════════════════════════════════════════════════════════════════════════

const STATIONS = {

  // ── STARTPUNT ──────────────────────────────────────────────────────────
  aroles: {
    name: 'Chalet Les Aroles',
    alt: 1650,
    lat: 45.0232430,
    lng: 6.1249131,
    type: 'home'
  },

  // ── DORP / BASE (1650–1800m) ───────────────────────────────────────────
  jandri_bottom: {
    name: 'Jandri Express — Dorp',
    alt: 1650,
    lat: 45.0230,
    lng: 6.1210,
    type: 'station'
  },
  diable_bottom: {
    name: 'Diable gondola — Dorp',
    alt: 1650,
    lat: 45.0210,
    lng: 6.1350,
    type: 'station'
  },
  venosc_bottom: {
    name: 'Super-Venosc — Dorp',
    alt: 1650,
    lat: 45.0185,
    lng: 6.1410,
    type: 'station'
  },
  bellecombes_bottom: {
    name: 'Bellecombes — Bottom',
    alt: 1800,
    lat: 45.0200,
    lng: 6.1370,
    type: 'station'
  },

  // ── MIDDEN (2100–2600m) ────────────────────────────────────────────────
  bellecombes_top: {
    name: 'Bellecombes — Top',
    alt: 2100,
    lat: 45.0190,
    lng: 6.1430,
    type: 'station'
  },
  vallee_blanche: {
    name: 'Vallée Blanche',
    alt: 2100,
    lat: 45.0195,
    lng: 6.1520,
    type: 'station'
  },
  cretes_top: {
    name: 'Crêtes — Top',
    alt: 2500,
    lat: 45.0175,
    lng: 6.1470,
    type: 'station'
  },
  diable_top: {
    name: 'Diable — Top',
    alt: 2400,
    lat: 45.0155,
    lng: 6.1460,
    type: 'station'
  },
  fee_top: {
    name: 'La Fée',
    alt: 2440,
    lat: 45.0255,
    lng: 6.1355,
    type: 'station'
  },
  toura: {
    name: 'Toura',
    alt: 2600,
    lat: 45.0285,
    lng: 6.1275,
    type: 'station'
  },

  // ── HOOG (3200–3400m) ──────────────────────────────────────────────────
  top_3200: {
    name: 'Jandri Top — 3200m',
    alt: 3200,
    lat: 45.0355,
    lng: 6.1225,
    type: 'station'
  },
  signal_top: {
    name: 'Signal',
    alt: 3050,
    lat: 45.0340,
    lng: 6.1130,
    type: 'station'
  },

  // ── GLETSJER (3400–3421m) ──────────────────────────────────────────────
  glacier_3400: {
    name: 'Gletsjer — 3400m',
    alt: 3400,
    lat: 45.0375,
    lng: 6.1190,
    type: 'station'
  },
  puysalie_top: {
    name: 'Puy Salié — 3421m',
    alt: 3421,
    lat: 45.0395,
    lng: 6.1140,
    type: 'station'
  },
};


// ════════════════════════════════════════════════════════════════════════
// LIFTEN — gaan OMHOOG
// Elk lift-object definieert een gerichte edge van → naar
// ════════════════════════════════════════════════════════════════════════

const LIFTS = [

  // ── HOOFDGONDOLAS ──────────────────────────────────────────────────────
  {
    id: 'jandri1',
    name: 'Jandri Express 1',
    emoji: '🚡',
    type: 'gondola',
    from: 'jandri_bottom',
    to: 'toura',
    duration: 12,
    opens: '08:45',
    closes: '17:15',
    lastUp: '17:00',
    info: 'Hoofdgondola van het dorp naar Toura (2600m). Capaciteit ~200 pers/uur. Drukste lift van het resort.'
  },
  {
    id: 'jandri2',
    name: 'Jandri Express 2',
    emoji: '🚡',
    type: 'gondola',
    from: 'toura',
    to: 'top_3200',
    duration: 10,
    opens: '09:00',
    closes: '16:30',
    lastUp: '16:15',
    info: 'Van Toura naar de top op 3200m. Sluit eerder dan Jandri 1.'
  },
  {
    id: 'diable',
    name: 'Diable gondola',
    emoji: '🚡',
    type: 'gondola',
    from: 'diable_bottom',
    to: 'diable_top',
    duration: 11,
    opens: '09:00',
    closes: '16:45',
    lastUp: '16:30',
    info: 'Gondola naar de Diable-sector op 2400m. Mooie oost-expositie. Minder druk dan Jandri.'
  },
  {
    id: 'supervenosc',
    name: 'Super-Venosc kabelbaan',
    emoji: '🚠',
    type: 'cable',
    from: 'venosc_bottom',
    to: 'vallee_blanche',
    duration: 12,
    opens: '08:30',
    closes: '17:30',
    lastUp: '17:15',
    info: 'Kabelbaan naar Vallée Blanche. Langste openingstijden van het resort, ideaal voor laatste run.'
  },

  // ── STOELTJESLIFTEN ────────────────────────────────────────────────────
  {
    id: 'fee',
    name: 'Fée stoeltjeslift',
    emoji: '🪑',
    type: 'chair',
    from: 'toura',
    to: 'fee_top',
    duration: 9,
    opens: '09:00',
    closes: '16:30',
    lastUp: '16:15',
    info: 'Stoeltjeslift vanuit Toura naar La Fée sector (2440m). Rustige sector, mooi terras bij La Fée Hut.'
  },
  {
    id: 'bellecombes',
    name: 'Bellecombes stoeltjeslift',
    emoji: '🪑',
    type: 'chair',
    from: 'bellecombes_bottom',
    to: 'bellecombes_top',
    duration: 10,
    opens: '09:00',
    closes: '16:45',
    lastUp: '16:30',
    info: 'Stoeltjeslift naar de Crêtes-sector (2100m). Vertrek iets buiten het centrum van het dorp.'
  },
  {
    id: 'crete',
    name: 'Crête stoeltjeslift',
    emoji: '🪑',
    type: 'chair',
    from: 'bellecombes_top',
    to: 'cretes_top',
    duration: 8,
    opens: '09:00',
    closes: '16:30',
    lastUp: '16:15',
    info: 'Stoeltjeslift van Bellecombes naar de top van de Crêtes sector (2500m). Mooi zicht op het oosten.'
  },
  {
    id: 'signal',
    name: 'Signal I & II',
    emoji: '🪑',
    type: 'chair',
    from: 'top_3200',
    to: 'signal_top',
    duration: 8,
    opens: '09:00',
    closes: '16:00',
    lastUp: '15:50',
    info: 'Stoeltjeslift op de gletsjer. Bereikt de Signal-pistes op ~3050m.'
  },
  {
    id: 'puysalie',
    name: 'Puy Salié I & II',
    emoji: '🪑',
    type: 'chair',
    from: 'glacier_3400',
    to: 'puysalie_top',
    duration: 10,
    opens: '09:00',
    closes: '15:45',
    lastUp: '15:30',
    info: 'Stoeltjeslift op het gletsjer naar Puy Salié (3421m). Vroegste sluitingstijd van het resort.'
  },

  // ── FUNICULAIRE ────────────────────────────────────────────────────────
  {
    id: 'funiculaire',
    name: 'Funiculaire sous-glaciaire',
    emoji: '🛤',
    type: 'funicular',
    from: 'top_3200',
    to: 'glacier_3400',
    duration: 7,
    opens: '09:00',
    closes: '16:00',
    lastUp: '15:45',
    info: 'Rijdt onder het ijs door naar 3400m. Uniek ter wereld. Vroeg sluiten — plan je dag hierop.'
  },
];


// ════════════════════════════════════════════════════════════════════════
// PISTES — gaan OMLAAG
// van: start station (boven), naar: eind station (beneden)
// skiTime: geschatte ski-tijd in minuten (afhankelijk van niveau)
// ════════════════════════════════════════════════════════════════════════

const PISTES = [

  // ── GROENE PISTES ──────────────────────────────────────────────────────
  {
    id: 'puy_salie_1',
    name: 'Puy Salié 1',
    difficulty: 'novice',
    from: 'puysalie_top',
    to: 'glacier_3400',
    skiTime: { novice: 15, intermediate: 10, advanced: 7 },
    groomed: true,
    info: 'Brede groene gletsjer-piste op 3400m. Perfecte sneeuw het hele seizoen.'
  },
  {
    id: 'jandri4',
    name: 'Jandri 4',
    difficulty: 'novice',
    from: 'toura',
    to: 'jandri_bottom',
    skiTime: { novice: 25, intermediate: 15, advanced: 10 },
    groomed: true,
    info: 'Makkelijke groene afdaling langs de gondola. Ideaal voor beginners.'
  },
  {
    id: 'envers',
    name: 'Envers / Easy Park',
    difficulty: 'novice',
    from: 'toura',
    to: 'jandri_bottom',
    skiTime: { novice: 30, intermediate: 18, advanced: 12 },
    groomed: true,
    info: 'Skipiste voor beginners. Skilessen vinden hier grotendeels plaats.'
  },
  {
    id: 'signal2',
    name: 'Signal 2',
    difficulty: 'novice',
    from: 'top_3200',
    to: 'toura',
    skiTime: { novice: 20, intermediate: 12, advanced: 8 },
    groomed: true,
    info: 'Groene afdaling van 3200m naar Toura. Goed voor acclimatiseren op hoogte.'
  },

  // ── BLAUWE PISTES ──────────────────────────────────────────────────────
  {
    id: 'toura_blue',
    name: 'Toura',
    difficulty: 'intermediate',
    from: 'toura',
    to: 'jandri_bottom',
    skiTime: { novice: 22, intermediate: 14, advanced: 9 },
    groomed: true,
    info: 'Brede klassieke blauwe afdaling vanuit Toura. Een van de populairste pistes.'
  },
  {
    id: 'fee1',
    name: 'Fée 1',
    difficulty: 'intermediate',
    from: 'fee_top',
    to: 'toura',
    skiTime: { novice: 18, intermediate: 10, advanced: 7 },
    groomed: true,
    info: 'Blauwe terugkeer van La Fée naar Toura. Rustige sector.'
  },
  {
    id: 'fee2',
    name: 'Fée 2',
    difficulty: 'intermediate',
    from: 'fee_top',
    to: 'jandri_bottom',
    skiTime: { novice: 25, intermediate: 15, advanced: 10 },
    groomed: true,
    info: 'Lange blauwe afdaling van La Fée helemaal naar het dorp.'
  },
  {
    id: 'glacier1',
    name: 'Glacier 1',
    difficulty: 'intermediate',
    from: 'top_3200',
    to: 'toura',
    skiTime: { novice: 22, intermediate: 13, advanced: 9 },
    groomed: true,
    info: 'Blauwe afdaling van 3200m naar Toura. Consistente sneeuw dankzij hoogte.'
  },
  {
    id: 'glacier2',
    name: 'Glacier 2',
    difficulty: 'intermediate',
    from: 'top_3200',
    to: 'toura',
    skiTime: { novice: 20, intermediate: 12, advanced: 8 },
    groomed: true,
    info: 'Tweede blauwe gletsjer-afdaling richting Toura.'
  },
  {
    id: 'lauze1',
    name: 'Lauze 1',
    difficulty: 'intermediate',
    from: 'glacier_3400',
    to: 'top_3200',
    skiTime: { novice: 15, intermediate: 9, advanced: 6 },
    groomed: true,
    info: 'Blauwe gletsjer-piste van 3400m naar 3200m. Uitzicht richting Dôme de la Lauze.'
  },
  {
    id: 'bellecombes_blue',
    name: 'Bellecombes blauw',
    difficulty: 'intermediate',
    from: 'bellecombes_top',
    to: 'bellecombes_bottom',
    skiTime: { novice: 15, intermediate: 9, advanced: 6 },
    groomed: true,
    info: 'Blauwe terugkeer van Bellecombes naar het dorp.'
  },
  {
    id: 'diable_blue',
    name: 'Diable blauw',
    difficulty: 'intermediate',
    from: 'diable_top',
    to: 'diable_bottom',
    skiTime: { novice: 20, intermediate: 12, advanced: 8 },
    groomed: true,
    info: 'Lange blauwe afdaling in de Diable sector.'
  },
  {
    id: 'vallee_blue',
    name: 'Vallée Blanche',
    difficulty: 'intermediate',
    from: 'vallee_blanche',
    to: 'venosc_bottom',
    skiTime: { novice: 18, intermediate: 11, advanced: 7 },
    groomed: true,
    info: 'Rustige piste in de Vallée Blanche sector. Weinig drukte, mooi uitzicht.'
  },
  {
    id: 'crete_blue',
    name: 'Crête blauw',
    difficulty: 'intermediate',
    from: 'cretes_top',
    to: 'bellecombes_bottom',
    skiTime: { novice: 18, intermediate: 11, advanced: 7 },
    groomed: true,
    info: 'Blauwe afdaling van de Crêtes sector naar het dorp.'
  },

  // ── RODE PISTES ────────────────────────────────────────────────────────
  {
    id: 'pierre_grosse_red',
    name: 'Pierre Grosse',
    difficulty: 'advanced',
    from: 'toura',
    to: 'jandri_bottom',
    skiTime: { intermediate: 16, advanced: 10, expert: 7 },
    groomed: true,
    info: 'Lange rode afdaling vanuit Toura. Een van de langste afdalingen van het resort.'
  },
  {
    id: 'fee3',
    name: 'Fée 3',
    difficulty: 'advanced',
    from: 'fee_top',
    to: 'toura',
    skiTime: { intermediate: 14, advanced: 9, expert: 6 },
    groomed: true,
    info: 'Technische rode in de Fée sector.'
  },
  {
    id: 'fee4',
    name: 'Fée 4',
    difficulty: 'advanced',
    from: 'fee_top',
    to: 'jandri_bottom',
    skiTime: { intermediate: 18, advanced: 11, expert: 8 },
    groomed: false,
    info: 'Technische rode Fée 4, iets lastiger dan Fée 3.'
  },
  {
    id: 'signal3',
    name: 'Signal 3',
    difficulty: 'advanced',
    from: 'signal_top',
    to: 'top_3200',
    skiTime: { intermediate: 16, advanced: 10, expert: 7 },
    groomed: true,
    info: 'Rode gletsjer-piste op de Signal sector (3050m+).'
  },
  {
    id: 'glacier5',
    name: 'Glacier 5',
    difficulty: 'advanced',
    from: 'glacier_3400',
    to: 'top_3200',
    skiTime: { intermediate: 14, advanced: 9, expert: 6 },
    groomed: true,
    info: 'Rode gletsjer-afdaling van 3400m naar 3200m.'
  },
  {
    id: 'crete_rouge',
    name: 'Crête rood',
    difficulty: 'advanced',
    from: 'cretes_top',
    to: 'diable_bottom',
    skiTime: { intermediate: 16, advanced: 10, expert: 7 },
    groomed: true,
    info: 'Rode afdaling van de Crêtes sector. Consistente helling.'
  },
  {
    id: 'diable_rouge',
    name: 'Diable rood',
    difficulty: 'advanced',
    from: 'diable_top',
    to: 'diable_bottom',
    skiTime: { intermediate: 16, advanced: 10, expert: 7 },
    groomed: true,
    info: 'Technische rode in de Diable sector.'
  },
  {
    id: 'bonne_etoile',
    name: 'Bonne Étoile',
    difficulty: 'advanced',
    from: 'cretes_top',
    to: 'bellecombes_bottom',
    skiTime: { intermediate: 15, advanced: 9, expert: 6 },
    groomed: false,
    info: 'Rode piste op de zonnige oostflank van de Crêtes.'
  },

  // ── ZWARTE PISTES ──────────────────────────────────────────────────────
  {
    id: 'signal1',
    name: 'Signal 1',
    difficulty: 'expert',
    from: 'signal_top',
    to: 'glacier_3400',
    skiTime: { advanced: 12, expert: 8 },
    groomed: false,
    info: 'Steile zwarte gletsjer-piste. Kan ijzig zijn. Expert only.'
  },
  {
    id: 'lauze2',
    name: 'Lauze 2',
    difficulty: 'expert',
    from: 'puysalie_top',
    to: 'glacier_3400',
    skiTime: { advanced: 14, expert: 9 },
    groomed: false,
    info: 'Steile zwarte op westflank gletsjer. Uitzonderlijk uitzicht richting La Grave.'
  },
  {
    id: 'pierre_grosse_black',
    name: 'Pierre Grosse zwart',
    difficulty: 'expert',
    from: 'toura',
    to: 'jandri_bottom',
    skiTime: { advanced: 14, expert: 9 },
    groomed: false,
    info: 'Steile zwarte variant van Pierre Grosse. Experts only.'
  },
  {
    id: 'diable_black',
    name: 'Diable zwart',
    difficulty: 'expert',
    from: 'diable_top',
    to: 'diable_bottom',
    skiTime: { advanced: 12, expert: 8 },
    groomed: false,
    info: 'Steile zwarte afdaling in de Diable sector.'
  },
];


// ════════════════════════════════════════════════════════════════════════
// TRANSFERS — loopverbindingen tussen nabije stations (< 5 min)
// Bidirectioneel tenzij anders aangegeven
// ════════════════════════════════════════════════════════════════════════

const TRANSFERS = [
  { from: 'aroles',           to: 'jandri_bottom',    walkTime: 3,  info: 'Korte wandeling vanuit Les Aroles naar Jandri gondola' },
  { from: 'aroles',           to: 'diable_bottom',    walkTime: 5,  info: 'Wandeling naar de Diable gondola (andere richting)' },
  { from: 'aroles',           to: 'bellecombes_bottom',walkTime: 5, info: 'Naar Bellecombes stoeltjeslift' },
  { from: 'aroles',           to: 'venosc_bottom',    walkTime: 7,  info: 'Naar Super-Venosc kabelbaan (andere kant dorp)' },
  { from: 'jandri_bottom',    to: 'diable_bottom',    walkTime: 4,  info: 'Lopen door het dorp' },
  { from: 'jandri_bottom',    to: 'bellecombes_bottom',walkTime: 4, info: 'Lopen door het dorp' },
  { from: 'diable_bottom',    to: 'venosc_bottom',    walkTime: 3,  info: 'Nabij elkaar in dorp' },
  { from: 'bellecombes_top',  to: 'diable_top',       walkTime: 5,  info: 'Skiën/lopen tussen sectoren op 2100m' },
  { from: 'toura',            to: 'top_3200',         walkTime: 0,  info: 'Directe liftverbinding' }, // alleen via lift
  { from: 'glacier_3400',     to: 'top_3200',         walkTime: 5,  info: 'Korte ski/loopverbinding op het gletsjer' },
];


// ════════════════════════════════════════════════════════════════════════
// ROUTING ALGORITME
// Dijkstra over gecombineerde graaf: liften omhoog + pistes omlaag
//
// Gebruik:
//   const route = findRoute('aroles', 'signal_top', 'intermediate');
//   → { path: [...stappen], totalTime: 45, transfers: 3 }
//
// Elke stap in path heeft:
//   { type: 'lift'|'piste'|'transfer', object: LIFT|PISTE|TRANSFER,
//     from: stationId, to: stationId, time: minuten }
// ════════════════════════════════════════════════════════════════════════

function buildRoutingGraph() {
  const graph = {}; // graph[stationId] = [{ to, time, type, obj }]

  Object.keys(STATIONS).forEach(id => { graph[id] = []; });

  // Liften gaan OMHOOG
  LIFTS.forEach(lift => {
    if (!graph[lift.from]) graph[lift.from] = [];
    graph[lift.from].push({
      to: lift.to,
      time: lift.duration,
      type: 'lift',
      obj: lift
    });
  });

  // Pistes gaan OMLAAG
  PISTES.forEach(piste => {
    if (!graph[piste.from]) graph[piste.from] = [];
    const level = 'intermediate'; // default tijden
    const t = piste.skiTime[level] || piste.skiTime.advanced || 10;
    graph[piste.from].push({
      to: piste.to,
      time: t,
      type: 'piste',
      obj: piste
    });
  });

  // Transfers (lopen, bidirectioneel)
  TRANSFERS.forEach(tr => {
    if (!graph[tr.from]) graph[tr.from] = [];
    if (!graph[tr.to]) graph[tr.to] = [];
    graph[tr.from].push({ to: tr.to, time: tr.walkTime, type: 'transfer', obj: tr });
    graph[tr.to].push({ to: tr.from, time: tr.walkTime, type: 'transfer', obj: tr });
  });

  return graph;
}

function dijkstra(graph, startId, endId) {
  const dist = {};
  const prev = {};
  const prevEdge = {};
  const visited = new Set();

  Object.keys(graph).forEach(id => { dist[id] = Infinity; prev[id] = null; });
  dist[startId] = 0;

  // Simple priority queue (array-based voor kleine graphs)
  const queue = [{ id: startId, dist: 0 }];

  while (queue.length > 0) {
    queue.sort((a, b) => a.dist - b.dist);
    const { id: current } = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    if (current === endId) break;

    (graph[current] || []).forEach(edge => {
      const newDist = dist[current] + edge.time;
      if (newDist < dist[edge.to]) {
        dist[edge.to] = newDist;
        prev[edge.to] = current;
        prevEdge[edge.to] = edge;
        queue.push({ id: edge.to, dist: newDist });
      }
    });
  }

  if (dist[endId] === Infinity) return null;

  // Reconstrueer pad
  const path = [];
  let cur = endId;
  while (prev[cur] !== null) {
    path.unshift({ from: prev[cur], to: cur, ...prevEdge[cur] });
    cur = prev[cur];
  }

  return {
    path,
    totalTime: dist[endId],
    liftCount: path.filter(s => s.type === 'lift').length
  };
}

// Publieke functie: geef route van startStation naar doelStation
function findRoute(fromStationId, toStationId, skierLevel = 'intermediate') {
  const graph = buildRoutingGraph();
  return dijkstra(graph, fromStationId, toStationId);
}

// Vind het dichtstbijzijnde station bij een lat/lng
function nearestStation(lat, lng, excludeIds = []) {
  let best = null, bestDist = Infinity;
  Object.entries(STATIONS).forEach(([id, s]) => {
    if (excludeIds.includes(id)) return;
    const d = Math.hypot(lat - s.lat, lng - s.lng);
    if (d < bestDist) { bestDist = d; best = id; }
  });
  return best;
}

// Export voor gebruik in index.html
if (typeof module !== 'undefined') {
  module.exports = { STATIONS, LIFTS, PISTES, TRANSFERS, findRoute, nearestStation };
}
