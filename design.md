# Design System Specification: Liquid Glass Elite

This design system defines the premium aesthetic guidelines for the EliteHire platform.

---

## Brand & Style
Blends the precision of high-end glassmorphic overlays with organic liquid gradients. High contrast, clean editorial typography, translucent materials, and soft purple-tinted specular drop shadows.

---

## Design Tokens

### Colors
- **Primary**: `#8731a3` (Vibrant Magenta-Purple)
- **Primary Container**: `#a34cbe`
- **Secondary**: `#0060ab` (Vibrant Blue)
- **Secondary Container**: `#54a3ff`
- **Background**: `#f9f9ff` (Soft lavender-blue foundation)
- **On-Background**: `#471A70` (Deep purple for high text legibility)
- **Outline**: `#817381`
- **Gold**: `#FFD60A`
- **Orange**: `#FF9F0A`
- **Card Gradient**: `linear-gradient(135deg, #4D9EFA 0%, #BF7DF5 100%)`

### Glassmorphic Fills
- **Standard Cards/Panels**: `glass-fill` $\rightarrow$ `rgba(255, 255, 255, 0.35)` with `28px` backdrop-blur.
- **Input Fields/High Focus**: `glass-thick` $\rightarrow$ `rgba(255, 255, 255, 0.8)` with `28px` backdrop-blur.
- **Border specularity**: `1px` solid `rgba(255, 255, 255, 0.6)`.

### Typography
- **Font Family**: Inter, sans-serif
- **Headline Font**: Inter
- **Sizes**:
  - `display-xl`: 56px (Font Weight 700, Line Height 1.1)
  - `headline-lg`: 34px (Font Weight 600, Line Height 1.2)
  - `body-md`: 16px (Font Weight 400, Line Height 1.5)
  - `label-caps`: 13px (Font Weight 600, Letter Spacing 0.03em)

### Spacing & Grid
- **Base Grid**: 8px system.
- **Desktop Margins**: 64px outer margins, 24px column gutters.
- **Desktop Layout**: 12-column fluid grid within a 1280px centered wrapper.

### Rounding (Border Radius)
- **Small Elements (Pills/Tags)**: `0.5rem` (8px) or `9999px` (capsules)
- **Cards/Input Fields**: `1rem` (16px) or `1.5rem` (24px)
- **Major Layout Modules**: `2rem` (32px)
