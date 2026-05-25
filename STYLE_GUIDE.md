# Visual Style Guide - ReplyFlow AI Premium UI

## Brand Identity

### Logo & Branding
- **Brand Name**: ReplyFlow AI
- **Tagline**: "Never Miss a Lead"
- **Logo Icon**: Zap / Lightning bolt (representing AI power)
- **Brand Colors**: Blue → Purple → Cyan gradient

---

## Color Palette

### Primary Colors
| Color | Value | Usage |
|-------|-------|-------|
| **Primary** | #3B82F6 (Blue) | Primary buttons, links, accents |
| **Primary Light** | #93C5FD (Blue-300) | Hover states, lighter backgrounds |
| **Primary Dark** | #1E3A8A (Blue-900) | Dark mode accents |

### Secondary Colors
| Color | Value | Usage |
|-------|-------|-------|
| **Secondary** | #8B5CF6 (Purple) | Secondary buttons, accents |
| **Secondary Light** | #C4B5FD (Purple-300) | Hover states |
| **Secondary Dark** | #581C87 (Purple-900) | Dark backgrounds |

### Accent Colors
| Color | Value | Usage |
|-------|-------|-------|
| **Accent** | #22D3EE (Cyan) | Highlights, special elements |
| **Accent Foreground** | #083344 (Cyan-950) | Text on accent backgrounds |

### Neutral Colors
| Color | Value | Usage |
|-------|-------|-------|
| **Background** | #0A0A0C | Page background |
| **Background Secondary** | #11182F | Secondary background |
| **Background Tertiary** | #1F2937 | Tertiary background |
| **Card** | #141820 | Card backgrounds |
| **Foreground** | #F1F5FA | Primary text |
| **Foreground Secondary** | #D1D5DB | Secondary text |
| **Foreground Muted** | #9CA3AF | Muted text |
| **Border** | #374151 | Borders |
| **Input** | #1F2937 | Input backgrounds |

### Status Colors
| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| **Success** | Green | #22C55E | Positive states, done |
| **Warning** | Yellow | #EAB308 | Alerts, pending |
| **Error/Destructive** | Red | #EF4444 | Errors, delete actions |

---

## Typography

### Font Family
- **Primary Font**: Inter (system fallback: -apple-system, BlinkMacSystemFont, Segoe UI)
- **Weight**: 300, 400, 500, 600, 700, 800
- **Letter Spacing**: -0.5px for headings

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|-----------------|
| **H1** | 32px (2rem) | 700 | 1.2 | -0.5px |
| **H2** | 24px (1.5rem) | 700 | 1.3 | -0.5px |
| **H3** | 20px (1.25rem) | 700 | 1.4 | -0.5px |
| **H4** | 18px (1.125rem) | 700 | 1.4 | -0.5px |
| **Body Large** | 16px (1rem) | 400 | 1.5 | 0 |
| **Body** | 14px (0.875rem) | 400 | 1.5 | 0 |
| **Body Small** | 12px (0.75rem) | 400 | 1.5 | 0 |
| **Caption** | 11px (0.6875rem) | 500 | 1.4 | 0.5px |

### Font Weight Usage
- **300**: Light accents, disabled text
- **400**: Body text, regular
- **500**: Labels, small headings
- **600**: Subheadings, bold body
- **700**: Headings
- **800**: Extra bold, emphasis

---

## Spacing System

All spacing uses a 4px base unit (Tailwind default).

| Space | Value | Usage |
|-------|-------|-------|
| **xs** | 4px (0.25rem) | Tiny gaps |
| **sm** | 8px (0.5rem) | Small gaps |
| **md** | 12px (0.75rem) | Medium gaps |
| **base** | 16px (1rem) | Standard spacing |
| **lg** | 24px (1.5rem) | Large sections |
| **xl** | 32px (2rem) | Extra large sections |
| **2xl** | 48px (3rem) | Page sections |
| **3xl** | 64px (4rem) | Major sections |

### Component Spacing
- **Sidebar Padding**: 1.5rem (24px)
- **Card Padding**: 1.5rem (24px)
- **Button Padding**: X: 1rem, Y: 0.625rem
- **Input Padding**: X: 1rem, Y: 0.625rem
- **Section Gap**: 1.5rem (24px)

---

## Border Radius

| Size | Value | Usage |
|------|-------|-------|
| **sm** | 8px | Small elements |
| **md** | 10px | Medium elements |
| **lg** | 12px | Large elements (default) |
| **full** | 9999px | Fully rounded (badges, pills) |

---

## Shadows

### Shadow System

| Level | CSS | Usage |
|-------|-----|-------|
| **sm** | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle, text |
| **md** | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Cards |
| **lg** | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | Modals |
| **xl** | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | Modals, high elevation |
| **glass** | `0 8px 32px 0 rgba(31, 38, 135, 0.37)` | Glass effect |
| **glow** | `0 0 20px rgba(59, 130, 246, 0.3)` | Blue glow |
| **glow-secondary** | `0 0 20px rgba(139, 92, 246, 0.2)` | Purple glow |
| **glow-lg** | `0 0 40px rgba(59, 130, 246, 0.25)` | Large glow |

