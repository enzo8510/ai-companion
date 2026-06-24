---
name: optimize-ui
description: Optimize the AI companion website interface design, layout, and typography for better visual comfort and intuition
---

# Optimize UI / Layout / Typography

This skill drives the **AI Companion Chat Website** — a single-page HTML application featuring a chat interface with dark theme, color themes, avatar system, and various feature panels (memory, journal, calendar, social, achievements).

The app is entirely self-contained in `index.html` (3500+ lines of HTML + CSS + JS). It uses `localStorage` to persist all data and is designed to run in any modern browser at ~460px max-width (phone-frame simulation).

## Prerequisites

- **Browser**: Chrome/Edge/Firefox (modern version)
- **HTTP server** (to avoid CORS issues): Python 3 or Node.js
- **Screenshot capture**: Node.js + Puppeteer, or manual browser screenshots
- **Text editor**: For CSS/HTML modifications

## Build & Setup

1. **Install dependencies** (optional, for automated testing):
   ```bash
   npm install -D puppeteer  # or use Python's http.server
   ```

2. **Start a local HTTP server**:
   ```bash
   # Python 3
   cd "C:\Users\user\Desktop\AI伴侶_網站"
   python -m http.server 8000

   # OR Node.js
   npx serve . -p 8000
   ```

3. **Open in browser**: http://localhost:8000/index.html

## Run (Agent Path)

Use the `driver.mjs` script to launch the server, capture screenshots, and validate responsive design:

```bash
node ./.claude/skills/optimize-ui/driver.mjs
```

This will:
- Start an HTTP server on port 8000
- Capture screenshots of the home page at multiple viewport sizes (mobile 460px, tablet 720px, desktop 1024px)
- Save screenshots to `.claude/skills/optimize-ui/screenshots/`
- Log findings about spacing, contrast, typography alignment
- Exit cleanly

The driver accepts commands:
- `screenshot <view>` — capture the specified view (homeView, chatView, adminView, etc.)
- `viewport <width>x<height>` — change viewport size and take screenshot
- `theme <name>` — switch theme (default, dark, pink, brown, green) and screenshot
- `validate` — check for common UI issues (contrast, button sizes, spacing)
- `quit` — close server and exit

## Run (Human Path)

For manual testing during development:

```bash
# 1. Start server in terminal 1
cd "C:\Users\user\Desktop\AI伴侶_網站"
python -m http.server 8000

# 2. Open in browser
# http://localhost:8000/index.html

# 3. Test each section:
# - Home screen (main view)
# - Chat interface (click "進入聊天")
# - Admin panels (click ⚙️ icon, then tabs: 角色 頻道 記憶 日記 日程 社交 成就)
# - Responsive layout (resize browser to test mobile/tablet/desktop)
# - Color themes (admin panel > 主題)
# - Light/dark mode toggle

# 4. Check in DevTools:
# - CSS custom properties (--bg, --companion, etc.) in :root
# - Font sizes and line-heights across components
# - Spacing (padding/margin) consistency
# - Color contrast ratios (should be 4.5:1 for text)
```

## Current State (Baseline)

The application currently features:
- **6 color themes**: default (blue), dark, pink, brown, green — defined in :root CSS variables
- **Phone frame design**: fixed 460px max-width with bezeled border and shadow
- **Dark/light text**: using CSS custom properties for color system
- **Responsive panels**: chat, admin tabs (角色, 頻道, 記憶, 日記, 日程, 社交, 成就), settings
- **Grid layouts**: for buttons, cards, theme rows
- **Custom scrollbars**: styled webkit scrollbars

## Key Files to Modify

- **index.html:1–100** — `:root` CSS variables (colors, spacing, shadows)
- **index.html:150–600** — Component styles (header, chat thread, composer, buttons, cards)
- **index.html:700–850** — Responsive grid layouts
- **index.html:1800–2500** — JavaScript that manipulates DOM (view switching, theme changes)

## Optimization Checklist

