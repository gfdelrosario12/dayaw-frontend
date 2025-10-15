"use client"

import { Card } from "@/components/ui/card"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { motion } from "framer-motion"
import { Sparkles, BookOpen, TrendingUp, HelpCircle } from "lucide-react"
import { ChatPiso } from "./chat-piso"
import { Navbar } from "@/components/layout/navbar"

function PisoContent() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-border bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                {t("Ask Piso - AI Budget Explainer", "Tanungin si Piso - AI Budget Explainer")}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                {t(
                  "Get instant answers about Philippine budget processes, terms, and data in simple language",
                  "Makakuha ng instant na sagot tungkol sa mga proseso, termino, at datos ng badyet ng Pilipinas sa simpleng wika",
                )}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card className="border-border bg-card overflow-hidden">
                <ChatPiso />
              </Card>
            </motion.div>
          </div>
        </section>

        <section className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-16">
            <h2 className="mb-12 text-center text-2xl font-bold text-foreground">
              {t("What Piso Can Help You With", "Ano ang Maitutulong ni Piso")}
            </h2>

            <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <BookOpen className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t("Explain Budget Terms", "Ipaliwanag ang mga Termino")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Understand complex budget terminology in simple, everyday language",
                    "Unawain ang kumplikadong terminolohiya ng badyet sa simpleng, pang-araw-araw na wika",
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t("Analyze Budget Data", "Suriin ang Datos ng Badyet")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Get insights about agency budgets, regional allocations, and spending trends",
                    "Makakuha ng insights tungkol sa badyet ng ahensya, paglalaan sa rehiyon, at mga uso sa paggastos",
                  )}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <HelpCircle className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {t("Answer Questions", "Sagutin ang mga Tanong")}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(
                    "Ask anything about the budget process, from planning to disbursement",
                    "Magtanong tungkol sa proseso ng badyet, mula sa pagpaplano hanggang paglalabas",
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function PisoPage() {
  return (
    <LanguageProvider>
      <PisoContent />
    </LanguageProvider>
  )
}