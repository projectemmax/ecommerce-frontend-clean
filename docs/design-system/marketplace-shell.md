# SariHub Marketplace Shell Implementation

Phase 3 establishes the reusable shell infrastructure for storefront pages and workspace pages. It does not redesign feature pages such as Home, Shop, Product Detail, Cart, Checkout, Products, or Orders.

## 1. Updated Layout Architecture

```txt
AppComponent
└── RouterOutlet
    ├── /storefront
    │   └── StorefrontLayoutComponent
    │       ├── Sticky shell navigation wrapper
    │       ├── sh-marketplace-header
    │       │   ├── Announcement bar
    │       │   ├── sh-app-logo
    │       │   ├── sh-nav-search
    │       │   ├── Seller CTA
    │       │   ├── Cart indicator
    │       │   ├── Account menu
    │       │   └── Mobile menu
    │       ├── sh-marketplace-category-nav
    │       ├── RouterOutlet
    │       ├── sh-marketplace-footer
    │       └── sh-marketplace-mobile-nav
    └── /admin
        └── AdminLayoutComponent
            ├── sh-workspace-sidebar
            ├── sh-workspace-topbar
            ├── sh-workspace-breadcrumbs
            ├── RouterOutlet
            └── sh-workspace-footer
```

The route tree remains unchanged. Existing lazy-loaded pages, guards, services, models, and API contracts are preserved.

## 2. Shared UI Foundation

The Marketplace Shell is built on a layered Shared UI architecture. Rather than composing shell patterns directly from Bootstrap components, the application uses reusable UI primitives built on top of the Design System foundation.

```txt
Design Tokens
│
├── Colors
├── Typography
├── Spacing
├── Radius
├── Shadows
└── CSS Utilities
        │
        ▼
Shared UI Primitives (presentation components)
│
├── ui-button
├── ui-icon
├── ui-badge
├── ui-alert
├── ui-spinner
├── ui-divider
├── ui-card
├── ui-avatar
├── ui-table
├── ui-tabs (+ ui-tab, ui-tab-panel)
├── ui-dialog
└── ui-menu (+ ui-menu-item)
        │
        ▼
Shared Form Foundation
│
└── ui-field
        │
        ▼
Shared Form Controls
│
├── ui-input
├── ui-select
├── ui-textarea
├── ui-checkbox
├── ui-switch
└── ui-radio
        │
        ▼
Shell Patterns
│
├── sh-marketplace-header
├── sh-marketplace-footer
├── sh-marketplace-category-nav
├── sh-workspace-sidebar
├── sh-workspace-topbar
└── sh-workspace-breadcrumbs
```

The Shared UI Library provides the reusable presentation layer used throughout the Storefront, Seller Workspace, and Admin Workspace. Components are intentionally small, composable, and built on top of the Design System rather than Bootstrap component abstractions.

### Design Tokens

The Design System provides the visual foundation for every Shared UI component.

Responsibilities:

- Color palette
- Typography scale
- Spacing scale
- Border radius
- Shadows
- Layout utilities
- Theme support

Design Tokens are the single source of truth for visual styling. Components consume tokens instead of hardcoded values or Bootstrap utility classes wherever possible.

---

### ui-button

`ui-button` provides the shared button primitive.

Responsibilities:

- Semantic button variants
- Shared sizing
- Design Token integration
- Accessibility
- Signal Inputs
- OnPush rendering

The component replaces duplicated button implementations across Storefront, Seller, and Admin interfaces.

---

### ui-icon

`ui-icon` provides the shared icon abstraction.

Responsibilities:

- Semantic icon names
- Shared icon registry
- Consistent sizing
- Accessibility
- Replaceable icon provider

Application code references semantic names such as:

- cart
- user
- search
- home
- settings

rather than vendor-specific icon names, allowing the icon library to be replaced without affecting consumers.

---

### ui-badge

`ui-badge` provides a lightweight presentation component for status and informational indicators.

Responsibilities:

- Semantic status variants
- Design Token-based styling
- Typography
- Spacing
- Content projection

Supported semantic variants:

- primary
- secondary
- success
- warning
- danger
- info

`ui-badge` is intentionally presentation-only.

It does not own:

- business logic
- positioning
- interaction
- counters
- pill styling
- size variants

Icons compose naturally through content projection without introducing a dedicated icon API.

