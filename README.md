# FoodAmigos site template

The base every FoodAmigos Website Studio website starts from. Max (the Website Studio agent) creates each website's
v0 chat from this repository (`POST /chats/from-repo`), writes the restaurant's values into `lib/site-defaults.ts`,
and v0 then designs the restaurant's own pages. Everything every site must have is already here, so v0 never builds
it again. **None of it is styled**: plain semantic HTML with `data-slot` hooks, an empty theme and no UI components,
so the template has no influence on how v0 designs the site.

| What | Where |
|---|---|
| Legal pages from the site API, per language: Impressum, privacy policy, cookie policy | `app/impressum`, `app/datenschutzerklaerung` · `app/privacy-policy`, `app/cookie-richtlinie` · `app/cookie-policy`, `components/legal` |
| Cookie banner and consent (analytics, embedded media and restaurant scripts only after Accept) | `components/consent`, `lib/consent.ts` |
| Umami analytics after consent | `components/consent/analytics.tsx` |
| The coupons page for search engines (`/angebote` · `/coupons`): h1, FAQ, FAQ JSON-LD; in the sitemap, not in the navigation | `app/angebote`, `app/coupons`, `components/seo`, `lib/seo-pages.ts` |
| Menu page with prices and Menu JSON-LD (`/speisekarte` · `/our-menu`; `/menu` is the shop's) | `app/our-menu`, `lib/format.ts` |
| Locations and opening hours with today's status, route link and map after consent (`/standort-und-oeffnungszeiten` · `/location-and-hours`) | `app/location-and-hours`, `lib/hours.ts`, `components/locations/location-map.tsx` |
| Table reservations: the reservation service's widget (`/reservierungen` · `/reservations`), when the module is on | `app/reservations`, `components/reservations` |
| Gift cards: purchase into the shop's checkout and balance check, as Server Actions (`/gutscheine` · `/gift-cards`), when the module is on | `app/gift-cards`, `hooks/use-gift-card-*`, `lib/gift-cards.ts` |
| The online shop under `/menu` (when the module is on) | `proxy.ts`, `lib/menu-route.ts` |
| Paths in the site's language: the pages above live in English folders and show under the language's path | `lib/localized-routes.ts`, `proxy.ts` |
| The site API client | `lib/studio-api.ts`, `lib/config.ts` |
| SEO base: metadata (each page's tags from `GET /page-meta`, kept by Max and the manager in Website Studio's SEO tab; the page's own as fallback), sitemap, robots, Restaurant JSON-LD, 404 | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `components/site/restaurant-json-ld.tsx`, `app/not-found.tsx` |

## For v0: keep, design, add

The rules for each module (when it is on, what it shows, how it is set up) are Max's (the agent's module skills);
this template holds their current working implementation. Logic lives in `lib/` and `hooks/`, the pages are
unstyled default markup: replace any page's markup freely, keep its data, hooks and actions.

- **Keep** the files above working: restyle them freely, never remove a legal page, the banner, its two equally
  prominent buttons, the footer's `<LegalLinks />`, the consent gate around embeds, or `proxy.ts`.
- **Design** the header, footer, home page and the site's own pages like the inspiration.
- **Name every new page's path in the site's language** (SEO): on a German site `app/kontakt`, `app/ueber-uns`,
  never `app/contact`. Add it to `lib/site-pages.ts` (the sitemap).
- The legal pages stay `noindex` and out of the sitemap; the coupons page stays out of the navigation.
- **SEO optimization**: rewrite the coupons page's texts in `lib/seo-pages.ts` only to rank better (the restaurant's
  name, cuisine, city, dietary options), keeping its structure. Wrap videos, iframes and third-party widgets in
  `<ConsentGate category="embedded_media">`.
- Restaurant data always comes from `lib/studio-api.ts`; never hard-code it. Every page's `generateMetadata` goes
  through `pageMetadata()` (lib/seo.ts), so Website Studio's tags for its path apply.

## Settings

Env vars (set by Studio on the Vercel project) win over `lib/site-defaults.ts` (written by Studio for the v0 preview):
`NEXT_PUBLIC_STUDIO_API_URL`, `NEXT_PUBLIC_PROJECT_UUID`, `NEXT_PUBLIC_SITE_LANGUAGE`, `NEXT_PUBLIC_SITE_MODULES`
(e.g. `online_shop,reservations`), `ONLINE_SHOP_EMBED_ORIGIN`, `ONLINE_SHOP_EMBED_DOMAIN`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`.

## Develop

```bash
pnpm install
pnpm test        # unit tests (consent, inline markup, paths, /menu, hours, gift cards)
pnpm typecheck
NEXT_PUBLIC_STUDIO_API_URL=http://localhost:8095 NEXT_PUBLIC_PROJECT_UUID=<project uuid> pnpm dev
```

The legal texts themselves live in the Website Studio backend (`resources/legal`, `GET /api/projects/{uuid}/legal`).
