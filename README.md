# 🌍 ThreeGeoPlay

**Real-world map tiles rendered in 3D — powered by Three.js and OpenStreetMap vector data.**

ThreeGeoPlay is a JavaScript library that fetches [Vector Tiles (MVT/PBF)](https://docs.mapbox.com/vector-tiles/specification/) and renders them as 3D geometry directly into your Three.js scene. Roads, buildings, water, land use — all as real meshes you can walk through, fly over, or build games on top of.

---

## ✨ Features

- 🗺️ **Vector tile rendering** — roads, buildings, waterways, land use, and more
- 🏙️ **3D building extrusion** — real heights from OSM data
- 🎨 **Fully styleable** — swap materials, colors, and visibility per layer
- 📡 **Auto tile loading** — smart queue with concurrency, abort, and retry
- 🎮 **Follow mode** — attach to any `THREE.Object3D` (camera, player…) and the map follows
- 🔲 **Circular or square** render regions
- ⚡ **Zero dependencies** beyond Three.js

---

## 📦 Installation (coming soon)

```bash
npm install three-geo-play
```

---

## 🚀 Quick Start

```js
import * as THREE from 'three';
import { ThreeGeoPlay } from 'three-geo-play';

const scene    = new THREE.Scene();
const camera   = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const geo = new ThreeGeoPlay(scene, camera, renderer);

// Set your starting coordinates and tile source
const config = geo.getMapConfig();
config.originLatLon       = { lat: 41.9028, lon: 12.4964 }; // Rome
config.pbfTileProviderZXYurl = 'https://your-tile-server/{z}/{x}/{y}.pbf';
config.zoomLevel          = 16;
config.tileWorldSize      = 50;
config.renderDistance     = 6;

geo.start();

function animate() {
  requestAnimationFrame(animate);
  geo.onFrameUpdate();          // ← call every frame
  renderer.render(scene, camera);
}
animate();
```

---


## 🎨 Styling
 
Access the style through `MapConfig` and modify materials directly on each layer type:
 
```js
import * as THREE from 'three';
 
const mapConfig = geo.getMapConfig();
 
// Style roads — get the layer, then set material on the type
const transport = mapConfig.mapStyle.getStyleLayerByName('transportation');
transport.primary.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
transport.primary.outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
transport.motorway.isVisible = true;
transport.pedestrian.isVisible = false;
 
// Style land use
const landuse = mapConfig.mapStyle.getStyleLayerByName('landuse');
landuse.residential.material = new THREE.MeshBasicMaterial({ color: 0xe8f4e8 });
landuse.industrial.isVisible = false;
 
// Style waterways
const waterways = mapConfig.mapStyle.getStyleLayerByName('waterway');
waterways.river.material = new THREE.MeshBasicMaterial({ color: 0x4488cc, transparent: true, opacity: 0.8 });
```
 
Each layer exposes its types directly (e.g. `transport.primary`, `landuse.residential`) — set `material`, `outlineMaterial`, `isVisible`, `lineWidth`, and `YOrder` per type.

## 🗂️ Supported Layers

| Layer | Types |
|---|---|
| `transportation` | motorway, primary, secondary, tertiary, path, rail, ferry… |
| `building` | extruded 3D with real render heights |
| `waterway` | river, stream, canal, ditch… |
| `landuse` | residential, park, industrial, school, hospital… |
| `background` | ground plane |

---

## 📄 License

MIT
