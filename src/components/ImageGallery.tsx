import { motion } from 'motion/react'
const images = [
  { src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { src: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { src: "https://images.unsplash.com/photo-1493244040629-496f6d136cc3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" },
  { src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D" }
]

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.1 },
}

const overlayVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

const ImageGallery = () => {
  return (
    <div className="grid w-[80%] grid-cols-2 gap-4 md:grid-cols-3">
     {images.map((image, index) => (
        <motion.div
          key={index}
          className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg shadow-lg"
          initial="rest"
          whileHover="hover"
          animate="rest"
        >
            <motion.img
              src={image.src}
              alt={`Gallery image ${index + 1}`}
              className="h-full w-full object-cover"
              variants={imageVariants}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/50"
              variants={overlayVariants}
              transition={{ duration: 0.3 }}
            >
                <span className="text-lg font-bold text-white">View Details</span>
            </motion.div>
        </motion.div>
     ))}
    </div>
  )
}

export default ImageGallery
