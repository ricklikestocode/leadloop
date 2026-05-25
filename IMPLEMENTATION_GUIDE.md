# Premium UI Implementation Guide

## Quick Start

### 1. Install Dependencies

Make sure Framer Motion is installed:
```bash
npm install framer-motion
```

### 2. Import Global Styles

The new `styles/globals.css` is already set up with:
- CSS variables for all colors
- Animation keyframes
- Utility classes
- Glassmorphism effects

Ensure your `layout.tsx` imports this file:
```tsx
import "@/styles/globals.css"
```

### 3. Use Premium Components

All components are ready to use immediately.

---

## Component Migration Guide

### How to Update Existing Pages

#### Before (Old Style)
```tsx
import { Card, CardContent } from "@/components/ui/card"

export function LeadsPage() {
  return (
    <div className="p-8">
      <h1>Leads</h1>
      <Card>
        <CardContent>
          <p>Lead count: 1,247</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### After (Premium Style)
```tsx
"use client"

import { PageHeader } from "@/components/PageHeader"
import { StatCard } from "@/components/StatCard"
import { GlassCard, PremiumSection } from "@/components/PremiumComponents"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        title="Leads"
        subtitle="Manage and track your leads"
        action={<Button><Plus className="w-4 h-4 mr-2" /> New Lead</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Leads"
          value="1,247"
          icon={Users}
          color="blue"
          trend="+12% this week"
          delay={0}
        />
      </div>

      <PremiumSection title="All Leads">
        <GlassCard gloss>
          {/* Lead list */}
        </GlassCard>
      </PremiumSection>
    </>
  )
}
```

---

## Common Patterns

### 1. Page Layout with Header and Cards

```tsx
"use client"

import { PageHeader } from "@/components/PageHeader"
import { GlassCard, PremiumSection } from "@/components/PremiumComponents"
import { Button } from "@/components/ui/button"

export default function MyPage() {
  return (
    <>
      <PageHeader
        title="Page Title"
        subtitle="Optional description"
        action={<Button>Action Button</Button>}
      />

      <PremiumSection title="Section Title" accent>
        <GlassCard gloss>
          <div className="p-6">
            {/* Content */}
          </div>
        </GlassCard>
      </PremiumSection>
    </>
  )
}
```

### 2. Animated List

```tsx
import { AnimatedList } from "@/components/PremiumComponents"

const items = [
  <div key="1">Item 1</div>,
  <div key="2">Item 2</div>,
  <div key="3">Item 3</div>,
]

<AnimatedList items={items} staggerDelay={0.1} />
```

### 3. Stats Grid

```tsx
import { StatCard } from "@/components/StatCard"
import { Users, TrendingUp, Clock } from "lucide-react"

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatCard
    title="Metric 1"
    value="1,234"
    icon={Users}
    color="blue"
    delay={0}
  />
  <StatCard
    title="Metric 2"
    value="56.7%"
    icon={TrendingUp}
    color="green"
    delay={0.1}
  />
  <StatCard
    title="Metric 3"
    value="2.4h"
    icon={Clock}
    color="purple"
    delay={0.2}
  />
</div>
```

### 4. Buttons with Animations

```tsx
import { Button } from "@/components/ui/button"

// Primary gradient button
<Button variant="default" size="lg">
  Submit
</Button>

// Secondary gradient button
<Button variant="secondary">
  Secondary
</Button>

// Outline button
<Button variant="outline">
  Cancel
</Button>

// Ghost button
<Button variant="ghost">
  Link
</Button>

// Accent button
<Button variant="accent">
  Featured
</Button>

// Destructive button
<Button variant="destructive">
  Delete
</Button>
```

### 5. Badges

```tsx
import { Badge } from "@/components/ui/badge"

<Badge variant="default">Active</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Neutral</Badge>
<Badge variant="glass">Info</Badge>
```

### 6. Modals/Dialogs

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    <div>
      {/* Content */}
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### 7. Chat UI

```tsx
import { ChatUI } from "@/components/ChatUI"

const messages = [
  { id: "1", text: "Hello!", sender: "other", timestamp: "10:30 AM", name: "John" },
  { id: "2", text: "Hi there!", sender: "user", timestamp: "10:31 AM", read: true },
]

<ChatUI messages={messages} contactName="John Doe" contactStatus="online" />
```

---

## Tailwind Utilities

### Glass Effect
```tsx
<div className="glass">
  Glassmorphic container
</div>

<div className="glass-subtle">
  Subtle glass effect
</div>
```

### Gradients
```tsx
<div className="gradient-primary">
  Blue to Purple gradient
</div>

<h1 className="gradient-text">
  Text gradient
</h1>

<div className="gradient-border">
  Border gradient
</div>
```

### Shadows
```tsx
<div className="shadow-glow">
  Blue glow shadow
</div>

<div className="shadow-glow-secondary">
  Purple glow shadow
</div>

<div className="shadow-glow-lg">
  Large glow shadow
</div>
```

### Transitions
```tsx
<div className="transition-smooth hover:scale-105">
  Smooth 300ms transition
