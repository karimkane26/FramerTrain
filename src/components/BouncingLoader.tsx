import React from 'react'
import { motion } from 'motion/react'
const BouncingLoader = () => {
  return (
    <div>
        <div className="flex justify-center items-center space-x-2">
            {[ ...Array(5)].map((_,index) => (
                <motion.div key={index}
                className='w-4 h-4 bg-teal-500 rounded-full'
                animate={{y:[0,-15,0]}}
                transition={{
                    duration: 0.6,
                    ease:"easeInOut",
                    repeat: Infinity,
                   
                    repeatDelay: index * 0.2
                }}
                >
                    
                </motion.div>
            ))}
        </div>
    </div>
  )
}

export default BouncingLoader