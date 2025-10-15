"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "fil"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, fil: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (en: string, fil: string) => (language === "en" ? en : fil)

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }
  return context
}
