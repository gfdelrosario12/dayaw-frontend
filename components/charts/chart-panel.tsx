"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { ReactNode } from "react"

// UPDATED INTERFACE
interface ChartPanelProps {
  title: string
  children: ReactNode
  isLoading?: boolean
  error?: Error
  // ADDED: Optional description for UX hints
  description?: string 
}

export function ChartPanel({ title, children, isLoading, error, description }: ChartPanelProps) {
  if (error) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center text-sm text-destructive">Error loading chart data</div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {/* ADDED: Description rendering for UX */}
        {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}