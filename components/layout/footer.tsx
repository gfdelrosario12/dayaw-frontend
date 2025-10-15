"use client"

import { useLanguage } from "@/context/language-context"

export function Footer() {
  const { t } = useLanguage()

  return (
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
                <a href="#" className="hover:text-accent transition-colors">
                  {t("About", "Tungkol")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  {t("Data Sources", "Mga Pinagmulan ng Data")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  {t("Contact", "Makipag-ugnayan")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          © 2025 Project Dayaw. {t("All rights reserved.", "Lahat ng karapatan ay nakalaan.")}
        </div>
      </div>
    </footer>
  )
}