</div>

<div className="transition-fast">
  Fast 150ms transition
</div>
```

### Hover Effects
```tsx
<div className="hover-lift">
  Lifts up on hover with shadow
</div>
```

### Scrollable Container
```tsx
<div className="scrollable">
  Scrollable content with custom scrollbar
</div>
```

---

## Animation Patterns

### Using Framer Motion Variants

```tsx
"use client"

import { motion } from "framer-motion"
import { slideInVariants, containerVariants, itemVariants } from "@/lib/animations"

// Simple slide-in animation
<motion.div
  variants={slideInVariants}
  initial="hidden"
  animate="visible"
>
  Content
</motion.div>

// Container with staggered items
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>

// Hover scale effect
<motion.div
  variants={hoverScaleVariants}
  initial="rest"
  whileHover="hover"
>
  Hover me
</motion.div>
```

### Custom Animations

```tsx
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
>
  Custom animation
</motion.div>

// Staggered animations
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }}
>
  {items.map((item) => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

---

## Color System Usage

### Via CSS Variables

```tsx
// In CSS
.my-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}

// In Tailwind
<div className="bg-primary text-foreground border-border">
  Using color variables
</div>
```

### Gradient Colors

```tsx
// Primary gradient
<div className="bg-gradient-primary">
  Background gradient
</div>

// Text gradient
<h1 className="gradient-text">
  Gradient text
</h1>
```

---

## Form Components

### Input

```tsx
import { Input } from "@/components/ui/input"

<Input
  type="text"
  placeholder="Enter value..."
  className="..."
/>
```

### Label

```tsx
import { Label } from "@/components/ui/label"

<Label htmlFor="email">
  Email
</Label>
<Input id="email" type="email" />
```

### Select

```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Textarea

```tsx
import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Enter text..." />
```

---

## Best Practices

### 1. Always Use "use client" for Interactive Components
```tsx
"use client"

import { motion } from "framer-motion"

export function MyComponent() {
  // ...
}
```

### 2. Add Delays for Staggered Animations
```tsx
<StatCard delay={0} />
<StatCard delay={0.1} />
<StatCard delay={0.2} />
```

### 3. Use Proper Semantic HTML
```tsx
<button> for buttons
<a> for links
<section> for sections
<h1>, <h2>, etc. for headings
```

### 4. Keep Animation Durations Short
- Fast: 150ms
- Default: 300ms
- Slow: 500ms

### 5. Accessibility First
```tsx
// Good
<Button aria-label="Delete item">
  <X />
</Button>

// Also provide keyboard navigation
<Input onKeyPress={(e) => e.key === "Enter" && handleSubmit()} />
```

### 6. Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items automatically stack on mobile */}
</div>
```

---

## Performance Tips

### 1. Memoize Components
```tsx
import { memo } from "react"

const MyComponent = memo(function MyComponent({ prop }) {
  return <div>{prop}</div>
})
```

### 2. Use will-change for Animated Elements
```tsx
<motion.div
  style={{ willChange: "transform, opacity" }}
  animate={{ y: 0 }}
>
  Content
</motion.div>
```

### 3. Lazy Load Components
```tsx
import dynamic from "next/dynamic"

const ChatUI = dynamic(() => import("@/components/ChatUI"), {
  loading: () => <div>Loading...</div>
})
```

### 4. Avoid Over-Animation
- Not every element needs animation
- Keep it subtle and purposeful
- Don't animate on every hover

---

## Troubleshooting

### Components Not Animating
- Ensure "use client" directive is at top
- Check Framer Motion is installed
- Verify initial/animate variants are set

### Styling Issues
- Check CSS variables are being used
- Ensure Tailwind classes are imported
- Verify responsive classes work

### Performance Issues
- Check if too many animations run simultaneously
- Verify using transform/opacity only
- Profile with DevTools

---

## Files Reference

| File | Purpose |
|------|---------|
| `styles/globals.css` | Design system foundation |
| `tailwind.config.ts` | Tailwind customization |
| `lib/animations.ts` | Animation variants |
| `components/ui/*` | Base components |
| `components/Sidebar.tsx` | Navigation |
| `components/TopBar.tsx` | Header |
| `components/DashboardLayout.tsx` | Layout wrapper |
| `components/PageHeader.tsx` | Page titles |
| `components/StatCard.tsx` | Stat displays |
| `components/ChatUI.tsx` | Chat interface |
| `components/PremiumComponents.tsx` | Premium wrappers |
| `components/EmptyState.tsx` | Empty state |

---

## Next Steps

1. ✅ Design system created
2. ✅ Components upgraded
3. ✅ Animations set up
4. 📝 Update existing pages with new components
5. 📝 Add remaining dashboard pages
6. 📝 Test and optimize
7. 📝 Deploy

---

## Support

For questions or issues:
1. Check PREMIUM_UI_SYSTEM.md for reference
2. Review example components
3. Check Framer Motion docs: https://www.framer.com/motion/
4. Check Tailwind docs: https://tailwindcss.com/

