import { useState } from 'react'
import { motion } from 'motion/react'
import cardVariants from '../variants'
const FlippingCard = () => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // const cardVariants = {
  //   front: { rotateY: 0 },
  //   back: { rotateY: 180 },
  // }

  return (
    <div className="perspective-[1000px]">
      <motion.div
        onClick={handleFlip}
        variants={cardVariants}
        initial="front"
        animate={isFlipped ? "back" : "front"}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-64 h-40 transform-3d cursor-pointer"
      >
        <div className="absolute inset-0 backface-hidden rounded-lg shadow-lg bg-white flex items-center justify-center text-xl font-bold">
          <p className="text-gray-800">Front</p>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-lg shadow-lg bg-blue-500 flex items-center justify-center text-xl font-bold">
          <p className="text-white">Back Side</p>
        </div>
      </motion.div>
    </div>
  )
}

export default FlippingCard