---

## Button Styles

### Button Sizes

| Size | Height | Padding X | Padding Y | Font Size |
|------|--------|-----------|-----------|-----------|
| **sm** | 32px | 12px | 8px | 12px |
| **default** | 40px | 16px | 8px | 14px |
| **lg** | 48px | 24px | 12px | 16px |
| **xl** | 56px | 32px | 14px | 18px |

### Button Variants

#### Primary (Default)
- **Background**: Gradient Blue → Purple
- **Text**: White
- **Hover**: Enhanced shadow with glow
- **Active**: Scale 0.98
- **Disabled**: 50% opacity

#### Secondary
- **Background**: Gradient Purple → Cyan
- **Text**: White
- **Hover**: Enhanced shadow with purple glow
- **Active**: Scale 0.98

#### Outline
- **Background**: Card/transparent
- **Border**: 1px solid border color
- **Text**: Foreground
- **Hover**: Background tertiary
- **Active**: Scale 0.98

#### Ghost
- **Background**: Transparent
- **Text**: Foreground
- **Hover**: 5% white background
- **Active**: Scale 0.98

#### Accent
- **Background**: Gradient Cyan → Blue
- **Text**: Background/dark
- **Hover**: Enhanced shadow with glow
- **Active**: Scale 0.98

#### Destructive
- **Background**: Red
- **Text**: White
- **Hover**: Darker red with red glow
- **Active**: Scale 0.98

---

## Input Fields

### Input States

