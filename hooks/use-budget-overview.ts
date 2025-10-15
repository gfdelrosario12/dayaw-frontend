"use client"

import useSWR from "swr"

export interface BudgetOverview {
  totalBudget: number
  activeAgencies: number
  ongoingProjects: number
  disbursementRate: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useBudgetOverview() {
  const { data, error, isLoading } = useSWR<BudgetOverview>("/api/overview", fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    data,
    isLoading,
    error,
  }
}
