# Use compound nodes to render Service boundaries

The Viewer needs to show which Service each Package belongs to, and make it immediately clear when a Flow crosses a service boundary. We chose Cytoscape.js compound nodes (parent–child grouping) over color coding.

Color coding was rejected because it is too subtle when a diagram has many services and packages: color differences between adjacent nodes are easy to miss, and the mapping requires a separate legend that developers must cross-reference. It also gives no structural affordance — a colored package looks the same as any other node; only the hue distinguishes it.

Compound nodes make the boundary structural: each Service is a visible, labeled container that physically groups its Packages. A developer can see at a glance which packages co-deploy, and a Flow step that crosses a container edge is unambiguous. Cross-service steps are additionally rendered with a dashed edge to reinforce the boundary in the flow-highlighting state.

The trade-off is layout rigidity: compound node layout in Cytoscape constrains packages to stay within their parent container, so packages cannot reposition freely across service boundaries. This is accepted — packages within a service naturally belong together spatially, and the structural clarity outweighs the layout flexibility lost.

Packages with no Service (shared libraries, utilities) are grouped into an implicit "Shared" compound node rather than left as free-floating nodes, to keep the compound-node model consistent across the whole graph.

## Considered options

- **Color coding** — rejected: too subtle at scale; requires a legend; no structural affordance; cross-service steps are not visually distinct
- **Compound nodes (chosen)** — Service boundaries are structural and labeled; cross-service steps are visually explicit; layout is constrained but acceptable
