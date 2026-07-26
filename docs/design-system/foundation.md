# SariHub Design System Foundation

This document defines the Phase 2 styling foundation for the SariHub frontend redesign. It is the implementation companion to the UI Architecture Analysis and Design Specification v1.0.

No page redesign is included in this phase. The goal is to establish a stable styling architecture that current pages can coexist with and future components can consume.

## 1. Style Architecture

```txt
src/styles/
├── _main.scss
├── abstracts/
│   ├── _index.scss
│   ├── _mixins.scss
│   └── _tokens.scss
├── base/
│   ├── _layout.scss
│   ├── _reset.scss
│   └── _typography.scss
├── themes/
│   ├── _css-variables.scss
│   └── _material.scss
├── utilities/
│   ├── _accessibility.scss
│   ├── _layout.scss
│   └── _state.scss
└── vendors/
    ├── _bootstrap-bridge.scss
    └── _ng-select-bridge.scss
```

| File | Responsibility |
|---|---|
| `src/custom-theme.scss` | Angular CLI global style entrypoint. It delegates to `src/styles/_main.scss`. |
| `styles/_main.scss` | Ordered composition of tokens, themes, base rules, vendor bridges, and utilities. |
| `abstracts/_tokens.scss` | SCSS source tokens for colors, type, spacing, radius, shadows, motion, breakpoints, and layers. This file should not output CSS by itself. |
| `abstracts/_mixins.scss` | Shared SCSS helpers for focus rings, breakpoints, and reduced motion. |
| `abstracts/_index.scss` | Re-export point for abstracts. |
| `themes/_css-variables.scss` | Emits `--sh-*` CSS custom properties from SCSS tokens. Future dark mode starts here with `[data-theme='dark']`. |
| `themes/_material.scss` | Angular Material theme using SariHub token palettes and typography. |
| `base/_reset.scss` | Minimal modern reset and reduced-motion defaults. |
| `base/_typography.scss` | Global body, headings, links, and text defaults. |
| `base/_layout.scss` | Token-driven layout containers and page/section primitives. |
| `utilities/_accessibility.scss` | Screen-reader utility and global focus-visible defaults. |
| `utilities/_layout.scss` | Small semantic layout helpers for new components. |
| `utilities/_state.scss` | Semantic text/background utilities for new components. |
| `vendors/_bootstrap-bridge.scss` | Temporary bridge that maps Bootstrap CSS variables/classes to SariHub tokens. |
| `vendors/_ng-select-bridge.scss` | Temporary bridge for ng-select focus/highlight behavior. |
| `src/styles.css` | Legacy migration layer only. Existing template CSS remains here until pages migrate. Do not add new design-system rules to this file. |

## 2. Design Tokens

Token naming uses two layers:

```txt
SCSS source token:      $sh-color-brand-primary-500
Runtime CSS token:     --sh-color-brand-primary
```

Approved token categories:

| Category | Prefix | Examples |
|---|---|---|
| Brand | `--sh-color-brand-*` | `--sh-color-brand-primary`, `--sh-color-brand-accent` |
| Neutral | `--sh-color-*` | `--sh-color-surface`, `--sh-color-text-muted`, `--sh-color-border` |
| Semantic | `--sh-color-success` | `--sh-color-danger-surface`, `--sh-color-info` |
| Commerce | `--sh-color-price` | `--sh-color-discount`, `--sh-color-stock-low` |
| Typography | `--sh-font-*` | `--sh-font-family-base`, `--sh-font-size-lg` |
| Spacing | `--sh-space-*` | `--sh-space-4`, `--sh-space-8` |
| Radius | `--sh-radius-*` | `--sh-radius-md`, `--sh-radius-pill` |
| Elevation | `--sh-shadow-*` | `--sh-shadow-sm`, `--sh-shadow-overlay` |
| Motion | `--sh-duration-*`, `--sh-ease-*` | `--sh-duration-base`, `--sh-ease-standard` |
| Breakpoints | `--sh-bp-*` | `--sh-bp-tablet`, `--sh-bp-desktop` |
| Z-index | `--sh-z-*` | `--sh-z-modal`, `--sh-z-toast` |

Rules:

- Tokens are the only approved source for colors, spacing, radius, shadows, motion, and z-index.
- Component styles should use CSS custom properties, not raw Sass variables, unless the value is needed at Sass compile time.
- Future dark mode must be implemented by overriding CSS custom properties, not by duplicating components.

## 3. Angular Material Theme

Angular Material is now themed with SariHub palettes:

- Primary: SariHub marketplace green.
- Accent: SariHub action blue.
- Warn: SariHub danger red.
- Typography: SariHub base font stack and type scale.

