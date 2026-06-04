'use client'

import dynamic from 'next/dynamic'

// Dynamically import the viewer with SSR disabled
const ButterflyViewer = dynamic(() => import('./butterfly-viewer'), {
  ssr: false,
})

export function ButterflyBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <ButterflyViewer />
    </div>
  )
}
