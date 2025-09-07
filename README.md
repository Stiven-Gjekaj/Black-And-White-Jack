# Black-WhiteJack

A lightweight Blackjack game built with vanilla HTML, CSS and JavaScript. No frameworks or bundlers. Designed to run entirely from a static folder or GitHub Pages and playable offline thanks to a service worker.

## Features
- 6-deck shoe with automatic reshuffle
- Actions: hit, stand, double, split, surrender, insurance (basic UI)
- Keyboard shortcuts (H hit, S stand, D deal, B double, X split, U surrender, M mute)
- Chip rack with denominations 1-500
- Bankroll and settings persist via localStorage
- Responsive layout for desktop and mobile with automatic touch-friendly control sizing
- Sounds and animations with reduced motion support

## Run locally
Open `index.html` in a modern browser. No build step is required. To deploy on GitHub Pages, push the repository and enable Pages pointing to the root.

## Architecture
- `js/game/Deck.js` – multi-deck shoe and shuffling
- `js/game/BlackjackEngine.js` – game state machine and rules
- `js/game/Chips.js` – bankroll and bets
- `js/game/AudioManager.js` – sound effects
- `js/ui/*` – rendering, animations and controls
- `js/utils/helpers.js` – utility helpers

## Customisation
Table behaviour and preferences are persisted in `localStorage` under keys `bankroll`, `tableSettings`, and `soundEnabled`. Modify defaults in respective modules for different payouts, deck counts or animation speeds.

## Accessibility & Performance
ARIA labels and keyboard shortcuts are provided. SVG assets ensure crisp rendering at any size. The service worker caches core assets for offline play.

## Known limitations
- Only single player vs dealer (no side bets or multiplayer)
- Basic animations and graphics – feel free to enhance

## License
MIT
