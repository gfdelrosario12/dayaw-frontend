"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { StageCard } from "@/components/stage-card"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { useEducation } from "@/hooks/use-education"
import { MessageSquare, ArrowRight, DollarSign, Target, BookOpen, Users, Landmark, Gavel, FileCheck, ClipboardList } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import Piso from "../../public/piso.png"

// --- NEW DATA STRUCTURE FOR GAA HEADERS ---
const gaaHeaders = [
  {
    term: "DEPARTMENT / AGENCY",
    termFil: "KAGAWANAN / AHENSYA",
    definition: "The UACS codes identifying the major Department (Tier 1) and the specific Agency/Bureau (Tier 2) receiving the funds.",
    definitionFil: "Ang UACS codes na tumutukoy sa pangunahing Kagawaran (Tier 1) at ang tiyak na Ahensya/Kawanihan (Tier 2) na tumatanggap ng pondo.",
    keys: "DEPARTMENT, AGENCY, UACS_DPT_DSC, UACS_AGY_DSC",
  },
  {
    term: "PREXC ID",
    termFil: "PREXC ID (Program/Activity/Project)",
    definition: "The unique code and description for the specific Program, Activity, or Project being funded. This tells you the purpose of the expenditure.",
    definitionFil: "Ang natatanging code at deskripsyon para sa tiyak na Programa, Aktibidad, o Proyekto na pinopondohan. Sinasabi nito ang layunin ng paggastos.",
    keys: "PREXC_FPAP_ID, PREXC_LEVEL, DSC",
  },
  {
    term: "OPERATING UNIT / REGION",
    termFil: "OPERATING UNIT / REHIYON",
    definition: "The specific office, division, or geographical region (UACS_REG_ID) that is authorized to execute and manage the allocated funds.",
    definitionFil: "Ang tiyak na opisina, dibisyon, o heyograpikong rehiyon (UACS_REG_ID) na pinahintulutang magpatupad at mamahala sa inilaang pondo.",
    keys: "OPERUNIT, UACS_OPER_DSC, UACS_REG_ID",
  },
  {
    term: "FUND SOURCE",
    termFil: "PINAGMUMULAN NG PONDO",
    definition: "The code (FUNDCD) indicating the source of the money, such as General Funds (101) or Earmarked Funds (Special Account).",
    definitionFil: "Ang code (FUNDCD) na nagpapahiwatig ng pinagmulan ng pera, tulad ng General Funds (101) o Earmarked Funds (Special Account).",
    keys: "FUNDCD, UACS_FUNDSUBCAT_DSC",
  },
  {
    term: "EXPENDITURE OBJECT",
    termFil: "LAYUNIN NG GASTUSIN",
    definition: "The detailed classification of what the money is spent on (UACS_SOBJ_CD), such as salaries (Personnel Services), utilities (MOOE), or equipment (Capital Outlays).",
    definitionFil: "Ang detalyadong klasipikasyon kung saan ginagastos ang pera, tulad ng sahod (Personnel Services), utilities (MOOE), o kagamitan (Capital Outlays).",
    keys: "UACS_EXP_CD, UACS_EXP_DSC, UACS_SOBJ_CD, UACS_SOBJ_DSC, AMT",
  },
];
// --- END NEW DATA STRUCTURE ---


