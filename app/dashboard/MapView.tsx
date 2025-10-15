"use client"

import { FC, useState, useCallback } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import phRegionsGeo from "./PHL.geo.json"

interface Region {
  region: string
  value: number
}

interface MapViewProps {
  regions: Region[]
}

export const MapView: FC<MapViewProps> = ({ regions }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [clickedRegion, setClickedRegion] = useState<Region | null>(null)

  const regionValueMap = regions.reduce<Record<string, number>>((acc, r) => {
    acc[r.region] = r.value
    return acc
  }, {})

  const maxValue = Math.max(...regions.map(r => r.value), 0)
  const colorScale = scaleLinear<string>()
    .domain([0, maxValue])
    .range(["#dbeafe", "#1e3a8a"]) // light → dark blue

  const handleClick = useCallback(
    (geo: any) => {
      const name = geo.properties.NAME_1 || geo.properties.name
      const value = regionValueMap[name] || 0
      setClickedRegion({ region: name, value })
    },
    [regionValueMap]
  )

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {/* Hover tooltip */}
      {hoveredRegion && (
        <div className="absolute z-20 px-2 py-1 bg-white/80 border border-gray-300 rounded text-sm pointer-events-none backdrop-blur-sm">
          <span className="font-medium">{hoveredRegion}</span>: ₱
          {regionValueMap[hoveredRegion]?.toLocaleString() || 0}M
        </div>
      )}

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2000, center: [121, 13.5] }}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={phRegionsGeo}>
          {({ geographies }) =>
            geographies.map(geo => {
              const name = geo.properties.NAME_1 || geo.properties.name
              const value = regionValueMap[name] || 0
              const isSelected = clickedRegion?.region === name
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(value)}
                  stroke={isSelected ? "#facc15" : "#fff"}
                  strokeWidth={isSelected ? 2 : 1}
                  onMouseEnter={() => setHoveredRegion(name)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => handleClick(geo)}
                  style={{
                    default: { outline: "none", transition: "all 0.2s" },
                    hover: { outline: "none", cursor: "pointer", opacity: 0.85 },
                    pressed: { outline: "none" },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Clicked region info panel */}
      {clickedRegion && (
        <div className="absolute bottom-4 left-4 p-3 bg-white/80 border border-gray-300 rounded text-sm backdrop-blur-sm">
          <h3 className="font-bold text-blue-700 mb-1">{clickedRegion.region}</h3>
          <p className="text-gray-800">
            <span className="font-medium">Budget:</span> ₱
            {clickedRegion.value.toLocaleString()}M
          </p>
        </div>
      )}
    </div>
  )
}
