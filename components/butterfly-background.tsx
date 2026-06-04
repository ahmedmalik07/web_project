'use client'

import dynamic from 'next/dynamic'

const ButterflyCanvas = dynamic(() => import('./butterfly-canvas'), {
  ssr: false,
})

export function ButterflyBackground() {
  return <ButterflyCanvas />
}
