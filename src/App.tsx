import { useState } from 'react'
import {motion} from 'motion/react'

function App() {

  return (
    <div>
       <motion.div className="box" 
       initial={{ x: 0}}
        animate={{ x: 200}}
        // transition={{duration: 5}}   
    transition={{duration: 2,ease: "linear"}}
        >
        
        </motion.div>
    </div>
  )
}

export default App
