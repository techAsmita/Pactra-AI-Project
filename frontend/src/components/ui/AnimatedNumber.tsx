import React, { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion'

interface AnimatedNumberProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

/** Smoothly counts up to a target number on mount/change — used for
 *  confidence scores and key stats so numbers feel alive rather than static. */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, suffix = '', duration = 0.8, className }) => {
  const reduced = useReducedMotion()
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, v => `${Math.round(v)}${suffix}`)
  const prevValue = useRef(0)

  useEffect(() => {
    if (reduced) {
      motionValue.set(value)
      prevValue.current = value
      return
    }
    const controls = animate(motionValue, value, { duration, ease: [0, 0, 0.2, 1] })
    prevValue.current = value
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <motion.span className={className}>{rounded}</motion.span>
}
