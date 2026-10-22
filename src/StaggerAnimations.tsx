import React from 'react'
import { motion } from 'motion/react' 
const parentVarients = {
    hidden: { opacity: 0 },
    visible:{
        opacity: 1,
        transition:{
            staggerChildren: 0.8
        }
    }
}
const StaggerAnimations = () => {
  return (
    <div>
       {[...Array(5)].map((_,index) => (
        <motion.div 
        key={index}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 ,ease: "easeInOut"}}
        >
        <h1 className="text-xl font-bold text-black">Stagger Animations</h1>

        </motion.div>
      ))}
    </div>
    )
}

export default StaggerAnimations