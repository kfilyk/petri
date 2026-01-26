# Petri 2.19

An evolutionary simulation where creatures with neural networks compete for food, reproduce, and evolve.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
petri/
├── src/                    # TypeScript source
│   ├── main.ts             # Entry point
│   ├── types.ts            # Type definitions
│   ├── constants.ts        # Configuration constants
│   ├── state.ts            # Global state management
│   ├── entities/           # Core classes
│   │   ├── Animal.ts       # Creature with neural network
│   │   ├── Neuron.ts       # Neural network node
│   │   ├── Eye.ts          # Visual sensor
│   │   ├── Mouth.ts        # Feeding organ
│   │   └── Tile.ts         # Food-producing cell
│   ├── managers/           # Game systems
│   │   ├── TileManager.ts  # Terrain generation
│   │   ├── AnimalManager.ts# Creature lifecycle
│   │   ├── StatManager.ts  # Statistics
│   │   ├── InputManager.ts # Mouse/keyboard
│   │   └── Dashboard.ts    # UI updates
│   ├── genetics/
│   │   └── mutations.ts    # Mutation algorithms
│   └── utils/
│       └── math.ts         # Fast math functions
├── dist/                   # Production build output
├── icons/                  # UI icons
├── index.html              # Main HTML file
├── style.css               # Styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Controls

| Action | Control |
|--------|---------|
| Spawn creature | Right-click on map |
| Select creature | Left-click on creature |
| Pan camera | WASD or Arrow keys |
| Zoom | Mouse wheel |
| Pause/Resume | Spacebar or Play button |
| New simulation | Restart button |

## Production Build

```bash
# Build optimized bundle
npm run build

# Output goes to dist/ folder
# Serve with any static file server:
npx serve dist
```

The production build:
- Minifies and bundles all TypeScript to ~83KB gzipped
- Includes all assets (icons, fonts)
- Outputs to `dist/` directory

## Development

```bash
# Start dev server with hot reload
npm run dev

# Type check without emitting
npx tsc --noEmit

# Build and preview
npm run build && npm run preview
```

## Original JavaScript Version

The original vanilla JS files are preserved for reference:
- `components/animal.js`
- `components/eye.js`
- `components/mouth.js`
- `components/neuron.js`
- `petri.js`
- `genalgs.js`

## Configuration

Key constants in `src/constants.ts`:

| Constant | Default | Description |
|----------|---------|-------------|
| `POPCAP` | 1000 | Maximum population |
| `FIELDX/FIELDY` | 1000 | World dimensions |
| `NUM_INPUT_NEURONS` | 30 | Neural network inputs |
| `NUM_OUTPUT_NEURONS` | 35 | Neural network outputs |
| `MAX_SIZE` | 20 | Maximum creature size |

## Tech Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool with hot reload
- **Chart.js 2.x** - Statistics visualization
- **Canvas API** - Rendering
