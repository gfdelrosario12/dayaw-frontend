"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Agency } from "@/hooks/use-agencies"
import { motion } from "framer-motion"

interface ProgressTableProps {
  data?: Agency[]
  isLoading?: boolean
}

const stageColors = {
  NEP: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  GAB: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  GAA: "bg-green-500/20 text-green-400 border-green-500/30",
  Disbursement: "bg-accent/20 text-accent border-accent/30",
}

export function ProgressTable({ data, isLoading }: ProgressTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">No agencies found matching your filters</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Agency</TableHead>
            <TableHead className="font-semibold">Stage</TableHead>
            <TableHead className="font-semibold">Progress</TableHead>
            <TableHead className="font-semibold">Region</TableHead>
            <TableHead className="font-semibold">Sector</TableHead>
            <TableHead className="font-semibold">Budget</TableHead>
            <TableHead className="font-semibold">Last Update</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((agency, index) => (
            <motion.tr
              key={agency.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              <TableCell className="font-medium">{agency.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className={stageColors[agency.stage]}>
                  {agency.stage}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={agency.progress} className="h-2 w-24" />
                  <span className="text-sm text-muted-foreground">{agency.progress}%</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{agency.region}</TableCell>
              <TableCell className="text-muted-foreground">{agency.sector}</TableCell>
              <TableCell className="font-mono text-sm">₱{(agency.budget / 1e6).toFixed(1)}M</TableCell>
              <TableCell className="text-sm text-muted-foreground">{agency.lastUpdate}</TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
