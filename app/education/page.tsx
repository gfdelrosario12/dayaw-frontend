"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { StageCard } from "@/components/stage-card"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { useEducation } from "@/hooks/use-education"
import { MessageSquare, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

function EducationContent() {
  const { t, language } = useLanguage()
  const { data, isLoading } = useEducation()
  const [activeStage, setActiveStage] = useState<number>(0)

  // Fallback data for demonstration
  const stages = data || [
    {
      id: "1",
      title: "NEP - National Expenditure Program",
      titleFil: "NEP - National Expenditure Program",
      description:
        "The President submits the proposed budget to Congress. This includes detailed spending plans for all government agencies and programs for the upcoming fiscal year.",
      descriptionFil:
        "Isinusumite ng Pangulo ang iminungkahing badyet sa Kongreso. Kasama dito ang detalyadong plano ng paggastos para sa lahat ng ahensya at programa ng gobyerno para sa susunod na taon.",
      order: 1,
      icon: "file-text",
    },
    {
      id: "2",
      title: "GAB - General Appropriations Bill",
      titleFil: "GAB - General Appropriations Bill",
      description:
        "Congress reviews, debates, and modifies the proposed budget. Both the House of Representatives and Senate conduct hearings and deliberations before passing their versions.",
      descriptionFil:
        "Sinusuri, pinagdedebatehan, at binabago ng Kongreso ang iminungkahing badyet. Ang Kapulungan ng mga Kinatawan at Senado ay nagsasagawa ng mga pagdinig at deliberasyon bago ipasa ang kanilang mga bersyon.",
      order: 2,
      icon: "users",
    },
    {
      id: "3",
      title: "GAA - General Appropriations Act",
      titleFil: "GAA - General Appropriations Act",
      description:
        "After reconciliation between House and Senate versions, the final budget is signed into law by the President. This becomes the official budget for the fiscal year.",
      descriptionFil:
        "Pagkatapos ng reconciliation sa pagitan ng bersyon ng Kapulungan at Senado, ang huling badyet ay nilagdaan ng Pangulo bilang batas. Ito ang opisyal na badyet para sa taon.",
      order: 3,
      icon: "check-circle",
    },
    {
      id: "4",
      title: "Disbursement - Fund Release",
      titleFil: "Paglalabas - Paglabas ng Pondo",
      description:
        "Government agencies receive and spend their allocated budgets according to approved programs and projects. This stage involves actual implementation and monitoring of expenditures.",
      descriptionFil:
        "Tumatanggap at gumagastos ang mga ahensya ng gobyerno ng kanilang inilaan na badyet ayon sa mga aprubadong programa at proyekto. Kasama sa yugtong ito ang aktwal na pagpapatupad at pagsubaybay ng mga gastusin.",
      order: 4,
      icon: "trending-up",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-gradient-to-b from-background to-card">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
                {t("How the Philippine Budget Works", "Paano Gumagana ang Badyet ng Pilipinas")}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                {t(
                  "Understanding the budget process from proposal to implementation. Learn how your tax money is planned, approved, and spent.",
                  "Pag-unawa sa proseso ng badyet mula sa panukala hanggang sa pagpapatupad. Alamin kung paano pinaplano, inaprubahan, at ginagastos ang iyong buwis.",
                )}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                {t("The Budget Cycle", "Ang Siklo ng Badyet")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Follow the four main stages of the Philippine budget process",
                  "Sundin ang apat na pangunahing yugto ng proseso ng badyet ng Pilipinas",
                )}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-12 flex items-center justify-between">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex flex-1 items-center">
                  <button
                    onClick={() => setActiveStage(index)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      activeStage === index
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    {index + 1}
                  </button>
                  {index < stages.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${activeStage > index ? "bg-accent" : "bg-border"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Stage Cards */}
            <div className="space-y-6">
              {stages.map((stage, index) => (
                <StageCard
                  key={stage.id}
                  title={language === "en" ? stage.title : stage.titleFil}
                  description={language === "en" ? stage.description : stage.descriptionFil}
                  order={stage.order}
                  isActive={activeStage === index}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Explainer Section */}
        <section className="border-t border-border bg-card">
          <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-3xl text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <MessageSquare className="h-8 w-8 text-accent" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t("Have Questions About the Budget?", "May Tanong Tungkol sa Badyet?")}
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {t(
                    "Ask Piso, our AI assistant, to explain budget terms, processes, and data in simple language.",
                    "Tanungin si Piso, ang aming AI assistant, upang ipaliwanag ang mga termino, proseso, at datos ng badyet sa simpleng wika.",
                  )}
                </p>
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Link href="/piso">
                    {t("Chat with Piso", "Makipag-chat kay Piso")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Key Terms Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t("Key Budget Terms", "Mga Pangunahing Termino ng Badyet")}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  term: "Appropriation",
                  termFil: "Appropriation",
                  definition: "Legal authorization to spend public funds for specific purposes",
                  definitionFil: "Legal na pahintulot na gumastos ng pampublikong pondo para sa mga tiyak na layunin",
                },
                {
                  term: "Obligation",
                  termFil: "Obligasyon",
                  definition: "Commitment made by government to pay for goods or services",
                  definitionFil: "Pangako ng gobyerno na magbayad para sa mga kalakal o serbisyo",
                },
                {
                  term: "Disbursement",
                  termFil: "Paglalabas",
                  definition: "Actual release of funds from government accounts",
                  definitionFil: "Aktwal na paglabas ng pondo mula sa mga account ng gobyerno",
                },
                {
                  term: "Fiscal Year",
                  termFil: "Taon ng Pananalapi",
                  definition: "12-month period for budget planning and execution (Jan 1 - Dec 31)",
                  definitionFil:
                    "12 buwang panahon para sa pagpaplano at pagpapatupad ng badyet (Enero 1 - Disyembre 31)",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-border bg-card p-6"
                >
                  <h3 className="text-lg font-bold text-accent mb-2">{language === "en" ? item.term : item.termFil}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "en" ? item.definition : item.definitionFil}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function EducationPage() {
  return (
    <LanguageProvider>
      <EducationContent />
    </LanguageProvider>
  )
}
