---
name: document-flows
description: Generate an interactive visual diagram of the main flows in a codebase. Discovers Packages (directory boundaries) and user-initiated Flows by tracing entry points (routes, handlers, CLI commands) and enriching from repo docs. Outputs flows/index.html (Viewer) + flows/flows.json (data). Use when a developer wants to document or explore cross-package workflows in their application.
---

# document-flows

Generates `flows/index.html` + `flows/flows.json` — an interactive diagram showing how named user-facing actions move through the application's packages.

## Terminology

- **Package**: a named directory boundary that owns a coherent responsibility (e.g. `src/auth`, `packages/billing`)
- **Flow**: a named user-initiated action with a defined sequence of package interactions (e.g. "Invite new user")
- **Step**: an ordered, directed interaction from one Package to another within a Flow, with a short plain-English label

## Process

### 1. Read repo documentation

Before touching code, read all available documentation to understand the domain:
- `README.md`, `CONTEXT.md`, `CONTEXT-MAP.md`
- Files in `docs/` — ADRs, specs, OpenAPI/Swagger definitions
- Inline comments on major entry points

### 2. Discover Packages

Scan the repo for named directory boundaries that contain source code. A Package is a top-level or second-level directory (e.g. `src/auth`, `packages/api-gateway`) with meaningful responsibility.

Skip: `node_modules`, `.git`, `dist`, `build`, `out`, `.next`, `coverage`, `__pycache__`, `vendor`, `target`, `tmp`.

For each Package collect:
- `id`: directory name, lowercased, hyphenated (e.g. `api-gateway`)
- `name`: short human-readable name (e.g. `API Gateway`)
- `path`: relative path from repo root (e.g. `src/api-gateway`)
- `entryFile`: relative path to the package's primary entry file (e.g. `src/api-gateway/index.js`); look for `index.js`, `index.ts`, `main.js`, `main.ts`, `app.js`, or the file named in `package.json`'s `main` field; set to `null` if no clear entry file exists

### 3. Discover Flows

Scan for entry points — where user-initiated actions begin:
- **HTTP routes**: `router.get/post/put/delete`, `@app.get/post`, `urlpatterns`, `@Get/@Post`, etc.
- **CLI commands**: `commander .command()`, `@click.command()`, `cobra AddCommand()`
- **Event/message handlers**: queue subscribers, event bus handlers, Kafka/SQS consumers
- **Public API methods**: exported functions in an `index` file representing user actions

Name each Flow as a short user-facing plain-English phrase (3–6 words, verb + noun: "Invite new user", "Pay the order", "Export report as CSV"). Use domain language from repo docs where available.

Aim for 5–20 Flows. Skip internal utility routes (health checks, metrics) and focus on meaningful user-initiated actions.

### 4. Trace Steps

For each Flow, trace execution from the entry point through the codebase. Each time execution crosses a Package boundary, record a Step:
- `source`: id of the calling Package
- `target`: id of the called Package
- `label`: short plain-English phrase (3–6 words) describing what passes between them
- `order`: integer starting at 1

Follow function calls, imports, HTTP clients, event emits, and DB calls across Package boundaries. Multiple Steps between the same two Packages in one Flow are allowed.

For each Step, record the **call site** — the exact line in the source Package where the transition originates:
- `location.file` — path relative to the repo root (e.g. `src/auth/inviteService.js`)
- `location.line` — 1-based line number of the outgoing call

If you cannot trace a Step to a specific line, set `location` to `null`. Do not guess.

A Flow must have at least 2 Packages and 1 Step to be included.

### 5. Write flows/flows.json

Create `flows/` at the repo root. Write `flows/flows.json`:

```json
{
  "packages": [
    { "id": "auth", "name": "Auth", "path": "src/auth", "entryFile": "src/auth/index.js" }
  ],
  "flows": [
    {
      "id": "invite-user",
      "name": "Invite new user",
      "steps": [
        { "source": "api-gateway", "target": "auth", "label": "validate admin token", "order": 1, "location": { "file": "src/api-gateway/routes/users.js", "line": 15 } },
        { "source": "auth", "target": "users", "label": "create pending user", "order": 2, "location": { "file": "src/auth/inviteService.js", "line": 42 } },
        { "source": "users", "target": "email", "label": "send invite email", "order": 3, "location": null }
      ]
    }
  ]
}
```

JSON is pure data — no coordinates, colors, or layout hints.

### 6. Copy the Viewer

Copy `index.html` from this skill's base directory to `flows/index.html`. The skill's base directory is provided in the `Base directory for this skill:` line in your context.

### 7. Write flows/settings.json

Write `flows/settings.json` with the absolute path to the repo root so the developer can immediately navigate to code from the Viewer.

Detect the repo root as the directory containing `.git/`. Write the absolute path using the OS path separator.

```json
{
  "navigation": {
    "provider": "vscode",
    "vscode": { "workspacePath": "/absolute/path/to/repo" },
    "github": { "repo": "owner/repo", "branch": "main" }
  }
}
```

- Set `vscode.workspacePath` to the detected absolute repo root
- Set `github.repo` to `owner/repo` format if a GitHub remote is found (`git remote get-url origin`); otherwise set to `"owner/repo"` as a placeholder
- Set `github.branch` to the current default branch if detectable; otherwise `"main"`
- The active `provider` defaults to `"vscode"`

Do not overwrite `settings.json` if it already exists — the developer may have customised it.

### 8. Instruct the developer

Tell the developer:

```
flows/ is ready. Open it with a local server:
  npx serve flows/

Then open http://localhost:3000 in your browser.

Click any package node to open it in VS Code.
Click a step edge (when a flow is selected) to jump to the call site.
To switch to GitHub navigation, edit flows/settings.json and set "provider": "github".
```
