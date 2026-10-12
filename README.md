# Pixel Quest

A three-world arcade platformer built with React, Vite, and Canvas. No image assets or game engine downloads required.

## Run

```sh
npm install
npm run dev
```

## Controls

- Arrow keys or A / D: move
- Space, W, or Up: jump (hold for a higher jump)
- Shift: sprint
- P or Escape: pause / resume
- Touch controls are available on smaller screens
- Toolbar: sound, restart current world, pause, fullscreen

Collect coins, stomp enemies, hit question blocks from below, activate checkpoints, find three stars per world, and reach the flag. Complete Sunlit Meadows, Twilight Grove, and Golden Summit. Best scores and sound preferences are stored locally when browser storage is available. Restart resets the current run's score and lives; advancing worlds carries them forward.

## Verify

```sh
npm test
npm run build
```

Browser smoke tests use installed Microsoft Edge and a running dev server at http://127.0.0.1:5173:

```sh
npm run test:browser
```

Preview screenshots are saved to tests/desktop-preview.png and tests/mobile-preview.png.

Original source is preserved in backups/original/. Fonts use Google Fonts with local fallback fonts; gameplay needs no external assets. Audio is synthesized locally after interaction.
