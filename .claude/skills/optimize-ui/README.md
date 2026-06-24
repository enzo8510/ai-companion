# UI Optimization Skill

This skill guides the optimization of the AI Companion website's interface design, layout, and typography.

## Files in This Directory

- **SKILL.md** — Main skill documentation with setup instructions, driver usage, and gotchas
- **ANALYSIS.md** — Detailed analysis of 10 design/UX issues with recommendations
- **driver.mjs** — Node.js script to launch local server and capture screenshots
- **README.md** — This file

## Quick Start

1. **Read the analysis**: Start with `ANALYSIS.md` to understand what needs optimization
2. **Review the skill**: Check `SKILL.md` for detailed instructions on running the app and testing changes
3. **Start optimizing**: Edit `index.html` CSS and test in browser at `http://localhost:8000/index.html`

## Key Issues Identified

The analysis identifies 10 optimization opportunities:

1. **Spacing inconsistency** — Establish 8px base unit scale
2. **Typography hierarchy** — Define clear font-size and line-height scale
3. **Color contrast** — Ensure WCAG AA compliance on all text
4. **Touch targets** — Increase button sizes to 44px minimum
5. **Visual hierarchy** — Simplify accent color usage
6. **Whitespace** — Improve breathing room between sections
7. **Responsive design** — Test and refine at multiple breakpoints
8. **Font weights** — Standardize on 400/500/700 only
9. **Theme consistency** — Ensure all 6 themes follow consistent patterns
10. **Micro-interactions** — Polish hover/focus/active states

## Testing the Optimization

### Manual Testing (Recommended for Development)
```bash
cd C:\Users\user\Desktop\AI伴侶_網站
python -m http.server 8000
# Open http://localhost:8000/index.html in browser
# Edit index.html CSS, save, refresh browser to see changes
```

### Automated Testing
```bash
node ./.claude/skills/optimize-ui/driver.mjs
# Analyzes CSS, creates HTTP server, provides guidance
# Press Ctrl+C to stop
```

## Optimization Checklist

Use this checklist to track progress:

- [ ] Phase 1: Spacing & Typography & Contrast (foundation)
- [ ] Phase 2: Touch Targets & Hierarchy & Whitespace (refinement)
- [ ] Phase 3: Responsive & Font Weights & Themes & Animations (polish)

## Related Documentation

- `index.html:1-100` — CSS custom properties (colors, spacing, shadows)
- `index.html:150-600` — Component styles (header, chat, buttons, cards)
- `index.html:700-1000` — Grid layouts and responsive rules

## Success Criteria

After optimization, the website should demonstrate:
- ✅ Consistent spacing (8px scale)
- ✅ Clear typography hierarchy
- ✅ WCAG AA color contrast
- ✅ 44px+ touch targets
- ✅ Clear visual hierarchy
- ✅ Adequate whitespace
- ✅ Responsive at 360px–1024px
- ✅ Consistent font weights
- ✅ All 6 themes polished
- ✅ Smooth micro-interactions

