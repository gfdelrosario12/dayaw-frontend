"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"
import { CheckCircle2, Circle } from "lucide-react"

interface StageCardProps {
  title: string
  description: string
  order: number
  isActive?: boolean
  isLoading?: boolean
}

export function StageCard({ title, description, order, isActive, isLoading }: StageCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-6 rounded-full mb-4" />
          <Skeleton className="h-6 w-32 mb-3" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: order * 0.1 }}
    >
      <Card
        className={`border-2 transition-all ${
          isActive ? "border-accent bg-accent/5" : "border-border bg-card hover:border-accent/50"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {isActive ? (
                <CheckCircle2 className="h-8 w-8 text-accent" />
              ) : (
                <Circle className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                  {order}
                </span>
                <h3 className="text-xl font-bold text-foreground">{title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
