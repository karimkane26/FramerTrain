import React from 'react'
import {useState} from 'react'

const FlippingCard = () => {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="perspective-1000">
      <div className="w-64 h-40 rounded-lg shadow-lg overflow-hidden transform-style-preserve-3d ">
       <div className="absolute inset-0 bg-white flex items-center justify-center text-xl font-bold ">
         <p className="text-gray-800">Front</p>
       </div>

     <div className="absolute inset-0 bg-blue-500 flex items-center justify-center text-xl font-bold text-gray-800 rotate-y-180 ">
         <p className="text-gray-800">Back Side</p>
       </div>

       
      </div>
      
    </div>
  )
}

export default FlippingCard