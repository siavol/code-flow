# Code Flow Visualizer

A tool for generating interactive visual diagrams that document how named user-facing actions move through the packages of an application.

## Repository layout

```
skills/document-flows/
├── SKILL.md       ← agent prompt: discovers Packages/Flows/Steps, writes output
└── index.html     ← the Viewer; copied to flows/ when the skill runs

cypress/
├── e2e/           ← one spec per Viewer behavior
│   ├── sidebar.cy.js
│   ├── graph.cy.js
│   ├── highlighting.cy.js
│   ├── deselect.cy.js
│   └── error-state.cy.js
└── fixtures/      ← one JSON file per data scenario

cypress.config.js  ← serves skills/document-flows/ as the test origin
package.json

docs/adr/
└── 0001-cytoscape-for-viewer.md

CONTEXT.md         ← this file
```

The skill is invoked as `/document-flows` in Claude Code. It writes two files into the target repo:

```
flows/
├── flows.json     ← generated data (see schema below)
└── index.html     ← copied from skills/document-flows/index.html
```

## flows.json schema

The contract between the skill (writer) and the Viewer (reader). Pure data — no view information.

```json
{
  "packages": [
    { "id": "auth", "name": "Auth", "path": "src/auth" }
  ],
  "flows": [
    {
      "id": "invite-user",
      "name": "Invite new user",
      "steps": [
        { "source": "auth", "target": "users", "label": "create pending user", "order": 1 }
      ]
    }
  ]
}
```

Field rules:
- `packages[].id` — lowercased, hyphenated directory name; used as foreign key in steps
- `steps[].source` / `steps[].target` — must reference a `packages[].id`
- `steps[].label` — agent-written plain English, 3–6 words; never raw code symbols
- `steps[].order` — integer starting at 1; multiple steps between the same two packages allowed

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
