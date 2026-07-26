# SariHub Marketplace Shell Implementation

Phase 3 establishes the reusable shell infrastructure for storefront pages and workspace pages. It does not redesign feature pages such as Home, Shop, Product Detail, Cart, Checkout, Products, or Orders.

## 1. Updated Layout Architecture

```txt
AppComponent
└── RouterOutlet
    ├── /storefront
    │   └── StorefrontLayoutComponent
    │       ├── sh-marketplace-header
    │       │   ├── Announcement bar
    │       │   ├── sh-app-logo
    │       │   ├── sh-nav-search
    │       │   ├── Category navigation
    │       │   ├── Seller CTA
    │       │   ├── Cart indicator
    │       │   ├── Account menu
    │       │   └── Mobile menu
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
| `sh-marketplace-header` | `shared/patterns` | Pattern | Route-aware storefront composition using logo, search, category nav, cart, and account menu. |
| `sh-marketplace-mobile-nav` | `shared/patterns` | Pattern | Storefront mobile persistent navigation. |
| `sh-marketplace-footer` | `shared/patterns` | Pattern | Storefront footer composed from site config and default marketplace sections. |
| `sh-workspace-topbar` | `shared/patterns` | Pattern | Role-aware workspace top navigation. |
| `sh-workspace-sidebar` | `shared/patterns` | Pattern | Role-aware seller/admin workspace navigation. |
| `sh-workspace-breadcrumbs` | `shared/patterns` | Pattern | URL-derived workspace breadcrumb trail. |
| `sh-workspace-footer` | `shared/patterns` | Pattern | Workspace footer. |

## 3. Storefront Shell Behavior

```txt
Desktop
├── Announcement bar
├── Header: logo, global search, primary links, seller CTA, cart, account
├── Category navigation rail
└── Routed page content

Mobile
├── Announcement bar
├── Compact header: menu, logo, cart, account
├── Mobile drawer menu
├── Routed page content
└── Bottom nav: Home, Shop, Cart, Account
```

The global search routes to `/storefront/shop` with the existing `search` query parameter. The category rail routes to `/storefront/shop` with the existing `categoryId` query parameter. Cart count continues to come from `StorefrontCartService.cartCount$`.

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

