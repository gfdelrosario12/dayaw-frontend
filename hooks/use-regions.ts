"use client"

import useSWR from "swr"

export interface RegionData {
  id: string
  name: string
  budget: number
  disbursed: number
  projects: number
  coordinates: [number, number]
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useRegions() {
  const { data, error, isLoading } = useSWR<RegionData[]>("/api/regions", fetcher)

  return {
    data,
    isLoading,
    error,
  }
}

export function useRegionDetail(regionId: string) {
  const { data, error, isLoading } = useSWR<RegionData>(regionId ? `/api/regions/${regionId}` : null, fetcher)

  return {
    data,
    isLoading,
    error,
  }
}
