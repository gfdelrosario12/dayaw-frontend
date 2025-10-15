"use client"

import useSWR from "swr"

export interface EducationStage {
  id: string
  title: string
  titleFil: string
  description: string
  descriptionFil: string
  order: number
  icon: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useEducation() {
  const { data, error, isLoading } = useSWR<EducationStage[]>("/api/education", fetcher)

  return {
    data,
    isLoading,
    error,
  }
}
