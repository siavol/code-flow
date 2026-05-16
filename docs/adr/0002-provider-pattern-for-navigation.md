# Use a built-in Provider pattern for code navigation

The Viewer needs to navigate to code in different destinations (VS Code, GitHub) depending on the developer's environment. We chose to build URL-construction logic directly into the Viewer per named Provider, rather than letting users write URL templates in `settings.json`.

A URL template approach was considered — simple to implement, no code needed per destination. It was rejected because template strings require developers to know the exact URL format for each destination (including edge cases like directory vs file URLs, line anchors, and OS path separators), and they break silently when malformed. Provider logic in the Viewer handles these details correctly and transparently.

`settings.json` declares the active provider by name and supplies provider-specific properties (e.g., `vscode.workspacePath`, `github.repo`, `github.branch`). The Viewer reads these and delegates URL construction to the matching Provider. Adding a new destination means adding a Provider in the Viewer's code — not editing user-facing configuration.

## Considered options

- **URL templates in `settings.json`** — rejected: puts URL format knowledge on the user; silent failures when malformed; cannot handle structural differences between file and directory URLs across providers
- **Built-in Providers (chosen)** — app owns URL logic; settings are typed properties; failures are explicit; new providers are added in one place
