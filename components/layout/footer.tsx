"use client"

import { useState } from "react"
import { useLanguage } from "@/context/language-context"

// --- Placeholder for a generic Modal Component ---
// Replace this with your actual Modal implementation (e.g., Dialog/Modal from a UI library)
type InfoModalProps = {
  title: string
  content: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

function InfoModal({ title, content, isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-11/12 max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-2xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex items-center justify-between border-b pb-3 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="pt-4 text-gray-700 dark:text-gray-300">
          {content}
        </div>
      </div>
    </div>
  )
}
// -------------------------------------------------

// --- Team Member Data (Completed) ---
const teamMembers = [
  {
    name: "Honeylet Igot",
    linkedin: "https://www.linkedin.com/in/honeyletigot",
  },
  {
    name: "Cathyren Sacatani",
    linkedin: "https://www.linkedin.com/in/cathyren-sacatani-50361634a",
  },
  {
    name: "Denie Rose G. Bon",
    linkedin: "https://www.linkedin.com/in/denierosebon",
  },
  {
    name: "Gladwin Ferdz I. Del Rosario",
    linkedin: "https://www.linkedin.com/in/gladwindr", // Found in original code/snippet search
    // Note: The search result points to another LinkedIn URL: https://www.linkedin.com/in/gladwin-ferdz-del-rosario-0b5a61235
    // I will keep the one already present in the original code's contact section as it seems to be the preferred one: 'https://www.linkedin.com/in/gladwindr'
  },
]
// ------------------------------------

export function Footer() {
  const { t } = useLanguage()
  const [modalType, setModalType] = useState<"about" | "data" | "contact" | null>(null) // 'about', 'data', or 'contact'

  const closeModal = () => setModalType(null)

  // --- Modal Content Definitions ---

  const aboutContent = (
    <div className="space-y-4">
      <p className="font-semibold">
        {t("Project Dayaw: The Budget Transparency Tracker", "Proyekto Dayaw: The Budget Transparency Tracker")}
      </p>
      <p>
        {t(
          "Project Dayaw is a non-profit, open-source budget transparency tracker for the Philippines. Our mission is to promote fiscal transparency and open governance by making the government's budget data accessible and understandable to every Filipino citizen. By transforming complex General Appropriations Act (GAA) data into intuitive visualizations and searchable formats, we empower the public to hold their government accountable for every peso spent.",
          "Ang Proyektong Dayaw ay isang non-profit, open-source na tagasubaybay ng transparency ng badyet para sa Pilipinas. Ang aming misyon ay isulong ang fiscal transparency at bukas na pamamahala sa pamamagitan ng paggawa ng data ng badyet ng gobyerno na madaling makuha at maintindihan ng bawat Pilipinong mamamayan. Sa pamamagitan ng pagbabago ng kumplikadong data ng General Appropriations Act (GAA) sa mga intuitive na visualization at mahahanap na format, binibigyan namin ng kapangyarihan ang publiko na panagutin ang kanilang gobyerno para sa bawat pisong ginugol.",
        )}
      </p>
      <p>
        {t(
          "Our core belief is that an informed citizenry is the backbone of a strong democracy. Dayaw—a Hiligaynon word meaning 'to praise' or 'to honor'—reflects our goal: to honor the public trust through unwavering transparency.",
          "Ang aming pangunahing paniniwala ay ang isang may kaalamang mamamayan ang gulugod ng isang matibay na demokrasya. Ang Dayaw—isang salitang Hiligaynon na nangangahulugang 'puri' o 'parangal'—ay sumasalamin sa aming layunin: parangalan ang tiwala ng publiko sa pamamagitan ng matatag na transparency.",
        )}
      </p>
    </div>
  )

  const dataSourcesContent = (
    <div className="space-y-4">
      <p>
        {t(
          "The core data for Project Dayaw is sourced directly from the General Appropriations Act (GAA), which is the official document detailing the national government’s expenditure program.",
          "Ang pangunahing data para sa Proyekto Dayaw ay direktang nagmula sa General Appropriations Act (GAA), na siyang opisyal na dokumento na nagdedetalye ng programa sa paggastos ng pambansang pamahalaan.",
        )}
      </p>
      <p>
        {t(
          "Specifically, our data is processed from the Excel sheets released by the Department of Budget and Management (DBM) and made available on the DBM's official website.",
          "Sa partikular, ang aming data ay pinoproseso mula sa mga Excel sheet na inilabas ng Department of Budget and Management (DBM) at ginawang available sa opisyal na website ng DBM.",
        )}
      </p>
      <p>
        {t(
          "We strive for accuracy and use the latest publicly available GAA files.",
          "Nagsusumikap kami para sa katumpakan at ginagamit namin ang pinakabagong GAA files na magagamit ng publiko.",
        )}
      </p>
    </div>
  )

  const contactContent = (
    <div className="space-y-4">
      <p className="font-semibold">{t("Project Development Team (GDHC)", "Grupo ng Tagapaggawa ng Proyekto (GDHC)")}</p>
      <ul className="list-inside list-disc space-y-1">
        {teamMembers.map((member) => (
          <li key={member.name}>
            {member.name}
            {member.linkedin && (
              <>
                {" "}
                (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LinkedIn
                </a>
                )
              </>
            )}
          </li>
        ))}
      </ul>
      <p>{t("From the Polytechnic University of the Philippines", "Mula sa Polytechnic University of the Philippines")}</p>

      <div className="mt-4 border-t pt-4 dark:border-gray-700">
        <p className="font-semibold">{t("Contact the Project Leader", "Makipag-ugnayan sa Project Leader")}</p>
        <p className="mt-1 text-sm">
          <strong>Gladwin Ferdz Del I. Rosario</strong>
        </p>
        <p className="text-sm">
          <strong>Email:</strong> <a href="mailto:delrosario.gladwinferdz.infante@gmail.com" className="text-accent hover:underline">delrosario.gladwinferdz.infante@gmail.com</a>
        </p>
      </div>
    </div>
  )

  // --- Determine which modal to display ---
  let modalTitle = ""
  let modalContent = null
  switch (modalType) {
    case "about":
      modalTitle = t("About Project Dayaw", "Tungkol sa Proyekto Dayaw")
      modalContent = aboutContent
      break
    case "data":
      modalTitle = t("Data Sources", "Mga Pinagmulan ng Data")
      modalContent = dataSourcesContent
      break
    case "contact":
      modalTitle = t("Contact Us", "Makipag-ugnayan sa Amin")
      modalContent = contactContent
      break
    default:
      break
  }

  return (
    <>
      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Project Info */}
            <div>
              <h3 className="mb-2 text-lg font-bold text-accent">Project Dayaw</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(
                  "Transparency in Every Peso - Open governance and fiscal transparency for the Philippines",
                  "Transparency sa Bawat Piso - Bukas na pamamahala at transparency ng badyet para sa Pilipinas",
                )}
              </p>
            </div>

            {/* Credits */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t("Built By", "Ginawa Ng")}</h3>
              <p className="text-sm text-muted-foreground">GDHC - Great Developers Hacking Code</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("PUP Technology Festival 2025 Hackathon", "PUP Technology Festival 2025 Hackathon")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(
                  "PUP Digital Bayanihan: Fostering a Smart Future Together",
                  "PUP Digital Bayanihan: Pagpapaunlad ng Matalinong Kinabukasan",
                )}
              </p>
            </div>

            {/* Links */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">{t("Resources", "Mga Mapagkukunan")}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setModalType("about")}
                    className="hover:text-accent transition-colors text-left"
                  >
                    {t("About", "Tungkol")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType("data")}
                    className="hover:text-accent transition-colors text-left"
                  >
                    {t("Data Sources", "Mga Pinagmulan ng Data")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType("contact")}
                    className="hover:text-accent transition-colors text-left"
                  >
                    {t("Contact", "Makipag-ugnayan")}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            © 2025 Project Dayaw. {t("All rights reserved.", "Lahat ng karapatan ay nakalaan.")}
          </div>
        </div>
      </footer>

      {/* The Modal Component */}
      <InfoModal
        title={modalTitle}
        content={modalContent}
        isOpen={!!modalType} // Convert string to boolean (null -> false, 'about' -> true)
        onClose={closeModal}
      />
    </>
  )
}