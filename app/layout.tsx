import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { FloatingPisoButton } from "@/components/floating-piso-button"
import "./globals.css"

export const metadata: Metadata = {
  title: "Project Dayaw - Budget Transparency Dashboard",
  description: "Open governance and fiscal transparency platform for the Philippines",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <FloatingPisoButton />
        <Analytics />
      </body>
    </html>
  )
}