---

### ui-field

`ui-field` is the presentation foundation for all form controls.

Responsibilities:

- Label rendering
- Required indicator
- Helper text
- Validation message
- Layout
- Typography
- Design Token integration
- Semantic label association via `controlId`

`ui-field` intentionally has no knowledge of Angular Forms.

It does not own:

- ControlValueAccessor
- NgControl
- FormControl
- Validation rules
- Form state
- Business logic
- ID generation

Instead, it acts as a reusable presentation wrapper for form controls.

Example composition:

```txt
ui-field
│
├── Label
├── Required Indicator
├── Projected Control
├── Helper Text
└── Error Message
```

---

### Shared Form Controls

All form controls compose `ui-field` instead of duplicating presentation concerns.

Current controls include:

- `ui-input`
- `ui-select`
- `ui-textarea`
- `ui-checkbox`
- `ui-switch`
- `ui-radio`

Each control follows the same architectural principles:

- Native HTML controls first
- Composition over inheritance
- ControlValueAccessor for Angular Forms integration
- Parent-owned validation
- Signal Inputs
- OnPush Change Detection

Boolean controls (`ui-checkbox`, `ui-switch`, and `ui-radio`) own their native control and inline label while composing `ui-field` only for helper text, validation, spacing, and accessibility.

Text controls (`ui-input`, `ui-select`, and `ui-textarea`) compose `ui-field` to provide consistent form presentation across the application.

---

### ui-alert

`ui-alert` provides a reusable presentation component for contextual feedback and status messages.

Responsibilities:

- Semantic alert variants
- Design Token-based styling
- Content projection
- Flexbox layout
- Accessibility-friendly composition

Supported semantic variants:

- success
- warning
- danger
- info

`ui-alert` intentionally remains presentation-only.

It does not own:

- dismiss behavior
- toast behavior
- timers
- icons
- ARIA roles
- business logic

Consumers own icon composition, accessibility semantics, and interaction behavior.

---

### ui-spinner

`ui-spinner` provides the shared loading indicator primitive.

Responsibilities:

- Indeterminate loading visualization
- Continuous animation
- Shared sizing
- Decorative accessibility

Supported sizes:

- sm
- md

`ui-spinner` intentionally has a minimal public API.

It owns:

- Rendering
- Animation
- Size

It does not own:

- Loading state
- Loading messages
- Overlay behavior
- Positioning
- Async logic
- Route loading
- Button loading
- Status announcements

Spinner color is inherited through `currentColor`, allowing consumers to control appearance using normal CSS inheritance.

---

### ui-divider

`ui-divider` provides a semantic horizontal separator for grouping related content.

Responsibilities:

- Section separation
- Semantic `<hr>` rendering
- Design Token-based border styling

The component intentionally preserves native separator semantics by default while supporting decorative usage when appropriate.

`ui-divider` intentionally does not provide:

- Vertical orientation
- Insets
- Thickness variants
- Labels
- Content projection
- Layout spacing

Spacing remains entirely consumer-owned through normal CSS classes and layout utilities.

---

### ui-card

`ui-card` provides a reusable surface container for grouping related content.

Responsibilities:

- Surface container rendering
- Design Token-based surface, border, radius, and shadow styling
- Content projection
- Semantic variant styling

Supported semantic variants:

- outlined
- elevated

`ui-card` is intentionally host-styled so that consumer layout classes (padding, margins, spacing) land directly on the card element itself.

It does not own:

- Header, body, or footer slots
- Titles
- Actions
- Click behavior
- Selection
- Loading states
- Positioning

Headers, bodies, footers, titles, and actions are composed by the consumer through content projection.

---

### ui-avatar

`ui-avatar` provides a circular presentation component for user, seller, and customer identity images.

Responsibilities:

- Image rendering via `src`
- Consumer-provided fallback through content projection (initials or icon)
- Shared sizing
- Circular presentation
- Design Token-based styling

Supported sizes:

- sm
- md
- lg

`ui-avatar` intentionally does not compute initials or fallbacks from application data.

It does not own:

- Initials generation
- Icon fallback selection
- Status indicators or overlays
- Image error handling
- Upload or edit behavior
- Business logic

Consumers provide the fallback content (such as name initials or a user icon) through content projection and own all overlay and upload behavior.

