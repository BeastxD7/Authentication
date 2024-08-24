import React from 'react'
import {motion} from 'framer-motion'

const FloatingShape = ( {color ,size , top , left , delay} ) => {
  return (
    <motion.div
    className={`${color} ${size} absolute rounded-full opacity-20 blur-xl `}
    style={{top, left}}
    animate={{
        y: ["0%", "10%", "100%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
    }}

    transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
        }}
        aria-hidden="true"
    />
  )
}

export default FloatingShape