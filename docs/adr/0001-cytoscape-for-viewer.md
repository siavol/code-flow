# Use Cytoscape.js for the Viewer graph

The Viewer needs interactive graph rendering with auto-layout and click-based Flow highlighting. We chose Cytoscape.js over D3.js and plain SVG because it provides dagre-based auto-layout and a click/highlight API out of the box — both of which would require significant custom implementation with D3 or SVG. Cytoscape.js loads from CDN, keeping `index.html` self-contained with no build step.

## Considered Options

- **D3.js** — maximum flexibility but requires implementing layout algorithms and interaction handling manually
- **Plain SVG** — zero dependencies but auto-layout would require a full graph algorithm implementation from scratch
- **Cytoscape.js** — chosen: purpose-built for interactive graphs, dagre layout plugin, clean highlight API
