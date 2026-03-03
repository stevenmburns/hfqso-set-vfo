# HFQSO Set VFO

One-click VFO tuning for the four [HFQSO](https://hfqso.com) activity frequencies.

| Band | Frequency     |
|------|--------------|
| 17m  | 18.1575 MHz  |
| 15m  | 21.3830 MHz  |
| 12m  | 24.9700 MHz  |
| 10m  | 28.4700 MHz  |

## Prerequisites

- [flrig](http://www.w1hkj.com/files/flrig/) running and connected to your rig (listens on `localhost:12345` by default)
- Node.js 20+

## Setup

```bash
npm --prefix frontend install
```

## Running

Start the flrig proxy and the dev server in two separate terminals:

```bash
# Terminal 1 — XML-RPC proxy (handles CORS)
npm run proxy

# Terminal 2 — frontend
npm run dev
```

Then open the URL printed by Vite (typically `http://localhost:5173`) and click a band button to tune your rig.

## How it works

The browser cannot call flrig's XML-RPC server directly due to CORS restrictions. `flrig-proxy.js` is a thin Node.js HTTP proxy that forwards requests from the frontend to `localhost:12345` and adds the necessary CORS headers.
