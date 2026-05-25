"use client"

import { ReactLenis } from "lenis/react"
import { ReactNode } from "react"

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 0.6,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.2,
        infinite: false,
        syncTouch: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