---

### ui-table

`ui-table` provides a responsive, presentation-only wrapper around a native HTML table.

Responsibilities:

- Native `<table>` rendering inside a responsive wrapper
- Base cell styling (padding, borders, alignment)
- Hover row styling
- Optional striped variant
- Design Token-based styling

Supported variants:

- default
- striped

`ui-table` is the single shared presentation layer for application tables.

It does not own:

- Sorting
- Filtering
- Searching
- Pagination
- Selection
- Loading or empty-state presentation
- Tree or expand/collapse behavior
- Business logic

The consumer composes the full table structure (`thead`, `tbody`, rows, and cells) through content projection, including badges, actions, and checkboxes inside cells.

---

### ui-tabs

`ui-tabs` is a three-primitive implementation of the WAI-ARIA Tabs pattern for switching between content panels.

Composition:

- `ui-tabs` — the coordinator (tab list, panel region, state channel, keyboard behavior, ARIA wiring)
- `ui-tab` — a trigger that projects its label content
- `ui-tab-panel` — a panel that projects its body content

The active tab is fully controlled by the consumer through a single two-way state channel. The component never owns selection; it reflects the consumer's value and reports selection intent.

`ui-tabs` owns:

- WAI-ARIA roles and states (`tablist`, `tab`, `tabpanel`, `aria-selected`, `aria-controls`, `aria-labelledby`)
- Roving `tabindex`
- Keyboard navigation (Arrow keys, Home, End) with auto-activation
- Panel visibility (inactive panels hidden)
- Internally generated IDs
- Underline indicator styling

It does not own:

- Selection state (consumer-owned)
- Routing or URL-driven tab state
- Lazy rendering
- Icon or badge APIs (labels are composed through content projection)
- Variants, vertical orientation, closeable, or draggable behavior

Panels are required — each tab must control a corresponding panel for valid ARIA relationships. Panel-less filter selectors are a segmented-control pattern outside the scope of `ui-tabs`.

---

### ui-dialog

`ui-dialog` is a single-primitive implementation of the WAI-ARIA Dialog pattern for modal overlays.

The open state is fully controlled by the consumer through a two-way state channel. Pressing Escape, clicking the backdrop (when enabled), or clicking the built-in close button emits a **close request** — the consumer decides whether to accept it. The component never closes itself.

Supported sizes:

- sm
- md
- lg

with an optional `maxWidth` override for large, page-specific dialogs.

`ui-dialog` owns (intrinsic dialog behavior):

- Overlay and backdrop rendering
- Escape detection
- Outside-click detection (opt-in via `closeOnBackdrop`)
- Focus trap, initial focus, and focus restoration
- Body scroll locking
- Stacking / z-index
- Panel scroll container
- ARIA semantics (`role="dialog"`, `aria-modal`, `aria-labelledby` wiring)
- Built-in close button (top-right, hidden via `showClose`)

It does not own:

- Open/close state (consumer-owned)
- Whether a close request is accepted (unsaved changes, confirmation logic)
- Dialog content (title, body, footer, actions — all projected)
- Forms, validation, API requests
- Save / cancel / delete actions and their effects
- Routing, analytics

The dialog uses inline overlay rendering rather than a portal; it must be rendered outside transformed or overflow-clipping ancestors.

---

### ui-menu

`ui-menu` is a two-primitive implementation of the WAI-ARIA Menu pattern for action and navigation popup menus.

Composition:

- `ui-menu` — the coordinator (menu surface, keyboard behavior, focus management, close requests)
- `ui-menu-item` — an item that projects its label/icon content and participates in menu coordination

The open state is fully controlled by the consumer. Pressing Escape, clicking outside, or activating an item emits a **close request** — the consumer decides whether to accept it. The component never closes itself.

`ui-menu-item` supports:

- `disabled` (skipped by keyboard navigation, sets `aria-disabled`)
- `destructive` (destructive styling)

`ui-menu` owns (intrinsic menu behavior):

- Menu surface rendering (`role="menu"`)
- Keyboard navigation (Arrow keys, Home, End) across enabled items
- Focus management (open → first enabled item; close → restore to the previously focused element)
- Escape detection → close request
- Outside-click detection → close request
- Item activation → close request
- ARIA semantics (`role="menuitem"`, roving `tabindex`, `aria-disabled`) via `ui-menu-item`

