"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useRegions, useRegionDetail } from "@/hooks/use-regions"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function MapView() {
  const { data: regions, isLoading } = useRegions()
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const { data: regionDetail } = useRegionDetail(selectedRegion || "")

  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Regional Budget Map</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    )
  }

  // Placeholder regions for visualization
  const placeholderRegions = [
    { id: "ncr", name: "NCR", budget: 450000000000, disbursed: 320000000000, projects: 1250, x: 50, y: 60 },
    { id: "car", name: "CAR", budget: 85000000000, disbursed: 62000000000, projects: 340, x: 48, y: 45 },
    { id: "r1", name: "Region I", budget: 120000000000, disbursed: 89000000000, projects: 480, x: 45, y: 35 },
    { id: "r3", name: "Region III", budget: 180000000000, disbursed: 135000000000, projects: 620, x: 52, y: 52 },
    { id: "r4a", name: "Region IV-A", budget: 210000000000, disbursed: 168000000000, projects: 780, x: 55, y: 68 },
    { id: "r7", name: "Region VII", budget: 165000000000, disbursed: 124000000000, projects: 540, x: 68, y: 75 },
    { id: "r11", name: "Region XI", budget: 145000000000, disbursed: 108000000000, projects: 460, x: 72, y: 88 },
  ]

  const displayRegions = regions || placeholderRegions

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-lg">Regional Budget Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-96 w-full rounded-lg bg-muted/30 overflow-hidden">
          {/* SVG Map Placeholder */}
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {/* Philippines outline (simplified) */}
            <path
              d="M 45 30 L 50 25 L 55 30 L 58 35 L 60 45 L 58 55 L 55 65 L 52 75 L 48 85 L 45 90 L 42 85 L 40 75 L 38 65 L 40 55 L 42 45 L 43 35 Z M 65 70 L 70 68 L 75 72 L 78 78 L 75 85 L 70 88 L 65 85 L 62 78 L 64 72 Z"
              fill="oklch(0.25 0.02 240)"
              stroke="oklch(0.4 0.02 240)"
              strokeWidth="0.5"
            />

            {/* Region markers */}
            {displayRegions.map((region) => {
              const size = Math.max(3, Math.min(8, (region.budget / 50000000000) * 2))
              return (
                <g key={region.id}>
                  <motion.circle
                    cx={region.x}
                    cy={region.y}
                    r={size}
                    fill="oklch(0.85 0.15 85)"
                    opacity={0.7}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2, opacity: 1 }}
                    onClick={() => setSelectedRegion(region.id)}
                  />
                  <text
                    x={region.x}
                    y={region.y - size - 2}
                    textAnchor="middle"
                    fill="oklch(0.98 0 0)"
                    fontSize="3"
                    className="pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Region Detail Popup */}
          <AnimatePresence>
            {selectedRegion && regionDetail && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-4 right-4 w-64 rounded-lg border border-border bg-card p-4 shadow-lg"
              >
                <button
                  onClick={() => setSelectedRegion(null)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
                <h3 className="text-lg font-bold text-accent mb-3">{regionDetail.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-mono font-medium">₱{(regionDetail.budget / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disbursed:</span>
                    <span className="font-mono font-medium">₱{(regionDetail.disbursed / 1e9).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="font-medium">{regionDetail.projects}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Utilization:</span>
                      <span className="font-medium text-accent">
                        {((regionDetail.disbursed / regionDetail.budget) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent opacity-70" />
            <span>Click regions for details</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Circle size = Budget allocation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
