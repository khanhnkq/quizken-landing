'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface MascotFallbackProps {
  emotion?: string
  size?: number
  className?: string
}

const EMOTION_MAP: Record<string, string> = {
  happy: '/images/mascot/happy.png',
  cool: '/images/mascot/cool.png',
  cheeky: '/images/mascot/cheeky.png',
  angry: '/images/mascot/angry.png',
  sleepy: '/images/mascot/sleepy.png',
  crying: '/images/mascot/crying.png',
  cry: '/images/mascot/cry.png',
  surprised: '/images/mascot/surprised.png',
  amazed: '/images/mascot/amazed.png',
  love: '/images/mascot/cute.png',
  cute: '/images/mascot/cute.png',
  laughing: '/images/mascot/happy.png',
  flustered: '/images/mascot/shy.png',
  shy: '/images/mascot/shy.png',
  confused: '/images/mascot/confused.png',
  party: '/images/mascot/party.png',
}

const DEFAULT_IMAGE = '/images/mascot/happy.png'

export function MascotFallback({
  emotion = 'happy',
  size = 280,
  className = '',
}: MascotFallbackProps) {
  const targetSrc = EMOTION_MAP[emotion] || `/images/mascot/${emotion}.png`
  const [currentSrc, setCurrentSrc] = useState(targetSrc)

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={currentSrc}
        alt={`Quizken Green Cat Mascot (${emotion})`}
        width={size}
        height={size}
        priority
        className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-300 hover:scale-105"
        onError={() => {
          if (currentSrc !== DEFAULT_IMAGE) {
            setCurrentSrc(DEFAULT_IMAGE)
          }
        }}
      />
    </div>
  )
}

export default MascotFallback
