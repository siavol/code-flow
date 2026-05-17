# Repo instructions for Claude

## Always update SKILL.md alongside the Viewer

`skills/document-flows/SKILL.md` is the agent prompt that runs when a developer invokes `/document-flows`. It is the source of truth for what the skill discovers and what it writes into `flows.json`.

**When you change the `flows.json` schema** (add/remove/rename fields in `packages`, `flows`, `steps`, or `services`), you MUST update SKILL.md in the same change so the skill produces output that matches the Viewer.

**When you change Viewer behaviour that depends on data the skill writes** (e.g. a new field the Viewer reads), you MUST update SKILL.md so the skill writes that field.

The test suite verifies the Viewer against fixture JSON — it does not verify that SKILL.md produces correct JSON. So a failing SKILL.md update will not be caught by tests. You must update it manually, every time.

### Checklist before marking a data-schema or discovery task complete

- [ ] `flows.json` schema in CONTEXT.md is updated
- [ ] `SKILL.md` discovery steps reflect any new fields or service-detection logic
- [ ] `SKILL.md` write step (§5 "Write flows/flows.json") matches the updated schema example