- [ ] **Spacing consistency**: Review `padding`, `margin`, `gap` across all components; establish a scale (e.g., 4px, 8px, 12px, 16px, 24px)
- [ ] **Typography harmony**: Check `font-size`, `line-height`, `letter-spacing` for visual rhythm; unify heading styles
- [ ] **Color contrast**: Use a contrast checker on all text + background pairs; ensure WCAG AA (4.5:1 for body text)
- [ ] **Button/touchable sizes**: Verify minimum 44px × 44px for touch targets (icon buttons, links)
- [ ] **White space**: Review padding inside cards/panels; ensure breathing room around text
- [ ] **Font weight hierarchy**: Establish clear distinction between body (400), semi-bold (500), bold (700)
- [ ] **Responsive breakpoints**: Test at 460px (mobile), 720px (tablet), 1024px (desktop)
- [ ] **Visual hierarchy**: Ensure primary actions stand out (use color, size, weight); secondary/tertiary actions recede
- [ ] **Micro-interactions**: Smooth transitions on hover/focus; no jarring jumps
- [ ] **Dark theme readability**: Ensure sufficient contrast on dark backgrounds; test all 6 themes

## Gotchas

1. **CSS custom properties are theme-aware**: Changing a theme in the admin panel updates `:root[data-theme="..."]` and all `var(--*)` values inherit immediately. Test all 6 themes before committing changes.

2. **Fixed 460px width**: The `.phone-frame` is intentionally capped at 460px. Responsive design is tested via media queries inside that container, not by making the frame itself fluid. The `.app-bg` centers it.

3. **Scrollbar styling**: The app uses webkit-specific scrollbar CSS (`::-webkit-scrollbar`, `::-webkit-scrollbar-thumb`). These don't work in Firefox; falls back to default. Document this in the skill if optimizing scrollbar appearance.

4. **localStorage persists state**: Changing themes, avatar images, text in panels — all saved to `localStorage` under keys like `companionData`, `userTheme`, etc. If testing CSS changes, clear `localStorage` in DevTools to avoid stale data interfering with visual tests.

5. **Animation keyframes** (`rise`, `pulse-dot`, `typing-bounce`, etc.): These are inline in the CSS. Smooth animations help with perceived performance; jerky transitions indicate a rendering issue or jank.

6. **Grid template columns**: Multiple grids use `repeat(N, 1fr)` (e.g., 3-column for home actions, 4-column for star food). If modifying these, test that cards don't overflow or become too cramped on mobile.

7. **Bubble transparency with background images**: The CSS rule `#thread.has-chatbg .bubble.her` uses `backdrop-filter: blur()`. This only works in Chrome/Edge/Safari; Firefox doesn't support it. No visual error, just degrades to solid background.

## Troubleshooting

| Issue | Fix |
|---|---|
| **Colors look different after theme change** | Clear `localStorage` in DevTools (Application tab > Storage > Local Storage > Clear All). The theme preference persists and may override your CSS changes. |
| **Fonts rendering too small/large** | Check that you didn't accidentally change `font-size` at the `:root` level or on `body`. Use relative units (`em`, `rem`) when possible. |
| **Buttons misaligned or overlapping** | Verify `flex-wrap` isn't toggling unexpectedly. Check `gap` values in flex containers; inconsistent gaps break alignment. |
| **Scrollbar not visible** | The scrollbar is hidden by `scrollbar-width: none` or webkit rules. If text overflows, the scrollbar should appear. Check `overflow-y: auto` is set. |
| **Text hard to read in dark theme** | Check `color: var(--ink-soft)` — it's the lighter gray for secondary text. Ensure foreground + background meet 4.5:1 contrast. Use a contrast checker. |
| **Responsive design breaks at certain widths** | The media queries at the bottom of CSS define breakpoints (max-width: 520px, 521–900px). Test exactly at these widths and adjust as needed. |
| **Avatar images not showing** | Avatar is a `background-image` on a `<div>`. If `background-position` or `background-size` is wrong, the image may be shifted or cut off. Check the radial gradient overlay isn't opaque. |

## Expected Output After Optimization

After running the optimization pass, the website should demonstrate:
- **Consistent spacing** between all elements (measured in multiples of a base unit)
- **Clear visual hierarchy** (primary actions prominent, secondary actions subtle)
- **Smooth typography** with readable line-height and letter-spacing
- **Accessible contrast** ratios meeting WCAG AA on all text and themes
- **Responsive layout** that adapts gracefully from 320px to 1024px+ (within phone-frame constraints)
- **Polished micro-interactions** (hover states, focus outlines, transitions feel natural)
- **No layout jank** on modern browsers (Chrome, Edge, Safari, Firefox)

---

**Driver location**: `./.claude/skills/optimize-ui/driver.mjs`  
**Screenshots saved to**: `./.claude/skills/optimize-ui/screenshots/`  
**Commit changes to**: `index.html`
