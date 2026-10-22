import { motion } from "motion/react";
import { useState } from "react";
import React from 'react'

const AnimatedGallery = () => {
    const [showImages,setShowImages] = useState(false)
    const handleClick = () => setShowImages((prev) => !prev);
  return (
    <div>AnimatedGallery</div>
  )
}

export default AnimatedGallery