import React from 'react'
import { motion } from 'motion/react'
const AnimatedCard = () => {
  return (
    <motion.div 
    initial={{ scale: 1, rotate: 0 }}
    whileHover={{scale: 1.05, rotate: 3}}
    whileTap={{scale: 0.95, rotate: -3}}
    animate={{ scale: 1, y: 0 }}
    transition={{type: "spring", stiffness: 300}} 
    drag
    dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
    className="max-w-sm bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer">
      <img src="https://images.unsplash.com/photo-1790274742572-d2ff9202218b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" alt="Card images" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Card Title</h2>
        <p className="text-gray-700">This is a simple animated card component built with React and Tailwind CSS.</p>
        <button className="px-4 py-2 text-white rounded bg-blue-500 hover:bg-blue-600 transition ">Get Started</button>s
      </div>
    </motion.div>
  )
}

export default AnimatedCard 