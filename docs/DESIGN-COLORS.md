# Design System — Trosky

Color palette, typography, chart colors, and visual guidelines.

---

## Color palette

### Semantic colors (CSS variables in `globals.css`)

| Token | Usage | HSL |
|-------|-------|-----|
| `primary` | Our hotel, main CTAs, active states | 221.2 83.2% 53.3% (blue) |
| `secondary` | Muted backgrounds, secondary buttons | 210 40% 96.1% |
| `destructive` | Errors, delete actions | 0 84.2% 60.2% (red) |
| `muted` | Disabled, placeholder text | 210 40% 96.1% |
| `accent` | Hover states, subtle highlights | 210 40% 96.1% |

### Status colors

| Status | Tailwind classes | Usage |
|--------|-----------------|-------|
| Success / AI | `text-emerald-600`, `bg-emerald-50` | Recommended rate, AI indicators |
| Warning | `text-amber-800`, `bg-amber-50` | Discount warnings, event markers |
| Error | `text-destructive`, `bg-destructive/10` | Form errors, failed states |
| Neutral | `text-slate-500`, `text-slate-600` | Comp average, secondary data |

### Calendar color cues (left border)

| Color | Meaning |
|-------|---------|
| Green (`border-l-green-400`) | Our rate roughly in line with comp avg |
| Red (`border-l-red-400`) | Our rate notably above comp avg |
| Blue (`border-l-blue-400`) | Our rate notably below comp avg |

---

## Chart colors

### Competitive Rate Comparison (`overview-graph.tsx`)

| Element | Hex | Style |
|---------|-----|-------|
| Your Hotel | `#2563eb` | Solid, strokeWidth 2.5, dots |
| Recommended | `#16a34a` | Dashed (6 3), strokeWidth 1.5 |
| Comp Avg | `#64748b` | Dashed (4 4), strokeWidth 1.5 |
| Occupancy bars | `#e2e8f0` | Opacity 0.5 |
| Grid lines | `#f1f5f9` | strokeDasharray 3 3 |

### Competitor lines (overview-graph.tsx COLORS array)

```
#94a3b8, #a78bfa, #f97316, #14b8a6, #f43f5e, #8b5cf6, #06b6d4
```

### Matrix chart (`matrix-chart.tsx`)

| Element | Hex |
|---------|-----|
| Our rate bars | `#2563eb` |
| Comp avg bars | `#94a3b8` |
| Recommended line | `#10b981` |
| Occupancy area | `#a78bfa` (opacity 0.3) |
| Event markers | `#f59e0b` |

### Pace chart (`pace-dashboard.tsx`)

| Element | Hex |
|---------|-----|
| OTB Rooms | `#2563eb` |
| OTB LY | `#94a3b8` |

---

## Typography

| Level | Classes | Usage |
|-------|---------|-------|
| Page title | `text-2xl font-semibold` | Page headers |
| Section title | `text-lg font-semibold` | Card titles, section headers |
| Body | `text-sm` | Default content |
| Caption | `text-xs text-muted-foreground` | Subtexts, labels, timestamps |
| Metric value | `text-2xl font-bold` | Summary card values |

**Font:** Inter (Google Fonts), loaded in `layout.tsx`.

---

## Iconography

- **App (dashboard):** Lucide icons only (e.g. DollarSign, Target, BarChart3, TrendingUp, Calendar)
- **Landing page:** Lucide only — no react-icons
- **Icon sizing:** `h-4 w-4` (inline), `h-5 w-5` (buttons), `h-8 w-8` (feature cards)

---

## Spacing

Base unit: 4px (Tailwind default). Common patterns:

| Context | Classes |
|---------|---------|
| Page padding | `p-4 lg:p-6` |
| Card padding | `p-4` or `p-6` |
| Stack gap | `gap-2` (tight), `gap-4` (normal), `gap-6` (sections) |
| Grid gap | `gap-4` (cards), `gap-6` (page sections) |

---

## Component library

Built on [shadcn/ui](https://ui.shadcn.com/) with these components: Button, Card, Input, Label, Badge, Dialog, Select, Tabs, Skeleton, Tooltip, Toast, Separator, DropdownMenu.

Variant utility: `cn()` from `clsx` + `tailwind-merge` (`lib/utils.ts`).

---

## Landing page

The landing page uses a **scoped theme** (`.landing-page` class) with its own accent colors:

| Token | Color | Usage |
|-------|-------|-------|
| `landing-emerald` | Emerald | Trust, AI, success |
| `landing-amber` | Amber | Alerts, attention |
| `landing-sky` | Sky | Data, analytics |
| `landing-violet` | Violet | Premium, differentiation |

The hero chart uses the **app palette** (blue/emerald/slate) so it matches the real dashboard.

---

## Dark mode

`darkMode: ["class"]` is configured in `tailwind.config.ts` but not yet implemented. All current styles target light theme only.

---

## Guidelines

- Use semantic color tokens (`primary`, `destructive`, etc.) for app UI — not raw hex
- Chart colors are the exception: hex values are needed for Recharts props
- Keep the hero chart colors in sync with the app chart colors
- Landing accents should align semantically with app colors (emerald = AI/success)
- Badge variants: `default` (primary), `secondary` (neutral), `destructive` (error), `outline` (subtle)
