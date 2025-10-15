"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface OverviewCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  isLoading?: boolean
}

export function OverviewCard({ title, value, subtitle, icon: Icon, isLoading }: OverviewCardProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <h3 className="mt-2 text-3xl font-bold text-foreground">{value}</h3>
              {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.2 }}
              className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10"
            >
              <Icon className="h-6 w-6 text-accent" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
