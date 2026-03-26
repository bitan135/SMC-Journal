# SOP: Landing Page

## 1. Purpose
Documents the public marketing landing page for SMC Journal, its conversion funnel, SEO strategy, and content structure.

## 2. Owner
- `src/app/page.js` — Main landing page (16.5KB)
- `src/app/layout.js` — Root layout with global metadata, Open Graph, structured data

## 3. Page Structure

### Above the Fold (Hero)
- **Headline:** SMC trading journal value proposition
- **Sub-headline:** Target audience (retail traders using Smart Money Concepts)
- **CTA Button:** "Start Free" → `/signup`
- **Trust indicators:** Numbers strip (trades logged, active traders, etc.)

### Feature Sections
1. **Trade Logger** — Journal every trade with SMC tags (BOS, CHoCH, FVG, etc.)
2. **Analytics Engine** — Advanced win rate, drawdown, and session analysis
3. **Insight Engine** — AI-powered pattern recognition
4. **Strategy Manager** — Track and compare strategies

### Social Proof
- Testimonials (if available)
- Trust badges

### Pricing Overview
- Links to `/pricing` for full comparison

### Footer
- Links to `/privacy`, `/terms`, `/features`, `/affiliate`
- SEO footer text

## 4. Conversion Funnel
```
Landing (/) → Sign Up (/signup) → Dashboard (/dashboard) → Upgrade (/billing)
                   ↑
            Pricing (/pricing)
```

### CTA Hierarchy
1. Primary: "Start Free" → `/signup`
2. Secondary: "View Pricing" → `/pricing`
3. Tertiary: Navigation links

## 5. SEO Strategy

### Meta Tags (layout.js)
- `title`: "SMC Journal — Smart Money Concept Trading Journal"
- `description`: Targeted for "smc trading journal" keyword
- Open Graph + Twitter cards configured
- `robots.js`: Allows all crawlers
- `sitemap.js`: Auto-generates sitemap for all public routes

### SEO Landing Pages
Dedicated pages targeting high-value search queries:
- `/forex-trading-journal` — "forex trading journal"
- `/smc-trading-journal` — "smc trading journal"
- `/trading-journal` — "trading journal"

### Structured Data
- JSON-LD `SoftwareApplication` schema in `layout.js`
- Includes: name, description, application category, operating system, price

## 6. Design System
- **Theme:** 2026 Fintech Light Theme
- **Background:** White (#FFFFFF) / Slate-50
- **Typography:** Slate-900, font-black headings
- **Accents:** Indigo-600 for CTAs,  gradients for visual hierarchy
- **Border radius:** 40px outer, 28px inner
- **Animations:** Subtle hover effects, gradient pulses

## 7. Performance
- Static page (prerendered at build time — marked `○`)
- No JavaScript required for initial render
- Lazy-loaded analytics (PostHog)

## 8. Version
Last Updated: 2026-03-26
