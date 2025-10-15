"use client"

import Link from "next/link"
import Image from "next/image" // 1. Import next/image
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"
import { Menu, X } from "lucide-react"
import { useState } from "react"
// 2. Import the image file directly (adjust path as needed)
import DayawLogo from './Project Dayaw.png' 

export function Navbar() {
  const { language, setLanguage, t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: t("Home", "Tahanan") },
    { href: "/education", label: t("Learn", "Matuto") },
    { href: "/dashboard", label: t("Dashboard", "Dashboard") },
    { href: "/piso", label: t("Ask Piso", "Tanungin si Piso") },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              {/* 3. Use the Image component and the imported logo variable */}
              <Image 
                src={DayawLogo} 
                alt="Project Dayaw Logo" 
                className="h-8 w-8" 
                // Set the intrinsic size (required by next/image)
                width={32} 
                height={32} 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">Project Dayaw</span>
              <span className="text-xs text-muted-foreground">
                {t("Budget Transparency", "Transparency ng Budget")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "fil" : "en")}
              className="hidden md:flex"
            >
              {language === "en" ? "Filipino" : "English"}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "fil" : "en")}
                className="w-full"
              >
                {language === "en" ? "Switch to Filipino" : "Switch to English"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}