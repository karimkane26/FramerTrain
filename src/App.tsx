import {motion} from 'motion/react'
import PulsingButton from './components/PulsingButton'
import BouncingLoader from './components/BouncingLoader'
import './index.css'
function App() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
       {/* <motion.div className="size-75 rounded-full bg-yellow-300"
       initial={{ x: 0}}
        // animate={{ x: 200}}
        // transition={{duration: 5}}
        animate={{
          // scale: [1,2,3,4,5,6,7]
          rotate:[0,0,270,270,0],
          borderRadius: ["20%","20%","50%","50%","20%"]
        }}
    // transition={{duration: 2,ease: "linear"}}
    transition={{duration: 5}}

        >

        </motion.div> */}

        {/* <BouncingLoader /> */}

        <motion.div
        className='box'
         variants={{
          hidden: {opacity: 0,scale: 0},
          visible: {opacity:1,scale: 1}
        }}
        >
        </motion.div>
    </div>
  )
}

export default App
