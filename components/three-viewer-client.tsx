'use client'

import dynamic from 'next/dynamic'

// Dynamically import the ThreeViewer component with SSR disabled
const ThreeViewerComponent = dynamic(
  () => import('./three-viewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-2" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loading 3D Engine...</span>
      </div>
    )
  }
)

interface ThreeViewerWrapperProps {
  type: 'trophy' | 'ball' | 'bat' | 'glb'
  glbUrl?: string
}

export function ThreeViewerClient({ type, glbUrl }: ThreeViewerWrapperProps) {
  return <ThreeViewerComponent type={type} glbUrl={glbUrl} />
}
