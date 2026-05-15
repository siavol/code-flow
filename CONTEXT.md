# Code Flow Visualizer

A tool for generating interactive visual diagrams that document how named user-facing actions move through the packages of an application.

## Language

**Package**:
A named directory boundary in the codebase that owns a coherent responsibility (e.g., `auth`, `billing`, `api-gateway`).
_Avoid_: module, component, service, layer

**Flow**:
A named, user-initiated action that has a defined sequence of package interactions from start to finish (e.g., "Invite new user", "Pay the order").
_Avoid_: workflow, process, use case

**Step**:
An ordered, directed interaction from one Package to another within a Flow, with a short agent-written plain-English label (e.g., "validate token", "send invite email").
_Avoid_: connection, edge, link, call

**Viewer**:
The standalone `index.html` application that loads `flows.json` and renders the interactive Package graph with Flow highlighting.
_Avoid_: app, frontend, dashboard

## Relationships

- A **Flow** consists of one or more **Steps**
- A **Step** has exactly one source **Package** and one target **Package**
- The **Viewer** reads one `flows.json` and renders all **Packages** and **Flows**

## Example dialogue

> **Dev:** "Should we add a 'type' field to the Step for HTTP vs event calls?"
> **Domain expert:** "No — the Step label describes what happens in plain English. Implementation details like HTTP or events don't belong in the diagram."

## Flagged ambiguities

- "component" was used to mean **Package** — resolved: Package is the only node type
- "workflow" was used to mean **Flow** — resolved: Flow is the canonical term
- "connection" was used to mean **Step** — resolved: Step is the canonical term
