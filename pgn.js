#!/usr/bin/env node
// Usage: node get-pgn.js https://lichess.org/fYbL0tNk/white
//        node get-pgn.js fYbL0tNk
// Tip: redirect to a file: node get-pgn.js fYbL0tNk > game.pgn

const input = process.argv[2];
if (!input) {
  console.error('Provide a Lichess game URL or game ID.');
  process.exit(1);
}

// Extract game ID from a URL or accept it directly
let gameId = input;
try {
  const u = new URL(input);
  // path looks like /fYbL0tNk/white -> first segment is the id
  gameId = u.pathname.split('/').filter(Boolean)[0] || input;
} catch (_) { /* input was just an ID, that’s fine */ }

// Build export URL. Adding .pgn ensures we get raw PGN text.
// You can tweak params: moves/tags/clocks/evals/opening/literate (0/1).
const params = new URLSearchParams({
  moves: '1',
  tags: '1',
  clocks: '1',
  evals: '1',
  opening: '1',
  literate: '0'
});
const url = `https://lichess.org/game/export/${gameId}.pgn?${params.toString()}`;

(async () => {
  const headers = {
    // Accept header is optional when using .pgn, but harmless:
    'Accept': 'application/x-chess-pgn',
    // Be a good API citizen:
    'User-Agent': 'get-pgn-script/1.0 (https://github.com/yourname)'
  };
  // Optional: if you have a LICHESS_TOKEN (not required for public games)
  if (process.env.LICHESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.LICHESS_TOKEN}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    console.error(`HTTP ${res.status} – ${res.statusText}`);
    process.exit(2);
  }
  const pgn = await res.text();
  console.log(pgn);
})();
