# Premium UI - Quick Reference

## Imports

```tsx
// Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"

// Premium Components
import { PageHeader } from "@/components/PageHeader"
import { StatCard } from "@/components/StatCard"
import { GlassCard, PremiumSection, AnimatedList } from "@/components/PremiumComponents"
import { ChatUI } from "@/components/ChatUI"
import { LoadingSpinner, Skeleton } from "@/components/LoadingSpinner"
import { Sidebar } from "@/components/Sidebar"
import { TopBar } from "@/components/TopBar"
import { DashboardLayout } from "@/components/DashboardLayout"

// Animations
import { motion } from "framer-motion"
import { slideInVariants, fadeInVariants, scaleInVariants } from "@/lib/animations"
```

---

## Quick Components

### Buttons
```tsx
<Button>Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button size="lg">Large</Button>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Inputs
```tsx
<Input placeholder="Enter..." />
<Input type="email" placeholder="Email..." />
```

### Badges
```tsx
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Glass Cards
```tsx
<GlassCard gloss>
  <div className="p-6">Content</div>
</GlassCard>
```

### Stat Cards
```tsx
<StatCard
  title="Leads"
  value="1,247"
  icon={Users}
  color="blue"
  trend="+12%"
  delay={0}
/>
```

### Page Header
```tsx
<PageHeader
  title="Page Title"
  subtitle="Subtitle"
  action={<Button>Action</Button>}
/>
```

### Loading States
```tsx
<LoadingSpinner size="md" color="primary" text="Loading..." />
<Skeleton className="h-8 w-32" />
```

---

## Tailwind Classes

### Colors
```
text-primary          // Blue
text-secondary        // Purple
text-accent           // Cyan
text-foreground       // White text
text-foreground-muted // Gray text
bg-primary            // Blue background
bg-card               // Card background
```

### Effects
```
glass                 // Glassmorphic effect
gradient-primary      // Blue to purple gradient
shadow-glow          // Blue glow shadow
hover-lift           // Lifts on hover
transition-smooth    // 300ms smooth transition
```

### Spacing
```
p-4      // Padding 16px
m-4      // Margin 16px
gap-4    // Gap 16px
space-y-4 // Vertical spacing
```

### Responsive
```
grid-cols-1 md:grid-cols-2 lg:grid-cols-3
px-4 md:px-8
text-sm md:text-base
```

---

## Animation Patterns

