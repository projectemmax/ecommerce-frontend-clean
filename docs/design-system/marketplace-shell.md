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

## 2. Shared Navigation Component Ownership

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

## 3. Storefront Shell Behavior

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

## 4. Workspace Shell Behavior

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

## 5. Responsive Rules

| Viewport | Storefront | Workspace |
|---|---|---|
| Mobile | Compact header, drawer menu, bottom nav, search in header flow | Topbar menu button, slide-in sidebar, stacked content |
| Tablet | Header search visible, bottom nav hidden at tablet width | Drawer sidebar remains available until laptop width |
| Laptop | Category nav visible, full header composition | Persistent sidebar starts at laptop width |
| Desktop | Wide constrained header/category/footer content | Wide content area with stable sidebar/topbar |

Search, cart, and account remain reachable without scrolling on small screens.

## 6. Migration Notes

- Existing routed pages render inside the new shells with minimal composition changes.
- The old storefront navbar/footer components remain in the repository for now but are no longer used by `StorefrontLayoutComponent`.
- The old admin navbar/sidebar/footer components remain in the repository for now but are no longer used by `AdminLayoutComponent`.
- Legacy full admin theme CSS is no longer injected by the workspace shell. Temporary icon font CSS remains loaded for old page content that still references `mdi` and `fa` classes.
- Storefront medical theme CSS is no longer injected. Bootstrap remains globally available and token-bridged through the Phase 2 foundation.

## 7. Next Migration Steps

1. Build shared buttons, badges, cards, tables, and form controls on top of the token foundation.
2. Migrate storefront header-specific page spacing assumptions out of legacy global CSS.
3. Replace old storefront navbar/footer files after no references remain.
4. Replace old admin layout files after workspace pages are visually migrated.
5. Remove temporary icon font CSS when the single icon library migration is complete.