function EducationContent() {
  const { t, language } = useLanguage()
  const { data, isLoading } = useEducation()
  const [activeStage, setActiveStage] = useState<number>(0)
  // Ref for the Stage Cards Container
  const stageCardsRef = useRef<HTMLDivElement>(null)

  // Full four-phase budget cycle for display
  const stages = data || [
    {
      id: "1",
      title: t("Budget Preparation (NEP)", "Paghanda ng Badyet (NEP)"),
      titleFil: "Paghanda ng Badyet (NEP)",
      description:
        "The DBM issues the Budget Call. Government agencies, in consultation with stakeholders, submit proposals. The DBM consolidates these into the National Expenditure Program (NEP) for the President's approval and submission to Congress.",
      descriptionFil:
        "Ang DBM ay naglalabas ng Budget Call. Ang mga ahensya ng gobyerno, sa konsultasyon sa mga stakeholder, ay nagsumite ng mga panukala. Pinagsama-sama ito ng DBM sa National Expenditure Program (NEP) para sa pag-apruba ng Pangulo at pagsusumite sa Kongreso.",
      order: 1,
      icon: "file-text",
    },
    {
      id: "2",
      title: t("Budget Legislation (GAB)", "Paggawa ng Batas (GAB)"),
      titleFil: "Paggawa ng Batas (GAB)",
      description:
        "The House Committee on Appropriations conducts initial review. The Senate Committee on Finance conducts its own. Differences are reconciled in the Bicameral Conference Committee before the final General Appropriations Bill (GAB) is sent to the President.",
      descriptionFil:
        "Ang House Committee on Appropriations ang nagsasagawa ng unang pagsusuri. Ang Senate Committee on Finance ay nagsasagawa ng sarili nitong. Inaayos ang mga pagkakaiba sa Bicameral Conference Committee bago ipadala ang huling General Appropriations Bill (GAB) sa Pangulo.",
      order: 2,
      icon: "users",
    },
    {
      id: "3",
      title: t("Budget Execution (GAA)", "Pagpapatupad ng Badyet (GAA)"),
      titleFil: "Pagpapatupad ng Badyet (GAA)",
      description:
        "The President signs the GAB into the General Appropriations Act (GAA), or vetoes specific line-items. The DBM then issues the Allotments and Notice of Cash Allocations (NCAs) that authorize agencies to incur obligations and spend the funds.",
      descriptionFil:
        "Nilalagdaan ng Pangulo ang GAB bilang General Appropriations Act (GAA), o bina-veto ang ilang line-items. Naglalabas ang DBM ng mga Allotment at Notice of Cash Allocations (NCAs) na nagpapahintulot sa mga ahensya na gumastos ng pondo.",
      order: 3,
      icon: "check-circle",
    },
    {
      id: "4",
      title: t("Budget Accountability", "Pananagutan sa Badyet"),
      titleFil: "Pananagutan sa Badyet",
      description:
        "Government agencies submit accountability reports to show how funds were utilized against physical and financial performance targets. The Commission on Audit (COA) examines these reports to ensure legality and efficiency.",
      descriptionFil:
        "Nagsusumite ang mga ahensya ng gobyerno ng mga ulat ng pananagutan upang ipakita kung paano ginamit ang mga pondo laban sa mga target sa pisikal at pinansyal na pagganap. Sinusuri ng Commission on Audit (COA) ang mga ulat na ito upang matiyak ang legalidad at kahusayan.",
      order: 4,
      icon: "trending-up",
    },
  ]

  // Handler for stage click
  const handleStageClick = (index: number) => {
    setActiveStage(index)
    // Scroll to the top of the stage cards container
    if (stageCardsRef.current) {
      stageCardsRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Current key budget officials (Using titles from the search results, caveated with note)
  const currentOfficials = [
    {
      name: t("The President", "Ang Pangulo"),
      role: t("Chief Executive; Final authority on the GAA (Veto Power)", "Punong Ehekutibo; Huling awtoridad sa GAA (Veto Power)"),
      icon: Landmark,
    },
    {
      name: t("DBM Secretary", "Kalihim ng DBM"),
      role: t("Leads budget preparation and execution", "Nangunguna sa paghanda at pagpapatupad ng badyet"),
      icon: Users,
    },
    // NOTE: Updated officials or placeholders should be used here as needed
    {
      name: t("Speaker of the House", "Ispiker ng Kapulungan"),
      role: t("Presides over the House; GAB starts here", "Namumuno sa Kapulungan; Dito nagsisimula ang GAB"),
      icon: Gavel,
    },
    {
      name: t("Senate President", "Pangulo ng Senado"),
      role: t("Presides over the Senate budget review", "Namumuno sa pagsusuri ng badyet ng Senado"),
      icon: Gavel,
    },
  ];


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
                  "Understanding the complete budget process, including the critical roles of Congress and the Executive branch.",
                  "Pag-unawa sa kumpletong proseso ng badyet, kasama ang mahalagang papel ng Kongreso at sangay ng Ehekutibo.",
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
                {t("The Four Phases of the Budget Cycle", "Ang Apat na Yugto ng Siklo ng Badyet")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t(
                  "From Planning to Accountability: The full journey of the national budget.",
                  "Mula sa Pagpaplano hanggang sa Pananagutan: Ang kumpletong paglalakbay ng pambansang badyet.",
                )}
              </p>
            </div>

            {/* Progress Indicator - Centered the bar */}
            <div className="mb-12 flex items-center justify-center">
              <div className="flex items-center justify-center overflow-x-auto p-2"> {/* Added responsive wrapper for safety */}
                {stages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    <button
                      // Use handleStageClick for scroll functionality
                      onClick={() => handleStageClick(index)}
                      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 transition-all shrink-0 text-sm sm:text-base ${ // SHRINKED SIZE FOR MOBILE (h-8 w-8)
                        activeStage === index
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-accent/50"
                        }`}
                    >
                      {index + 1}
                    </button>
                    {index < stages.length - 1 && (
                      // Made the connecting line fill the space between buttons
                      <div
                        // SHRINKED LINE WIDTH FOR MOBILE (w-8)
                        className={`h-0.5 w-8 sm:w-16 transition-colors mx-1 sm:mx-2 ${activeStage > index ? "bg-accent" : "bg-border"}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stage Cards - Added ref for scrolling */}
            <div ref={stageCardsRef} className="space-y-6">
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

        {/* Deeper Dive: Government Structure and Budget Details */}
        <section className="border-t border-b border-border bg-background py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold text-foreground mb-10 text-center">
                {t("Deeper Dive: Government Structure and Budget Details", "Mas Malalim na Pagsusuri: Istraktura ng Gobyerno at Detalye ng Badyet")}
              </h2>

              <div className="space-y-12">

                {/* 1. Congressional Committees Concerned on Budget */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-lg border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-accent mb-3 flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    {t("Congressional Committees Concerned on Budget", "Mga Komite ng Kongreso na May Kinalaman sa Badyet")}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t("House of Representatives:", "Kapulungan ng mga Kinatawan:")}</h4>
                      <p className="text-muted-foreground text-sm">
                        <strong className="text-foreground">Committee on Appropriations:</strong> {t("The primary committee that reviews the NEP, conducts hearings, and recommends the House version of the General Appropriations Bill (GAB).", "Ang pangunahing komite na sumusuri sa NEP, nagsasagawa ng mga pagdinig, at nagrerekomenda ng bersyon ng Kapulungan ng General Appropriations Bill (GAB).")}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{t("Senate:", "Senado:")}</h4>
                      <p className="text-muted-foreground text-sm">
                        <strong className="text-foreground">Committee on Finance:</strong> {t("This committee reviews the GAB passed by the House, conducts separate hearings, and proposes amendments before the bill is debated in the Senate plenary.", "Sinusuri ng komiteng ito ang GAB na ipinasa ng Kapulungan, nagsasagawa ng hiwalay na pagdinig, at nagmumungkahi ng mga pagbabago bago talakayin ang panukalang batas sa plenaryo ng Senado.")}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Department vs. Agency vs. Government (Budget Definition) - UPDATED SECTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-lg border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-accent mb-3 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {t("Department vs. Agency vs. Government (Budget Definition)", "Kagawaran vs. Ahensya vs. Gobyerno (Depinisyon sa Badyet)")}
                  </h3>
                  <div className='space-y-4 text-sm text-muted-foreground'>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Government:</strong> {t("The entire national entity, including all three branches (Executive, Legislative, Judicial) and all constitutional offices.", "Ang buong pambansang entidad, kasama ang lahat ng tatlong sangay (Ehekutibo, Lehislatibo, Hudisyal) at lahat ng opisina ng konstitusyon.")}
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Department:</strong> {t("A major primary subdivision of the Executive Branch headed by a Secretary (e.g., Department of Health, Department of Education). It serves as the main budget-preparing and executing unit.", "Isang pangunahing dibisyon ng Sangay Ehekutibo na pinamumunuan ng isang Kalihim (hal. Kagawaran ng Kalusugan, Kagawaran ng Edukasyon). Ito ang nagsisilbing pangunahing yunit sa paghahanda at pagpapatupad ng badyet.")}
                    </p>
                    <p className="leading-relaxed">
                      <strong className="text-foreground">Agency:</strong> {t("A general term for any specific bureau, office, commission, or unit within the Government. This includes departments, but also smaller attached agencies or government corporations (e.g., PHIC is an agency attached to the DOH). In budget terms, both Departments and their attached Agencies receive specific allocations.", "Isang pangkalahatang termino para sa anumang tiyak na kawanihan, opisina, komisyon, o yunit sa loob ng Gobyerno. Kasama rito ang mga kagawaran, ngunit pati na rin ang mas maliliit na attached agencies o korporasyon ng gobyerno (hal. ang PHIC ay isang ahensya na nakakabit sa DOH). Sa mga termino ng badyet, parehong tumatanggap ng partikular na alokasyon ang mga Kagawaran at ang kanilang Attached Agencies.")}
                    </p>
                  </div>
                </motion.div>

                {/* 3. Bicameral Conference Committee and GAA Veto */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-lg border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-accent mb-3 flex items-center">
                    <Gavel className="h-5 w-5 mr-2" />
                    {t("Bicameral Conference and Presidential Veto", "Bicameral Conference at Presidential Veto")}
                  </h3>
                  <ul className="space-y-3 text-muted-foreground text-sm">
                    <li>
                      <strong className="text-foreground">{t("Bicameral Conference Committee (Bicam):", "Bicameral Conference Committee (Bicam):")}</strong> {t("Comprised of members from the House and Senate, this committee meets to reconcile all differences between the two chambers' versions of the GAB. They produce the final, single legislative version.", "Binubuo ng mga miyembro mula sa Kapulungan at Senado, ang komite na ito ay nagpupulong upang ayusin ang lahat ng pagkakaiba sa pagitan ng mga bersyon ng GAB ng dalawang kapulungan. Sila ang gumagawa ng huling, nag-iisang bersyon ng batas.")}
                    </li>
                    <li>
                      <strong className="text-foreground">{t("Presidential Line-Item Veto:", "Presidential Line-Item Veto:")}</strong> {t("Unlike regular laws, the President can veto specific provisions (line items) in the GAB without vetoing the entire bill. These vetoed items are called 'Veto Messages' and are sent back to Congress.", "Hindi tulad ng ordinaryong batas, maaaring i-veto ng Pangulo ang mga tiyak na probisyon (line items) sa GAB nang hindi bina-veto ang buong panukalang batas. Ang mga item na ito ay tinatawag na 'Veto Messages' at ibinabalik sa Kongreso.")}
                    </li>
                  </ul>
                </motion.div>

                {/* 4. GAA Headers and ETDF */}
                <div className="grid gap-8 md:grid-cols-2">
                  {/* GAA Headers */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <h4 className="text-lg font-bold text-accent mb-3 flex items-center"><FileCheck className="h-4 w-4 mr-2" /> {t("GAA Structure: Headers", "Istraktura ng GAA: Mga Ulo (Headers)")}</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li><strong className="text-foreground">Tier 1: Agency/Department Level (The 'Budget')</strong> - {t("Broad allocation for a specific department (e.g., Department of Education).", "Malawak na alokasyon para sa isang partikular na kagawaran (hal. Kagawaran ng Edukasyon).")}</li>
                      <li><strong className="text-foreground">Tier 2: Program Level</strong> - {t("Allocation for a major program or project within the agency (e.g., Basic Education Program).", "Alokasyon para sa isang pangunahing programa o proyekto sa loob ng ahensya (hal. Programa sa Batayang Edukasyon).")}</li>
                      <li><strong className="text-foreground">Tier 3: Project/Line Item Level</strong> - {t("The most detailed level, specifying the intended purpose of the spending (e.g., Maintenance and Other Operating Expenses for a specific school).", "Ang pinakadetalyadong antas, na tumutukoy sa layunin ng paggastos (hal. Maintenance and Other Operating Expenses para sa isang tiyak na paaralan).")}</li>
                    </ul>
                  </motion.div>

                  {/* ETDF */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="rounded-lg border border-border bg-card p-6"
                  >
                    <h4 className="text-lg font-bold text-accent mb-3 flex items-center"><DollarSign className="h-4 w-4 mr-2" /> {t("ETDF (Earmarked Funds)", "ETDF (Earmarked Funds)")}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                      {t(
                        "Earmarked Funds (or Special Funds) are revenues collected for a specific purpose, meaning the law requires them to be spent only on that designated program or project.",
                        "Ang Earmarked Funds (o Special Funds) ay mga kita na kinolekta para sa isang tiyak na layunin, na nangangahulugang iniaatas ng batas na gastusin lamang ang mga ito sa itinalagang programa o proyekto.",
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(
                        "They are distinct from General Funds, which can be allocated to any government function. Examples include taxes collected for road use or specific trust funds.",
                        "Iba sila sa General Funds, na maaaring ilaan sa anumang tungkulin ng gobyerno. Kasama sa mga halimbawa ang mga buwis na kinokolekta para sa paggamit ng kalsada o tiyak na trust funds.",
                      )}
                    </p>
                  </motion.div>
                </div>

                {/* NEW SECTION: GAA File Headers/UACS Decoding */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-lg border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-accent mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    {t("Decoding the GAA Line Item (UACS Headers)", "Pag-decode sa GAA Line Item (UACS Headers)")}
                  </h3>
                  <p className="text-muted-foreground mb-6 text-sm">
                    {t("The General Appropriations Act (GAA) data uses the Uniform Accounts Code Structure (UACS) to categorize every single line item of spending. Here are the keys used in raw GAA data files:", "Ang datos ng General Appropriations Act (GAA) ay gumagamit ng Uniform Accounts Code Structure (UACS) upang ikategorya ang bawat line item ng paggastos. Narito ang mga susi na ginagamit sa raw GAA data files:")}
                  </p>
                  <div className="grid gap-6 md:grid-cols-2">
                    {gaaHeaders.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-dashed border-border/70 p-4 bg-background"
                      >
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          {language === "en" ? item.term : item.termFil}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                          {language === "en" ? item.definition : item.definitionFil}
                        </p>

                        {/* Split keys and show them as a vertical list */}
                        <div className="flex flex-col gap-1">
                          {item.keys
                            .split(",")
                            .map((key) => key.trim())
                            .map((key, i) => (
                              <p
                                key={i}
                                className="text-xs text-primary/80 font-mono bg-primary/10 px-2 py-1 rounded-sm border border-border/30"
                              >
                                {key}
                              </p>
                            ))}
                        </div>
                      </div>
                    ))}

                  </div>
                </motion.div>
                {/* END NEW SECTION: GAA File Headers/UACS Decoding */}


                {/* 5. Key Officials */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="rounded-lg border border-border bg-card p-6 md:p-8"
                >
                  <h3 className="text-xl font-bold text-accent mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {t("Key Officials Tasked with the Budget", "Mga Pangunahing Opisyal na Naka-atas sa Badyet")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentOfficials.map((official, index) => (
                      <div key={index} className="flex items-start p-3 bg-background rounded-md border border-dashed border-border/70">
                        <official.icon className="h-5 w-5 text-primary/70 mt-1 mr-3 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">{official.name}</p>
                          <p className="text-xs text-muted-foreground">{official.role}</p>
                        </div>
                      </div>
                    ))}
                    <div className="md:col-span-2">
                      <p className="text-xs italic text-muted-foreground mt-4">
                        * {t("Note: Congressional leadership positions and the DBM Secretary change with the current administration and internal elections.", "* Paalala: Ang mga posisyon sa pamunuan ng Kongreso at ang Kalihim ng DBM ay nagbabago depende sa kasalukuyang administrasyon at internal na halalan.")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
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

        {/* Supporting Info: Budget Sources and Allocation */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {t("Sources of the Budget and Priority Areas", "Pinagmulan ng Badyet at Mga Prayoridad na Lugar")}
            </h2>
            <div className="grid gap-8 md:grid-cols-2">
              {/* Budget Sources Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl border border-border bg-background p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-500 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("Where Does the Money Come From?", "Saan Nagmumula ang Pera?")}
                  </h3>
                </div>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong className="text-foreground">Tax Revenues:</strong> {t("Income taxes, Value-Added Tax (VAT), and excise taxes are the primary source.", "Pangunahing pinagkukunan ang mga buwis sa kita, Value-Added Tax (VAT), at buwis sa kalakal.")}
                  </li>
                  <li>
                    <strong className="text-foreground">Non-Tax Revenues:</strong> {t("Fees and charges from government services, and income from government corporations.", "Mga bayarin at singil mula sa serbisyo ng gobyerno, at kita mula sa mga korporasyon ng gobyerno.")}
                  </li>
                  <li>
                    <strong className="text-foreground">Borrowings:</strong> {t("Domestic and foreign loans used to bridge the gap between revenue and expenditures.", "Mga lokal at dayuhang pautang na ginagamit upang punan ang puwang sa pagitan ng kita at gastusin.")}
                  </li>
                </ul>
              </motion.div>

              {/* Priority Areas Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.3 }}
                className="rounded-xl border border-border bg-background p-8 shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-blue-500 mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">
                    {t("What Are the Priority Areas?", "Ano ang mga Prayoridad na Lugar?")}
                  </h3>
                </div>
                <ul className="space-y-3 text-muted-foreground text-sm">
                  <li>
                    <strong className="text-foreground">Social Services:</strong> {t("Education, Healthcare, and Social Welfare programs receive the largest allocation.", "Ang Edukasyon, Pangangalaga sa Kalusugan, at mga programa sa Social Welfare ang tumatanggap ng pinakamalaking alokasyon.")}
                  </li>
                  <li>
                    <strong className="text-foreground">Economic Services:</strong> {t("Infrastructure development, agriculture, and trade support to boost economic growth.", "Pagpapaunlad ng imprastraktura, agrikultura, at suporta sa kalakalan upang mapalakas ang paglago ng ekonomiya.")}
                  </li>
                  <li>
                    <strong className="text-foreground">Debt Service:</strong> {t("Payment of interest and principal on the national debt.", "Pagbabayad ng interes at prinsipal sa pambansang utang.")}
                  </li>
                </ul>
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