### Simple Fade In
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
```

### Slide In
```tsx
<motion.div
  variants={slideInVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>
```

### Staggered List
```tsx
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover Effects
```tsx
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Content
</motion.div>
```

---

## Color System

### CSS Variables (Available as Tailwind classes)
```
--primary              → text-primary, bg-primary
--secondary            → text-secondary, bg-secondary
--accent               → text-accent, bg-accent
--background           → bg-background
--foreground           → text-foreground
--border               → border-border
--card                 → bg-card
--success              → text-success
--warning              → text-warning
--destructive          → text-destructive
```

### Gradients
```
gradient-primary       // Blue → Purple
gradient-text          // Text gradient
gradient-border        // Border gradient
bg-gradient-to-r       // Custom gradient
```

---

## Common Patterns

### Page with Stats
```tsx
"use client"
import { PageHeader } from "@/components/PageHeader"
import { StatCard } from "@/components/StatCard"

export default function Page() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Metric 1" value="1,234" icon={Users} delay={0} />
        <StatCard title="Metric 2" value="5,678" icon={TrendingUp} delay={0.1} />
        <StatCard title="Metric 3" value="9,012" icon={Clock} delay={0.2} />
      </div>
    </>
  )
}
```

### Modal
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    Content here
  </DialogContent>
</Dialog>
```

### Form
```tsx
<form className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <div>
    <Label htmlFor="message">Message</Label>
    <Textarea id="message" />
  </div>
  <Button type="submit">Submit</Button>
</form>
```

### List with Animations
```tsx
<AnimatedList
  items={items.map((item) => (
    <Card key={item.id}>
      <CardContent className="p-4">
        {item.name}
      </CardContent>
    </Card>
  ))}
/>
```

---

## Spacing Reference

| Class | Value | Pixels |
|-------|-------|--------|
| p-0   | 0     | 0px    |
| p-1   | 0.25  | 4px    |
| p-2   | 0.5   | 8px    |
| p-3   | 0.75  | 12px   |
| p-4   | 1     | 16px   |
| p-6   | 1.5   | 24px   |
| p-8   | 2     | 32px   |

---

## Size Reference

| Class  | Size   |
|--------|--------|
| w-4    | 16px   |
| w-5    | 20px   |
| w-6    | 24px   |
| w-8    | 32px   |
| w-10   | 40px   |
| h-10   | 40px   |
| h-12   | 48px   |

---

## State Classes

### Hover
```tsx
hover:bg-white/5        // Hover background
hover:text-primary      // Hover text color
hover:scale-105         // Hover scale
hover:shadow-lg         // Hover shadow
```

### Focus
```tsx
focus:outline-none      // Remove outline
focus:ring-2            // Ring outline
focus:ring-primary      // Ring color
```

### Disabled
```tsx
disabled:opacity-50     // Disabled opacity
disabled:cursor-not-allowed  // Not allowed cursor
```

---

## Typography

### Headings
```tsx
<h1 className="text-3xl font-bold">H1</h1>
<h2 className="text-2xl font-bold">H2</h2>
<h3 className="text-xl font-bold">H3</h3>
<p className="text-sm text-foreground-muted">Small</p>
```

### Text Colors
```
text-foreground          // Primary text
text-foreground-secondary // Secondary text
text-foreground-muted    // Muted text
```

---

## Layout Helpers

### Grid Layouts
```tsx
// 3 column on large, 2 on medium, 1 on mobile
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"

// 2 column
className="grid grid-cols-1 md:grid-cols-2 gap-6"

// Responsive with sidebar
className="flex gap-4"
// Item 1: w-64 (sidebar)
// Item 2: flex-1 (main)
```

### Flexbox
```
flex              // Display flex
items-center      // Vertically center
justify-between   // Space between
gap-4            // Gap between items
```

---

## Icon Sizes

### With Lucide Icons
```tsx
import { Users } from "lucide-react"

<Users className="w-4 h-4" />   // 16px
<Users className="w-5 h-5" />   // 20px (default)
<Users className="w-6 h-6" />   // 24px
<Users className="w-8 h-8" />   // 32px
```

---

## Useful Classes

```
truncate               // Truncate text with ellipsis
text-center           // Center text
uppercase             // Uppercase text
font-semibold         // Semibold font
cursor-pointer        // Pointer cursor
pointer-events-none   // Can't click
select-none           // Can't select text
```

---

## Common Mistakes to Avoid

❌ Don't forget `"use client"` for interactive components
❌ Don't animate layout-triggering properties (width, height)
❌ Don't use too many animations at once
❌ Don't forget delays for staggered effects
❌ Don't hardcode colors - use CSS variables
❌ Don't skip accessibility (alt text, aria labels)

✅ Use semantic HTML
✅ Add proper focus states
✅ Test keyboard navigation
✅ Use proper color contrast
✅ Optimize images and bundles
✅ Use motion for purpose, not decoration

---

## Files You Need to Know

- `styles/globals.css` - Design system variables
- `lib/animations.ts` - Framer Motion variants
- `components/ui/*` - Base components
- `components/Sidebar.tsx` - Navigation
- `components/TopBar.tsx` - Header
- `components/PageHeader.tsx` - Page titles
- `components/StatCard.tsx` - Stat displays
- `components/ChatUI.tsx` - Chat interface
- `components/PremiumComponents.tsx` - Glass effects
- `components/LoadingSpinner.tsx` - Loading states

---

## Useful Links

- Tailwind Docs: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/
- Lucide Icons: https://lucide.dev/
- Radix UI: https://www.radix-ui.com/

---

## Tips for Success

1. **Always use "use client"** for components with Framer Motion
2. **Add delays** to staggered animations (0.1s increments)
3. **Use variants** from `@/lib/animations.ts`
4. **Keep animations fast** (< 500ms for most cases)
5. **Test on mobile** - animations should work on all devices
6. **Use proper spacing** - Tailwind spacing scale
7. **Color consistency** - Use CSS variables, not hardcoded values
8. **Accessibility first** - Proper contrast, keyboard nav
9. **Performance** - Profile and optimize
10. **Responsive design** - Test on all screen sizes

---

This quick reference covers 80% of what you need. For detailed info, check PREMIUM_UI_SYSTEM.md and IMPLEMENTATION_GUIDE.md.

