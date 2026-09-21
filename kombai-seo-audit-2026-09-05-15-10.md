# SEO audit

- URL: `http://localhost:4173/#profile`
- Result: 0.83 overall audit score

Passed:

- Meta description exists
- HTTP status 200
- Descriptive link text for 28 links
- Page is crawlable for generic and major bot user agents
- Text-size audit passed

Notes:

- The audit reports three hidden responsive mobile anchor duplicates at desktop width (`#profile`, `#work`, `#notes`). They are intentionally hidden because the desktop fixed rail is the visible navigation; the mobile strip is revealed below 760px.
- The font-size heuristic reports contrast warnings while the browser is persisted in dark mode. The final axe accessibility audit reports 0 violations after the theme/rail/footer contrast fixes.
