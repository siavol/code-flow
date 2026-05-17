# document-flows

An AI skill that generates an interactive diagram of how user-facing actions move through your codebase. Run it once, get a clickable flow explorer.


## What you get

Running `/document-flows` in your project produces `flows/index.html` — open it in a browser and click any flow name to highlight which packages are involved and in what order.

```
flows/
├── index.html     ← open this (requires a local server)
├── flows.json     ← generated data; re-run the skill to update
└── settings.json  ← navigation config; edit to link nodes to VS Code or GitHub
```

## Install

Copy `skills/document-flows/` into your Claude Code skills directory:

**Windows**
```powershell
New-Item -ItemType SymbolicLink `
  -Path "$env:USERPROFILE\.claude\skills\document-flows" `
  -Target "<path-to-this-repo>\skills\document-flows"
```

**Mac / Linux**
```sh
ln -s <path-to-this-repo>/skills/document-flows ~/.claude/skills/document-flows
```

A symlink means updates to this repo are picked up automatically — no re-install needed.

## Usage

In any Claude Code session, navigate to your project and run:

```
/document-flows
```

The agent will:
1. Read your repo docs (`README`, `CONTEXT.md`, ADRs, OpenAPI specs)
2. Discover packages by scanning directory structure
3. Discover flows by tracing entry points (HTTP routes, CLI commands, event handlers)
4. Trace each flow's steps across package boundaries
5. Write `flows/flows.json` and copy the Viewer to `flows/index.html`

Then open the result:

```sh
npx serve flows/
# open http://localhost:3000
```

## Configuring code navigation

The viewer can open files directly in VS Code or on GitHub when you click a package node or a flow step. This is controlled by `flows/settings.json`, which the skill writes automatically on first run.

```json
{
  "navigation": {
    "provider": "vscode",
    "vscode": { "workspacePath": "/absolute/path/to/repo" },
    "github": { "repo": "owner/repo", "branch": "main" }
  }
}
```

| Field                             | Description                                    |
| --------------------------------- | ---------------------------------------------- |
| `navigation.provider`             | Active provider: `"vscode"` or `"github"`      |
| `navigation.vscode.workspacePath` | Absolute path to the repo root on your machine |
| `navigation.github.repo`          | GitHub repo in `owner/repo` format             |
| `navigation.github.branch`        | Branch to link against (e.g. `"main"`)         |

Switch providers at any time by editing `flows/settings.json` — no re-run needed, just reload the viewer. If the file is absent, navigation links are disabled and a warning is shown in the viewer.
