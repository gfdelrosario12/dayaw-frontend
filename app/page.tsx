"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { useBudgetOverview } from "@/hooks/use-budget-overview"
import {
  ArrowRight,
  BookOpen,
  BarChart3,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

function HomeContent() {
  const { t } = useLanguage()
  const { data, isLoading } = useBudgetOverview()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Clean, no glow or special background effects */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-card">
          {/* --- Removed all Luminous Animated Lights (motion.divs) --- */}

          {/* --- Hero Content --- */}
          <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
            <div className="mx-auto max-w-4xl text-center">

              {/* Simplified H1 - Removed drop-shadow */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-bold tracking-tight text-foreground md:text-6xl text-balance"
              >
                <span className="inline-block relative z-10">
                  {t("Transparency in Every Peso", "Transparency sa Bawat Piso")}
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty"
              >
                {t(
                  "Track Philippine government budget allocation, planning progress, and disbursement in real-time. Empowering citizens with open fiscal data.",
                  "Subaybayan ang paglalaan ng badyet ng gobyerno ng Pilipinas, progreso ng pagpaplano, at paglalabas ng pondo sa real-time. Pagbibigay ng kapangyarihan sa mga mamamayan gamit ang bukas na datos ng pananalapi."
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-10 flex flex-wrap items-center justify-center gap-4"
              >
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/education">
                    <BookOpen className="mr-2 h-5 w-5" />
                    {t("Learn How The PH Budget is Passed", "Alamin Kung Paano Ipasa ang Badyet ng Pilipinas")}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Explore Budget Data Section (No changes here) */}
        <section className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-20">
            <ScrollReveal>
              <h2 className="mb-14 text-center text-3xl font-bold text-foreground">
                {t("Explore Budget Data", "Tuklasin ang Datos ng Budget")}
              </h2>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Educational Module */}
              <ScrollReveal delay={0}>
                <Link
                  href="/education"
                  className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1"
                >

                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                      <BookOpen className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {t("Educational Module", "Modyul ng Edukasyon")}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        "Learn how the Philippine budget process works from NEP to disbursement.",
                        "Alamin kung paano gumagana ang proseso ng badyet ng Pilipinas mula NEP hanggang paglalabas."
                      )}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent">
                    {t("Start Learning", "Magsimulang Matuto")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>

              {/* Interactive Dashboard */}
              <ScrollReveal delay={0.2}>
                <Link
                  href="/dashboard"
                  className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                      <BarChart3 className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {t("Interactive Dashboard", "Interactive Dashboard")}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        "Visualize budget data with charts, maps, and interactive filters.",
                        "Ipakita ang datos ng badyet gamit ang mga tsart, mapa, at interactive na filter."
                      )}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent">
                    {t("Open Dashboard", "Buksan ang Dashboard")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>

              {/* Ask Piso */}
              <ScrollReveal delay={0.3}>
                <Link
                  href="/piso"
                  className="group flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border bg-background p-8 transition-all duration-300 hover:border-accent hover:shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10">
                      <MessageSquare className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      {t("Ask Piso - The AI Budget Explainer", "Tanungin si Piso - Isang AI Budget Explainer")}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        "Get instant answers about budget terms, processes, and data. Piso is your AI assistant for understanding Philippine fiscal transparency.",
                        "Makakuha ng instant na sagot tungkol sa mga termino, proseso, at datos ng badyet. Si Piso ay iyong AI assistant para sa pag-unawa sa transparency ng pananalapi ng Pilipinas."
                      )}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-accent">
                    {t("Chat with Piso", "Makipag-chat kay Piso")}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function Home() {
  return (
    <LanguageProvider>
      <HomeContent />
    </LanguageProvider>
  )
}
