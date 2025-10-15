"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import PisoImg from "@/public/piso.png"


export default function PisoWave() {
  return (
    <motion.div
      className="fixed bottom-[10%] right-[5%] z-50 pointer-events-none"
      animate={{
        rotate: [0, 10, -10, 0],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Image
        src={PisoImg}
        alt="Piso waving"
        width={160}
        height={160}
        className="opacity-90 drop-shadow-lg select-none"
        priority
      />
    </motion.div>
  )
}