Material remains the preferred foundation for:

- Dialogs
- Tables
- Paginators
- Tabs
- Form fields where already used
- Menus and overlays in future shared components

Material should not introduce independent visual decisions. Override via tokens, not ad hoc component CSS.

## 4. Bootstrap Migration Strategy

Current Bootstrap usage is broad across templates: grid, cards, buttons, forms, badges, tables, alerts, modals, navbar, dropdowns, spacing utilities, and responsive helpers.

| Category | Decision | Rationale |
|---|---|---|
| Grid (`container`, `row`, `col-*`) | Keep temporarily | Low-risk layout dependency across most pages. Replace gradually with layout primitives only when touching pages. |
| Spacing utilities (`p-*`, `m-*`, `g-*`) | Keep temporarily | High usage. Avoid mass rewrite. New code should use component styles or token utilities. |
| Buttons (`btn`, `btn-primary`) | Bridge now, replace later | Existing actions remain stable. Future shared buttons should not depend on Bootstrap. |
| Cards (`card`) | Bridge now, replace later | Existing admin/storefront surfaces rely on cards. Future repeated items use SariHub cards. |
| Forms (`form-control`, `form-select`) | Bridge now, replace with Material/custom | Keep old pages stable; use Material or shared form primitives for new work. |
| Tables (`table`) | Keep temporarily | Admin pages mix Bootstrap and Material. New operational tables should use Material-backed shared table patterns. |
| Badges/alerts | Bridge now, replace later | Status semantics should move into shared badge/alert components. |
| Modals/dropdowns/navbar | Replace with Angular CDK/Material/custom | Bootstrap JS should be phased out to reduce global script coupling. |
| Legacy admin theme assets | Remove after migration | Large asset footprint and separate visual language. |

Phased plan:

1. Keep Bootstrap loaded and token-bridged.
2. Build new shared UI primitives using SariHub tokens.
3. Replace Bootstrap buttons, badges, cards, and forms page by page.
4. Replace Bootstrap modals/dropdowns with Angular CDK or Material overlay primitives.
5. Remove unused Bootstrap JS once no component needs data attributes or imperative Bootstrap behavior.
6. Remove unused legacy admin theme assets after workspace migration.

## 5. Global Styles

CSS reset strategy:

- Use a small modern reset.
- Do not erase native semantics.
- Respect `prefers-reduced-motion`.

Typography:

- Global font is `--sh-font-family-base`.
- Headings use zero letter spacing and token line-height.
- Component-specific typography should reference token sizes.

Layout:

- New layouts should use `.sh-container`, `.sh-container--wide`, `.sh-page`, and `.sh-section`.
- Bootstrap containers remain valid only for existing pages during migration.

Accessibility:

- Global `:focus-visible` uses `--sh-focus-ring-color`.
- Icon-only controls must have accessible labels.
- Use `.sh-sr-only` for visually hidden text.

Scrollbar policy:

- No custom scrollbar styling in Phase 2.
- Native platform scrollbars are preferred unless a future component has a clear usability need.

## 6. Design System Rules

- Never add hardcoded colors in new component styles.
- Never add arbitrary spacing values in new component styles.
- Use semantic tokens before brand tokens. For example, use `--sh-color-danger`, not a raw red.
- Shared UI components must consume `--sh-*` tokens.
- Do not add new global selectors to `src/styles.css`.
- Do not create duplicate one-off utility classes when a tokenized utility exists.
- Do not create a separate admin or seller design system.
- Prefer Angular Material/CDK for complex overlays, tables, and accessibility-sensitive controls.
- Keep Bootstrap classes only in existing pages until that page is actively migrated.
- Any new z-index must use a layer token.
- All motion must use duration and easing tokens.

## 7. Incremental Migration Plan

```txt
Foundation
└── Tokens, CSS variables, Material theme, Bootstrap bridge
    └── Shared UI primitives
        └── Storefront shell
            └── Storefront pages
                └── Customer account and checkout
                    └── Seller workspace
                        └── Admin workspace
                            └── Remove legacy CSS/assets
```

Recommended adoption order:

1. New components consume `--sh-*` tokens immediately.
2. Existing component CSS is only migrated when that component is touched for feature work.
3. Keep page HTML stable until shared primitives exist.
4. Replace visual classes before changing behavior.
5. Verify each migration at mobile, tablet, and desktop widths.
6. Remove old CSS only after no templates reference it.

Regression controls:

- Build after each styling migration slice.
- Screenshot key pages before and after page-level migrations.
- Keep service, route, guard, model, and API files out of styling-only commits.

