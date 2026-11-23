# Pinkii's Little Universe — Cinematic pass (prototype for private preview)

This is the updated **editable** React + Three.js/Vite project for Ayra (Pinkii), built on the version already tested on Ayaan's Mac.

## Run on a Mac

Install Node.js 22 or later. Extract this ZIP, then in Terminal:

```sh
cd /path/to/pinkii-studio-final
npm install
npm run dev
```

Open the **Local** URL printed by Vite (usually `http://localhost:3000/`). Leave the Terminal open while previewing.

## What changed in this update

- Replaced the odd rotated half-cylinder headboard with a tufted soft scalloped headboard, plush pillows, upholstered bedding and a sewn flower cushion.
- Added two tiny articulated keepsake dolls (Ayaan and Pinkii) with a working **Play with dolls** wave action in the dollhouse toy tray.
- Upgraded dollhouse warm accent lighting and wall decoration.
- Re-art-directed Forever Café toward contemporary pink/rose-gold styling: brighter interior and actual point lights, pastry counter, sign, flowers and more varied dusk city sky. The existing 3D city and tram remain beyond the window.
- Built a flowered archway with glowing hanging lanterns in the Midnight Garden.
- Added a fine textile bump map to each teddy's fur.
- Resolved the original esbuild version mismatch (now `^0.28.2`) and pinned TypeScript to a stable compatible range.

## Review checklist

1. Dollhouse: no odd upright object protrudes through the bed. Gift, wardrobe, letter, lamp, window, drawer, mirror and music box work. The tiny dolls wave when **Play with dolls** is pressed.
2. Café: proper view of buildings through the window, warmer interior lighting, pastry counter, city ambience. **Cheers, jana!** lifts both cups and returns them to the table.
3. Garden: roses bloom; arch and lanterns don't block the bridge/camera.
4. Cuddle: bears hug and return to their idle state; no clipping with furniture.
5. Responsive: inspect with narrow browser window or on iPhone, with reduced-motion accessibility settings, and test touch interactions.

**Status:** Code has been statically checked here, but the dependency registry was inaccessible in this execution environment, so this pass still needs visual browser testing on your Mac. Do not publish to Netlify yet.

## Build for eventual Netlify deployment

```sh
npm run lint
npm run build
```

Deploy the resulting `dist` folder after visual and interaction approval. No user data collection or external services are required for this static site.
