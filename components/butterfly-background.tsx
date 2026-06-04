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
      {/* Subtle dark vignette so text stays readable while butterfly glows through */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(5,7,10,0.55) 0%, rgba(5,7,10,0.85) 100%)' 
        }} 
      />
    </div>
  )
}
