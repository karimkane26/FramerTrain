import { animate } from 'motion'
import { motion } from 'motion/react'


const parentVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1 ,
            transition: {
                staggerChildren: 0.8,
            }
        }
    }

const childVariants = {
    hidden: {opacity: 0,y:20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            repeat: Infinity,
            repeatType: 'reverse' as const,
        }
    },
    animate:{Infinity}
}

const StaggerAnimation = () => {
    
  return (
    <motion.div className='stagger-container' variants={parentVariants} initial='hidden' animate='visible'>
        {
            [...Array(5)].map((_,index) =>(
                <motion.div className='stagger-item'
                 key={index}
                 variants={childVariants}>
                </motion.div>
            ))
        }

    </motion.div>
  )
}

export default StaggerAnimation