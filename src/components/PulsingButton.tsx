import { motion } from "motion/react"

const PulsingButton = () => {
  return (
    <motion.button
      className="cursor-pointer rounded-full bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/40"
    animate={{
        scale: [1,1.1,1],
        backgroundColor: ["#3b82f6","#60a5fa","#3b82f6"],
    }}
    transition={{duration: 0.8,ease:"easeInOut",repeat: Infinity}}
    >
      Cliquer moi
    </motion.button>
  )
}

export default PulsingButton
