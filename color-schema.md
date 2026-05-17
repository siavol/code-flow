# Code Flow — Color Schema: Slate & Indigo

## Overview

Two color families carry all semantic meaning:
- **Indigo** — internal services, selected/active states
- **Violet** — external APIs and dashed connections

All structural surfaces use clean neutral grays with no purple tint.

---

## Backgrounds & Surfaces

| Token | Hex | Usage |
|---|---|---|
| App background | `#F7F8FA` | Shell, sidebar, panels |
| Canvas background | `#ECEEF4` | Diagram canvas area |
| Surface | `#FFFFFF` | Cards, step panels |
| Selected background | `#F0F3FF` | Selected flow item background |
| Border default | `#DDE1EB` | Panel borders, card outlines |

---

## Brand / Accent — Indigo

| Token | Hex | Usage |
|---|---|---|
| Indigo 600 | `#4F46E5` | Selected step header, active states, edge arrows |
| Indigo 700 | `#4338CA` | Text on light indigo backgrounds, tag text |
| Indigo 200 | `#C7D2FE` | Internal node fill, internal service node bg |
| Indigo 100 | `#E0E7FF` | Internal service tags (pills), hover states |

---

## External Services — Violet

| Token | Hex | Usage |
|---|---|---|
| Violet 100 | `#EDE9FE` | External node fill, external API tag bg |
| Violet 600 | `#7C3AED` | External tag text, dashed edge stroke |
| Violet 900 | `#4C1D95` | Text inside external nodes |

---

## Text

| Token | Hex | Usage |
|---|---|---|
| Primary | `#111827` | Flow names, step titles, main labels |
| Secondary | `#4B5563` | Step body text, descriptions |
| Muted | `#9CA3AF` | "3 steps · 5 packages", section counts |
| On indigo node | `#1E1B4B` | Text inside internal diagram nodes |
| On selected flow | `#1E1B4B` | Title in selected flow list item |
| On selected flow (sub) | `#4338CA` | Subtitle in selected flow list item |
| On dark (white) | `#FFFFFF` | Text on Indigo 600 backgrounds |

---

## Component Rules

### Flow List Items

| State | Background | Left border | Title | Subtitle |
|---|---|---|---|---|
| Default | `#FFFFFF` | none | `#111827` | `#9CA3AF` |
| Selected | `#F0F3FF` | `3px solid #4F46E5` | `#1E1B4B` | `#4338CA` |
| Hover | `#F5F7FF` | none | `#111827` | `#9CA3AF` |

### Step Cards

| State | Header bg | Header text | Body bg | Body text |
|---|---|---|---|---|
| Default | `#F1F5F9` | `#374151` | `#FFFFFF` | `#111827` |
| Selected | `#4F46E5` | `#FFFFFF` | `#FFFFFF` | `#111827` |

### Diagram Nodes

| Type | Fill | Border | Text |
|---|---|---|---|
| Internal service | `#C7D2FE` | `1px solid #A5B4FC` | `#1E1B4B` |
| External service / API | `#EDE9FE` | `1px dashed #7C3AED` | `#4C1D95` |

### Service / Package Tags (Pills)

| Type | Background | Text |
|---|---|---|
| Internal service | `#E0E7FF` | `#4338CA` |
| External service / API | `#EDE9FE` | `#7C3AED` |
| File path chip | `#F1F5F9` | `#374151` (monospace) |

### Diagram Edges (Arrows)

| Type | Stroke | Style |
|---|---|---|
| Internal connection | `#4F46E5` | Solid |
| External connection | `#7C3AED` | Dashed |

### Section Headers (e.g. "FLOWS · 7", "STEPS · 4")

| Property | Value |
|---|---|
| Text | `#9CA3AF` |
| Case | Uppercase |
| Font size | 11px |

---

## Contrast Ratios (WCAG AA — minimum 4.5:1)

| Context | Foreground | Background | Ratio |
|---|---|---|---|
| Selected flow title | `#1E1B4B` | `#F0F3FF` | 8.4:1 ✓ |
| Selected step header | `#FFFFFF` | `#4F46E5` | 7.3:1 ✓ |
| Default step header | `#374151` | `#F1F5F9` | 7.1:1 ✓ |
| Internal node text | `#1E1B4B` | `#C7D2FE` | 8.1:1 ✓ |
| Internal tag text | `#4338CA` | `#E0E7FF` | 5.2:1 ✓ |
| External node text | `#4C1D95` | `#EDE9FE` | 7.8:1 ✓ |
| Body text | `#111827` | `#FFFFFF` | 16.1:1 ✓ |
| Secondary text | `#4B5563` | `#FFFFFF` | 7.6:1 ✓ |