It does not own:

- Open/close state (consumer-owned)
- The trigger element and its `aria-haspopup`/`aria-expanded` (consumer-owned, derived from the consumer's open state)
- Menu placement/positioning (consumer-coordinated within their relative wrapper)
- Item actions, routing, navigation
- Permissions, analytics, API requests
- Whether a close request is accepted

The trigger is consumer content, so its ARIA remains consumer-owned. Placement is coordinated by the consumer, and non-item content (such as a `ui-divider` separator) can be projected between items.

---

### Shared UI Design Principles

The Shared UI Library follows these architectural principles:

- Composition over inheritance
- Presentation separated from behavior
- Native HTML controls first
- Parent-owned validation
- Semantic component APIs
- Accessibility by default
- Design Tokens as the single source of truth
- Angular Standalone Components
- Signal Inputs
- OnPush Change Detection
- Reusable UI primitives before feature composition

Shell patterns consume these primitives to provide a consistent user experience across the Storefront, Seller Workspace, and Admin Workspace while remaining independent of Bootstrap component implementations.

## 3. Shared Navigation Component Ownership

| Component | Location | Ownership | Reason |
|---|---|---|---|
| `sh-app-logo` | `shared/ui` | UI primitive | Brand mark used by storefront and workspace shells. |
| `sh-nav-search` | `shared/ui` | UI primitive | Generic search form with tokenized styling and submit output. |
| `sh-sidebar-item` | `shared/ui` | UI primitive | Reusable navigational row for shell sidebars. |
| `sh-marketplace-header` | `shared/patterns` | Pattern | Route-aware storefront composition using logo, search, seller CTA, cart, and account menu. |
| `sh-marketplace-category-nav` | `shared/patterns` | Pattern | Storefront category rail using existing category service and shop query parameters. |
| `sh-marketplace-mobile-nav` | `shared/patterns` | Pattern | Storefront mobile persistent navigation. |
| `sh-marketplace-footer` | `shared/patterns` | Pattern | Storefront footer composed from existing site config, static marketplace sections, and design-system layout primitives. |
| `sh-workspace-topbar` | `shared/patterns` | Pattern | Role-aware workspace top navigation. |
| `sh-workspace-sidebar` | `shared/patterns` | Pattern | Role-aware seller/admin workspace navigation. |
| `sh-workspace-breadcrumbs` | `shared/patterns` | Pattern | URL-derived workspace breadcrumb trail. |
| `sh-workspace-footer` | `shared/patterns` | Pattern | Workspace footer. |

## 4. Storefront Shell Behavior

```txt
Desktop
├── Announcement bar
├── Header: logo, global search, primary links, seller CTA, cart, account
├── Category navigation rail as a separate shell pattern
└── Routed page content

Mobile
├── Announcement bar
├── Compact header: menu, logo, cart, account
├── Mobile drawer menu
├── Routed page content
└── Bottom nav: Home, Shop, Cart, Account
```

The global search routes to `/storefront/shop` with the existing `search` query parameter. The category rail is intentionally separated from the header and routes to `/storefront/shop` with the existing `categoryId` query parameter. Cart count continues to come from `StorefrontCartService.cartCount$`.

Layout primitives are implemented as CSS utilities from the design system foundation, including `sh-container`, `sh-container--wide`, `sh-page`, `sh-section`, `sh-stack`, and `sh-cluster`. The shell components use these primitives directly instead of Bootstrap containers. Angular wrapper components are not introduced in Phase 3 because the current shell needs stable layout constraints, not additional component lifecycle or API surface.

Footer content is mapped into a small view model inside `sh-marketplace-footer` before rendering. The template remains presentational and renders:

- Brand/about content from `siteName`, `logoUrl`, and existing `footer.about*` config.
- Company links from existing `footer.shopLinks` when configured, otherwise safe storefront defaults.
- Customer Service links from existing `footer.accountLinks` when configured, otherwise safe account defaults.
- Sellers and Legal sections as static marketplace shell sections.
- Contact and payment content from existing `footer.contact` and `footer.payments` when configured.
- Social links only when `footer.socialLinks` is provided, avoiding placeholder external URLs.

## 5. Workspace Shell Behavior

```txt
Desktop
├── Persistent sidebar
├── Sticky topbar
├── Breadcrumbs
├── Content container
└── Footer

Mobile / Tablet
├── Sticky topbar with menu toggle
├── Slide-in sidebar
├── Backdrop
├── Breadcrumbs
├── Content container
└── Footer
```

The workspace keeps the existing `/admin` route host for both sellers and admins. Role-aware navigation mirrors existing guards:

- Sellers: Dashboard, Products, Orders, Reviews.
- Admins: Dashboard, Products, Orders, Reviews, Brands, Categories, Customers, Carts, Profile, Site Config.

`sh-workspace-sidebar` is a shell navigation pattern composed from `sh-sidebar-item`. It filters a static navigation model by the current `AuthService.getRole()` result, but it does not authorize routes or change guard behavior. The existing router and guards remain the source of access control. On mobile and tablet it behaves as a drawer controlled by `AdminLayoutComponent`; at the laptop breakpoint it becomes the persistent workspace sidebar.

`sh-workspace-topbar` is a shell control bar. It renders the mobile sidebar toggle, current page title, notification placeholder, and user menu. The current page title is derived from the active `/admin` URL for display only and does not replace `sh-workspace-breadcrumbs`. It consumes existing authentication/profile/site-name services for display context, emits logout and menu events to `AdminLayoutComponent`, and performs no authorization.

`sh-workspace-breadcrumbs` is a presentation-only route trail derived from the active Angular Router URL. It supports nested workspace routes by parsing primary outlet segments after `/admin`, mapping known route segments to readable labels, and rendering only known section roots as links. Intermediate action or dynamic segments such as `edit` and IDs are text-only so the component does not create invalid routes or duplicate navigation logic.

## 6. Responsive Rules

| Viewport | Storefront | Workspace |
|---|---|---|
| Mobile | Compact header, drawer menu, bottom nav, search in header flow | Topbar menu button, slide-in sidebar, stacked content |
| Tablet | Header search visible, bottom nav hidden at tablet width | Drawer sidebar remains available until laptop width |
| Laptop | Category nav visible, full header composition | Persistent sidebar starts at laptop width |
| Desktop | Wide constrained header/category/footer content | Wide content area with stable sidebar/topbar |

Search, cart, and account remain reachable without scrolling on small screens.

## 7. Migration Notes

- Existing routed pages render inside the new shells with minimal composition changes.
- The old storefront navbar/footer components remain in the repository for now but are no longer used by `StorefrontLayoutComponent`.
- The old admin navbar/sidebar/footer components remain in the repository for now but are no longer used by `AdminLayoutComponent`.
- Legacy full admin theme CSS is no longer injected by the workspace shell. Temporary icon font CSS remains loaded for old page content that still references `mdi` and `fa` classes.
- Storefront medical theme CSS is no longer injected. Bootstrap remains globally available and token-bridged through the Phase 2 foundation.

## 8. Next Migration Steps

Completed Shared UI Library

- ✅ Design Tokens
- ✅ CSS Utility Primitives
- ✅ ui-button
- ✅ ui-icon
- ✅ ui-badge
- ✅ ui-alert
- ✅ ui-spinner
- ✅ ui-divider
- ✅ ui-card
- ✅ ui-avatar
- ✅ ui-table
- ✅ ui-tabs (+ ui-tab, ui-tab-panel)
- ✅ ui-dialog
- ✅ ui-menu (+ ui-menu-item)
- ✅ ui-field
- ✅ ui-input
- ✅ ui-select
- ✅ ui-textarea
- ✅ ui-checkbox
- ✅ ui-switch
- ✅ ui-radio

Remaining Application Migration

1. Migrate storefront page spacing assumptions out of legacy global CSS.
2. Replace the old storefront navbar/footer files after no references remain.
3. Replace the old admin navbar/sidebar/footer files after workspace pages are visually migrated.
4. Migrate admin feature pages (orders, customers, brands, categories, reviews, sales, carts) to consume `ui-table`, `ui-badge`, and `ui-button`.
5. Migrate storefront checkout, order summary, and account surfaces to consume `ui-card`, `ui-divider`, and `ui-tabs`.
6. Replace legacy `mdi`/`fa` icon usage with `ui-icon` semantic names and remove temporary icon font CSS.
7. Remove the temporary Shared UI playground once component verification is complete.
