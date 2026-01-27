# Design System Guide

This guide documents the design system for the USFTT table tennis club web application.

## Table of Contents
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Shadows & Elevation](#shadows--elevation)
- [Border Radius](#border-radius)
- [Breakpoints](#breakpoints)
- [Component Patterns](#component-patterns)
- [Animation Guidelines](#animation-guidelines)
- [Accessibility Standards](#accessibility-standards)

---

## Color Palette

### Primary Colors

**Primary Blue** - Brand color for buttons, links, and accents
```
primary-50:  #e7f1ff  // Lightest (backgrounds)
primary-100: #cce3ff
primary-200: #99c7ff
primary-300: #66aaff
primary-400: #338eff
primary-500: #0d6efd  // DEFAULT (main brand color)
primary-600: #0a5bca  // Hover state
primary-700: #084896
primary-800: #003087  // Darkest (text on light backgrounds)
```

**Usage**:
- Buttons: `bg-primary hover:bg-primary-600`
- Links: `text-primary`
- Focus rings: `ring-primary`

---

### Semantic Colors

**Victory/Success Green**
```
victory-light: #d1e7dd  // Light backgrounds
victory:       #198754  // DEFAULT
victory-dark:  #146c43  // Hover, dark mode
```

**Usage**: Positive progressions, success states, wins
```tsx
<span className="text-victory">+25</span>
<div className="bg-victory-light border-victory">Victory</div>
```

---

**Defeat/Error Red**
```
defeat-light: #f8d7da  // Light backgrounds
defeat:       #dc3545  // DEFAULT
defeat-dark:  #b02a37  // Hover, dark mode
```

**Usage**: Negative progressions, error states, losses
```tsx
<span className="text-defeat">-10</span>
<div className="bg-defeat-light border-defeat">Error</div>
```

---

**Draw/Neutral Gray**
```
draw-light: #e9ecef  // Light backgrounds
draw:       #6c757d  // DEFAULT
draw-dark:  #495057  // Hover, dark mode
```

**Usage**: Neutral states, draws, secondary information
```tsx
<span className="text-draw">0</span>
<div className="bg-draw-light border-draw">Neutral</div>
```

---

### Neutral Palette

**Grays** - Used for backgrounds, borders, text
```
neutral-50:  #f8f9fa  // Page background (DEFAULT body bg)
neutral-100: #e9ecef  // Card hover, dividers
neutral-200: #dee2e6  // Borders
neutral-300: #ced4da  // Input borders
neutral-400: #adb5bd  // Disabled text
neutral-500: #6c757d  // Secondary text
neutral-600: #495057  // Body text
neutral-700: #343a40  // Headings
neutral-800: #212529  // Primary text
```

**Usage**:
- Body background: `bg-neutral-50`
- Text hierarchy:
  - Primary: `text-gray-900` or `text-neutral-800`
  - Secondary: `text-gray-600` or `text-neutral-600`
  - Muted: `text-gray-500` or `text-neutral-500`

---

## Typography

### Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto',
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
             'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Font Scale

| Class | Size | Line Height | Usage |
|-------|------|-------------|-------|
| `text-xs` | 12px (0.75rem) | 16px (1rem) | Small labels, badges |
| `text-sm` | 14px (0.875rem) | 20px (1.25rem) | Secondary text, captions |
| `text-base` | 16px (1rem) | 24px (1.5rem) | Body text (DEFAULT) |
| `text-lg` | 18px (1.125rem) | 28px (1.75rem) | Large body text |
| `text-xl` | 20px (1.25rem) | 28px (1.75rem) | h4 headings |
| `text-2xl` | 24px (1.5rem) | 32px (2rem) | h3 headings, large values |
| `text-3xl` | 30px (1.875rem) | 36px (2.25rem) | h2 headings, stats |
| `text-4xl` | 36px (2.25rem) | 40px (2.5rem) | h1 headings |

### Heading Styles

```css
h1 {
  @apply text-3xl font-bold text-gray-900 mb-4;
}

h2 {
  @apply text-2xl font-semibold text-gray-800 mb-3;
}

h3 {
  @apply text-xl font-semibold text-gray-800 mb-2;
}

h4 {
  @apply text-lg font-medium text-gray-700 mb-2;
}
```

### Font Weights

- `font-normal`: 400 (body text)
- `font-medium`: 500 (emphasized text, h4)
- `font-semibold`: 600 (h2, h3)
- `font-bold`: 700 (h1, strong emphasis)

---

## Spacing System

Based on **4px base unit** (0.25rem)

### Tailwind Spacing Scale

| Class | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | 0 | 0px | No spacing |
| `1` | 0.25rem | 4px | Tight spacing |
| `2` | 0.5rem | 8px | Small spacing |
| `3` | 0.75rem | 12px | Medium-small |
| `4` | 1rem | 16px | Standard spacing |
| `5` | 1.25rem | 20px | Medium |
| `6` | 1.5rem | 24px | Large spacing |
| `8` | 2rem | 32px | Extra large |
| `10` | 2.5rem | 40px | Section spacing |
| `12` | 3rem | 48px | Large section |
| `16` | 4rem | 64px | Extra large section |
| `18` | 4.5rem | 72px | Custom (mobile nav height) |
| `20` | 5rem | 80px | XX-large |
| `22` | 5.5rem | 88px | Custom |
| `24` | 6rem | 96px | XXX-large |
| `25` | 6.25rem | 100px | Custom |
| `30` | 7.5rem | 120px | Custom |

### Common Spacing Patterns

**Component padding**:
- Small cards: `p-4` (16px)
- Medium cards: `p-5` (20px)
- Large cards: `p-6` (24px)

**Component margins**:
- Tight: `mb-2` (8px)
- Standard: `mb-4` (16px)
- Section: `mb-6` (24px)

**Grid gaps**:
- Tight: `gap-2` (8px)
- Standard: `gap-4` (16px)
- Loose: `gap-6` (24px)

---

## Shadows & Elevation

### Shadow Scale

```javascript
boxShadow: {
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'card-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
}
```

**Usage**:
- Static cards: `shadow-card`
- Hover state: `hover:shadow-card-hover transition-shadow`
- Modals, popovers: `shadow-card-lg`

**Transitions**:
```tsx
<div className="shadow-card hover:shadow-card-hover transition-all duration-200">
  Card content
</div>
```

---

## Border Radius

```javascript
borderRadius: {
  'card': '0.75rem',  // 12px - consistent card radius
}
```

**Usage**:
- Cards: `rounded-card`
- Buttons: `rounded` (0.25rem / 4px)
- Badges: `rounded` or `rounded-full`
- Inputs: `rounded` (0.25rem / 4px)

---

## Breakpoints

Mobile-first responsive design with the following breakpoints:

| Breakpoint | Min Width | Tailwind Prefix | Device Target |
|------------|-----------|-----------------|---------------|
| **Mobile** | 0px | (none) | Phones (default) |
| **SM** | 640px | `sm:` | Large phones |
| **MD** | 768px | `md:` | Tablets |
| **LG** | 1024px | `lg:` | Small laptops |
| **XL** | 1280px | `xl:` | Desktops |
| **2XL** | 1536px | `2xl:` | Large desktops |

### Design Breakpoints

**Key breakpoints for this application**:
- **Mobile**: < 768px (card layouts, bottom nav)
- **Tablet**: 768px - 1023px (2-column grids, some table columns hidden)
- **Desktop**: ≥ 1024px (full tables, 3-4 column grids, top nav)

### Responsive Patterns

**Grid layouts**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 1 col mobile, 2 cols tablet, 3 cols desktop */}
</div>
```

**Dashboard stats**:
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col mobile, 2 cols tablet, 4 cols desktop */}
</div>
```

**Navigation visibility**:
```tsx
{/* Desktop nav */}
<nav className="hidden md:block">...</nav>

{/* Mobile nav */}
<nav className="block md:hidden">...</nav>
```

---

## Component Patterns

### Cards

**Standard card**:
```tsx
<div className="bg-white rounded-card shadow-card p-5">
  <h3 className="text-xl font-semibold mb-3">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

**Utility class**:
```tsx
<div className="card">
  {/* Already includes: bg-white rounded-card shadow-card p-4 */}
</div>
```

**Interactive card** (hover effect):
```tsx
<div className="card hover:shadow-card-hover transition-all cursor-pointer">
  Clickable card
</div>
```

---

### Buttons

**Primary button**:
```tsx
<button className="bg-primary text-white px-4 py-2 rounded font-medium hover:bg-primary-600 transition-colors">
  Primary Action
</button>
```

**Secondary button**:
```tsx
<button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-medium hover:bg-gray-50 transition-colors">
  Secondary Action
</button>
```

**Button group**:
```tsx
<div className="flex flex-wrap gap-2">
  <button className={`px-4 py-2 rounded font-medium ${active ? 'bg-primary text-white' : 'bg-white border border-gray-300'}`}>
    Button 1
  </button>
</div>
```

---

### Badges

**Progression badge**:
```tsx
<span className="inline-block rounded px-2 py-1 text-sm font-medium text-victory bg-victory/10">
  +25
</span>
```

**Division badge**:
```tsx
<span className="text-xs font-medium px-2 py-1 rounded border bg-yellow-100 text-yellow-800 border-yellow-300">
  N1
</span>
```

---

### Forms

**Input field**:
```tsx
<div>
  <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
    Label
  </label>
  <input
    id="input"
    type="text"
    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
  />
</div>
```

**Select dropdown**:
```tsx
<select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
  <option>Option 1</option>
</select>
```

---

## Animation Guidelines

### CSS-Only Animations

**No external animation libraries** - use CSS transitions and keyframes only.

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

### Animation Classes

- `animate-fadeIn`: Fade in (400ms ease-in-out)
- `animate-slideIn`: Slide in from right (300ms ease-out)
- `animate-shimmer`: Shimmer effect for skeletons (2s infinite)
- `animate-spin-slow`: Slow spin (2s infinite)

### Transition Patterns

**Standard transitions**:
```tsx
<button className="transition-colors duration-200">
  Smooth color change
</button>

<div className="transition-all duration-300">
  Multiple properties
</div>

<div className="transition-shadow duration-200">
  Shadow transition
</div>
```

**Hover effects**:
```tsx
<div className="hover:shadow-card-hover transition-all">
  Elevate on hover
</div>

<button className="hover:bg-primary-600 transition-colors">
  Darken on hover
</button>
```

### Animation Best Practices

1. **Keep durations short**: 200-400ms for most transitions
2. **Use easing functions**: `ease-in-out` for most, `ease-out` for entrances
3. **Animate transform and opacity**: Hardware accelerated
4. **Avoid animating layout properties**: width, height, margin (causes reflow)
5. **Use CSS over JavaScript**: Better performance

---

## Accessibility Standards

Following **WCAG 2.1 Level AA** basics.

### Color Contrast

**Minimum contrast ratios**:
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Tested combinations**:
- `text-gray-900` on `bg-neutral-50`: ✅ Excellent (>16:1)
- `text-primary` on white: ✅ Good (4.5:1)
- `text-gray-600` on white: ✅ Good (4.5:1)

### Focus Indicators

**All interactive elements** must have visible focus indicators:

```css
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}
```

**Usage**:
```tsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Accessible button
</button>
```

### Semantic HTML

✅ **Do**:
```tsx
<button onClick={handleClick}>Click me</button>
<nav aria-label="Main navigation">...</nav>
<header>...</header>
<main>...</main>
```

❌ **Don't**:
```tsx
<div onClick={handleClick}>Click me</div>  {/* Not keyboard accessible */}
<div className="nav">...</div>  {/* Not semantic */}
```

### ARIA Labels

**Icon-only buttons**:
```tsx
<button aria-label="Close" onClick={handleClose}>
  <X className="w-4 h-4" />
</button>
```

**Search inputs**:
```tsx
<input
  type="search"
  aria-label="Search players"
  placeholder="Rechercher..."
/>
```

### Heading Hierarchy

✅ **Correct**:
```tsx
<h1>Page Title</h1>
  <h2>Section</h2>
    <h3>Subsection</h3>
  <h2>Another Section</h2>
```

❌ **Incorrect**:
```tsx
<h1>Page Title</h1>
  <h3>Section</h3>  {/* Skipped h2 */}
```

### Keyboard Navigation

**All interactive elements** must be keyboard accessible:
- Tab: Move to next element
- Shift+Tab: Move to previous element
- Enter/Space: Activate button
- Escape: Close modal/dropdown

**Tab order** should follow visual order:
```tsx
<div className="flex flex-col">
  <button tabIndex={0}>First</button>
  <button tabIndex={0}>Second</button>
  <button tabIndex={0}>Third</button>
</div>
```

---

## Design Checklist

Before shipping a new component or page:

### Visual Design
- [ ] Uses colors from design system palette
- [ ] Typography follows scale and hierarchy
- [ ] Spacing uses 4px base unit
- [ ] Shadows appropriate for elevation level
- [ ] Border radius consistent (`rounded-card` for cards)

### Responsive Design
- [ ] **No horizontal scrolling** on any screen size
- [ ] Tested on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Content readable at all viewport sizes
- [ ] Touch targets at least 44x44px on mobile
- [ ] Grid layouts adapt appropriately (1→2→3 columns)

### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Semantic HTML elements used
- [ ] ARIA labels on icon-only buttons
- [ ] Proper heading hierarchy (single h1)
- [ ] Form inputs have labels

### Performance
- [ ] Images optimized and lazy-loaded
- [ ] CSS animations (no JavaScript animation libraries)
- [ ] Large components code-split with React.lazy
- [ ] Loading states with skeleton loaders

### Testing
- [ ] Component has `data-testid` attribute
- [ ] E2E tests cover critical user flows
- [ ] Tested on Chrome, Safari, Firefox
- [ ] Tested on iOS and Android (mobile)

---

## Resources

- **Tailwind CSS Docs**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/icons/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
