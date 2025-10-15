"use client"

import useSWR from "swr"

export interface Agency {
  id: string
  name: string
  stage: "NEP" | "GAB" | "GAA" | "Disbursement"
  progress: number
  region: string
  sector: string
  lastUpdate: string
  budget: number
}

export interface AgenciesFilters {
  region?: string
  sector?: string
  year?: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAgencies(filters?: AgenciesFilters) {
  const params = new URLSearchParams()
  if (filters?.region) params.append("region", filters.region)
  if (filters?.sector) params.append("sector", filters.sector)
  if (filters?.year) params.append("year", filters.year.toString())

  const { data, error, isLoading } = useSWR<Agency[]>(`/api/agencies?${params.toString()}`, fetcher, {
    refreshInterval: 60000, // Refresh every minute
  })

  return {
    data,
    isLoading,
    error,
  }
}
