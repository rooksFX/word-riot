import Lottie from 'lottie-react'
import React from 'react'
import animationData from '@/assets/cross_lose.json';

export const Lose = ({ onAnimationEnd }: { onAnimationEnd: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">You lose!</h1>
      <Lottie animationData={animationData} loop={false} onComplete={onAnimationEnd} />
    </div>
  )
}
