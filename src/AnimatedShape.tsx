import React from 'react'
import {motion} from 'motion/react'
const AnimatedShape = () => {
    const boxVariants = {
        initial: { scale: 1, rotate: 0 ,skew: 0
        },
        hover:{
            scale: 1.2,
            rotate: 15,
            skew: ' 10deg',
            transition: { duration: 0.3 }
        },
        click: {
            scale: 0.8,
            rotate: -15,
            transition: { duration: 0.3 }
        }
    }
  return (
    <div className='flex items-center justify-center h-screen'>
        <motion.div 
        className='w-40 h-40 bg-blue-500 rounded-lg'
        variants={boxVariants}
        initial="initial"
        whileHover="hover"
        whileTap="click"
        />
        
    </div>
  )
}

export default AnimatedShape