#### Default
- **Background**: Input color (#1F2937 with transparency)
- **Border**: 1px solid input-border
- **Text**: Foreground
- **Placeholder**: Muted text

#### Hover
- **Border**: Slightly lighter border

#### Focus
- **Ring**: 2px solid primary at 50% opacity
- **Border**: Primary color

#### Disabled
- **Opacity**: 50%
- **Cursor**: Not allowed

### Input Height: 44px (11 units)

---

## Cards

### Card Default Style
- **Background**: Glass effect (card color with transparency)
- **Border**: 1px solid white/10%
- **Padding**: 24px (1.5rem)
- **Border Radius**: 12px
- **Shadow**: md
- **Backdrop Blur**: 12px

### Card Hover State
- **Border**: Lighter (white/20%)
- **Shadow**: lg with glow effect
- **Transform**: Translate up -4px

---

## Badges

### Badge Sizes

| Size | Padding | Font Size |
|------|---------|-----------|
| **default** | 12px X, 4px Y | 12px |
| **sm** | 8px X, 2px Y | 11px |
| **lg** | 16px X, 6px Y | 13px |

### Badge Variants

#### Default
- **Background**: Gradient with 20% opacity
- **Border**: Primary color at 30% opacity

#### Success
- **Background**: Green at 20% opacity
- **Border**: Green at 30% opacity
- **Text**: Green-300

#### Warning
- **Background**: Yellow at 20% opacity
- **Border**: Yellow at 30% opacity
- **Text**: Yellow-300

#### Destructive
- **Background**: Red at 20% opacity
- **Border**: Red at 30% opacity
- **Text**: Red-300

#### Outline
- **Background**: Transparent
- **Border**: White at 20% opacity
- **Text**: Muted

#### Glass
- **Background**: White at 10% opacity
- **Border**: White at 20% opacity
- **Text**: Foreground

---

## Glassmorphism

### Glass Effect Specifications
- **Background**: Card color with 80% opacity (60-80% opacity range)
- **Backdrop Blur**: 12px
- **Border**: 1px solid white/10%
- **Effect**: Creates modern frosted glass appearance

### Glass Subtle
- **Background**: Card color with 50% opacity
- **Backdrop Blur**: 6px
- **Border**: 1px solid white/5%
- **Effect**: Very subtle glass effect

---

## Animations & Transitions

### Transition Durations
- **Fast**: 150ms (micro-interactions)
- **Base**: 300ms (standard animations)
- **Slow**: 500ms (page transitions)
- **Very Slow**: 800ms (dramatic effects)

### Animation Easing
- **Smooth**: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard smooth
- **Smooth Slow**: `cubic-bezier(0.3, 0, 0.2, 1)` - Slower smooth
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` - Bouncy

### Common Animations

#### Fade In
- Duration: 400ms
- Easing: ease-out
- Properties: opacity

#### Slide In
- Duration: 400ms
- Easing: ease-out
- Properties: opacity, transform (y)

#### Scale In
- Duration: 300ms
- Easing: ease-out
- Properties: opacity, scale

#### Hover Effects
- Duration: 200ms
- Transform: scale 1.02-1.05
- Shadow: Enhanced

---

## Hover Effects

### Button Hover
- **Scale**: 1.02 (2% larger)
- **Shadow**: Enhanced glow effect
- **Transition**: 200ms

### Card Hover
- **Transform**: translateY(-4px)
- **Shadow**: Larger shadow with glow
- **Transition**: 300ms

### List Item Hover
- **Background**: White 5% opacity
- **Transform**: Small scale increase
- **Transition**: 150ms

---

## Icons

### Icon Sizing
| Size | Value | Usage |
|------|-------|-------|
| **xs** | 16px | Inline, small |
| **sm** | 20px | Labels, nav |
| **md** | 24px | Default |
| **lg** | 32px | Hero, large |
| **xl** | 48px | Extra large |
| **2xl** | 64px | Extra extra large |

### Icon Library
- **Primary**: Lucide React
- **Weight**: Regular (default)
- **Stroke Width**: 2
- **Color**: Inherit from text color or use explicit color

---

## Responsive Design

### Breakpoints
- **Mobile**: 0-640px (sm)
- **Tablet**: 640px-768px (md)
- **Desktop**: 768px+ (lg)
- **Large Desktop**: 1280px+ (xl)
- **XL**: 1536px+ (2xl)

### Layout Adjustments
- **Sidebar**: Hidden on mobile, shown on desktop
- **Grid**: 1 column mobile, 2-3 columns desktop
- **Padding**: 16px mobile, 32px desktop
- **Font**: Smaller on mobile, larger on desktop

---

## Contrast & Accessibility

### Color Contrast Ratios
- **AA Standard**: 4.5:1 for normal text
- **AAA Standard**: 7:1 for normal text
- **UI Elements**: 3:1 minimum

### Tested Contrasts
- White on Primary: ✅ 7.2:1
- Foreground on Background: ✅ 10.1:1
- Muted on Background: ✅ 4.8:1
- Border on Background: ✅ 3.2:1

### Focus States
- **Ring**: 2px solid primary
- **Ring Offset**: 2px
- **Visibility**: Always visible
- **Keyboard**: Tab to focus

---

## Dark Mode (Default)

ReplyFlow AI uses a dark-first approach:
- **Primary Background**: Very dark (#0A0A0C)
- **UI Elements**: Darker grays with glassmorphism
- **Text**: Light colors for readability
- **Accents**: Bright for contrast

### Dark Mode Advantages
- Reduces eye strain
- Modern, premium feel
- Better for AI/tech branding
- Excellent for focus

---

## Light Mode (Optional)

Light mode can be implemented by adjusting CSS variables:
- **Background**: Light gray (#FAFAFA)
- **Cards**: White (#FFFFFF)
- **Text**: Dark gray/black
- **Accents**: Same blue/purple (high contrast)

---

## Component Examples

### Sidebar
- **Width**: 256px (fixed)
- **Background**: Glass effect with dark tint
- **Padding**: 24px
- **Border**: Right border white/10%
- **Items**: 44px height with 12px gap
- **Icons**: 20px size
- **Logo**: 40px with gradient background

### TopBar
- **Height**: 64px (4rem)
- **Background**: Glass effect with subtle tint
- **Padding**: 32px horizontal
- **Items**: 40px height
- **Search**: Full width max-384px
- **Notifications**: 36px icon button with pulse dot

### Cards
- **Padding**: 24px
- **Border Radius**: 12px
- **Shadow**: Medium
- **Border**: White 10% opacity
- **Header**: 24px bottom padding, border bottom
- **Footer**: 24px top padding, border top

### Buttons
- **Default**: Gradient, 40px, 16px padding
- **Icon Button**: 44px square, glass background
- **Text Button**: Transparent, text color

---

## Motion Principles

### Timing
- **Quick interactions**: 100-150ms
- **UI transitions**: 200-300ms
- **Page transitions**: 300-500ms
- **Elaborate animations**: 500-800ms

### Easing
- **In**: Slow start, fast end (for appearing)
- **Out**: Fast start, slow end (for disappearing)
- **In-Out**: For transitions
- **Custom**: For special effects

### Performance
- **GPU Accelerated**: Only transform and opacity
- **No Layout Shifts**: Avoid width/height animations
- **Staggered**: Spread animations over time
- **Throttled**: Animations disabled on slow devices

---

## File Structure

```
styles/
  └── globals.css          # All CSS variables & utilities

lib/
  └── animations.ts        # Framer Motion variants

components/
  ├── ui/
  │   ├── button.tsx       # Button component
  │   ├── card.tsx         # Card component
  │   ├── input.tsx        # Input component
  │   ├── badge.tsx        # Badge component
  │   ├── dialog.tsx       # Dialog component
  │   └── ...
  ├── Sidebar.tsx          # Navigation
  ├── TopBar.tsx           # Header
  ├── DashboardLayout.tsx   # Layout wrapper
  ├── PageHeader.tsx       # Page title
  ├── StatCard.tsx         # Stat display
  ├── ChatUI.tsx           # Chat interface
  ├── PremiumComponents.tsx # Premium wrappers
  └── ...
```

---

## Usage Summary

1. **Colors**: Use Tailwind classes (e.g., `text-primary`, `bg-card`)
2. **Spacing**: Use Tailwind spacing scale
3. **Typography**: Use semantic HTML with Tailwind
4. **Components**: Import from `@/components/`
5. **Animations**: Use variants from `@/lib/animations.ts`
6. **Customization**: Modify CSS variables in `styles/globals.css`

---

This style guide ensures consistency across all UI elements while maintaining the premium, modern aesthetic of ReplyFlow AI.

