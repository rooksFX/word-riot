import Lottie from 'lottie-react'
import React from 'react'
import animationData from '@/assets/confetti_won.json';

export const Won = ({ onAnimationEnd }: { onAnimationEnd: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">You won!</h1>
      <Lottie animationData={animationData} loop={false} onComplete={onAnimationEnd} />
    </div>
  )
}
