"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function FloatingPisoButton() {
  const pathname = usePathname()

  // Don't show on the Piso page itself
  if (pathname === "/piso") {
    return null
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        asChild
        size="lg"
        className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:shadow-xl transition-all"
      >
        <Link href="/piso" aria-label="Ask Piso">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 3,
            }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
        </Link>
      </Button>
    </motion.div>
  )
}
