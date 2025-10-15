"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ChartPanel } from "@/components/charts/chart-panel"
import { MapView } from "./MapView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LanguageProvider, useLanguage } from "@/context/language-context"
import { motion } from "framer-motion"
import {
  BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer
} from "recharts"
import { Treemap, ResponsiveContainer as ReResponsiveContainer, Tooltip as ReTooltip } from "recharts"
import { useEffect, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input" 

// --- Types ---

// Define the common metadata fields used across multiple data types
interface BudgetMetadata {
  SORDER?: number;
  DEPARTMENT?: string;
  UACS_DPT_DSC?: string;
  AGENCY?: string;
  UACS_AGY_DSC?: string;
  PREXC_FPAP_ID?: string;
  PREXC_LEVEL?: string;
  DSC?: string;
  OPERUNIT?: string;
  UACS_OPER_DSC?: string;
  UACS_REG_ID?: string;
  UACS_OPERDIV_ID?: string;
  UACS_DIV_DSC?: string;
  FUNDCD?: string;
  UACS_FUNDSUBCAT_DSC?: string;
  UACS_EXP_CD?: string;
  UACS_EXP_DSC?: string;
  UACS_SOBJ_CD?: string;
  UACS_SOBJ_DSC?: string;
  AMT?: number;
}

// FIX: Extend Sector and Agency interfaces to include BudgetMetadata
interface Sector extends BudgetMetadata {
  name: string;
  value: number;
}

interface Agency extends BudgetMetadata {
  name: string;
  budget: number;
}
// END FIX

interface Expense {
  name: string
  value: number
  children?: Expense[]
  [key: string]: any
}

interface Region extends BudgetMetadata { // Region also uses metadata
  region: string;
  value: number;
}

interface AgencyDetail { agency: string; expenses: Expense[] }
interface DashboardData {
  sectors: Sector[]
  agencies: Agency[]
  expenses: Expense[]
  fundSources: Expense[]
  regions: Region[]
}

// --- Modal Component ---
interface DataModalProps {
  title: string
  data: any
  isOpen: boolean
  onClose: () => void
}

const DataModal = ({ title, data, isOpen, onClose }: DataModalProps) => {
  const { t } = useLanguage()

  const formattedData = data
    ? Object.entries(data)
      .map(([key, value]) => {
        if (['cx', 'cy', 'x', 'y', 'z', 'depth', 'index', 'fill'].includes(key)) return null
        let displayValue = value
        if (key === 'value' || key === 'budget' || key === "AMT") displayValue = `₱${Number(value).toLocaleString()}`
        return { key: key.charAt(0).toUpperCase() + key.slice(1), value: displayValue }
      })
      .filter((item): item is { key: string; value: unknown } => item !== null)
    : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {t("Detailed view of the selected item.", "Detalyadong impormasyon ng napiling aytem.")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {formattedData.map(({ key, value }) => (
            <div key={key} className="grid grid-cols-3 items-center">
              <span className="text-sm font-medium col-span-1 text-muted-foreground">{key}:</span>
              <span className="text-sm font-bold col-span-2 text-right">{String(value)}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// --- Custom Tooltip for Hover ---
interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
}

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  const allowedKeys = [
    "SORDER", "DEPARTMENT", "UACS_DPT_DSC", "AGENCY", "UACS_AGY_DSC", "PREXC_FPAP_ID", "PREXC_LEVEL",
    "DSC", "OPERUNIT", "UACS_OPER_DSC", "UACS_REG_ID", "UACS_OPERDIV_ID", "UACS_DIV_DSC", "FUNDCD",
    "UACS_FUNDSUBCAT_DSC", "UACS_EXP_CD", "UACS_EXP_DSC", "UACS_SOBJ_CD", "UACS_SOBJ_DSC", "AMT",
    "name", "value", "budget", "region"
  ];

  const fields = Object.entries(data)
    .filter(([k]) => allowedKeys.includes(k))
    .map(([k, v]) => {
      let val = v
      if (k === "value" || k === "budget" || k === "AMT") val = `₱${Number(v).toLocaleString()}`
      return { key: k, value: val }
    })

  return (
    <div className="bg-white border rounded-md shadow-lg p-3 text-sm">
      {fields.map(f => (
        <div key={f.key} className="flex justify-between">
          <span className="font-medium text-gray-600">{f.key.toUpperCase()}:</span>
          <span className="font-bold">{String(f.value)}</span>
        </div>
      ))}
    </div>
  )
}

// --- Missing ByAgency Component ---
interface ByAgencyProps {
  agencies: Agency[]
  selectedAgency: string
  setSelectedAgency: (agencyName: string) => void
  handleChartItemClick: (data: any, title: string) => void
  isLoading: boolean
}

const ByAgency = ({ agencies, selectedAgency, setSelectedAgency, handleChartItemClick, isLoading }: ByAgencyProps) => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.budget - a.budget)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder={t("Search agency...", "Maghanap ng ahensya...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedAgency} onValueChange={setSelectedAgency}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t("Select Agency", "Pumili ng Ahensya")} />
          </SelectTrigger>
          <SelectContent>
            {agencies.map((agency) => (
              <SelectItem key={agency.name} value={agency.name}>
                {agency.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ChartPanel title={t("Agency Budget Overview", "Pangkalahatang-ideya ng Badyet ng Ahensya")} isLoading={isLoading}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={filteredAgencies}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
            <YAxis tickFormatter={v => `₱${Number(v).toLocaleString()}`} />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="budget"
              fill="#F59E0B"
              onClick={(data) => {
                if (typeof data.name === "string") {
                  setSelectedAgency(data.name);
                  handleChartItemClick(data, `Agency: ${data.name}`);
                }
              }}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {t("Click on an agency bar to select it and see its expense breakdown below.", "Pindutin ang bar ng ahensya upang piliin ito at makita ang detalye ng gastos sa ibaba.")}
        </p>
      </ChartPanel>
    </div>
  )
}
// --- End of Missing ByAgency Component ---


// --- Main Dashboard ---
export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}

function DashboardContent() {
  const { t } = useLanguage()
  const [selectedYear, setSelectedYear] = useState("2025")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [selectedAgency, setSelectedAgency] = useState<string>("")
  const [agencyDetail, setAgencyDetail] = useState<AgencyDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<any>(null)
  const [modalTitle, setModalTitle] = useState("")

const handleChartItemClick = useCallback((data: any, title: string) => {
  if (!data) return;
  const payload = data.payload || data;

  const allowedKeys = [
    "name", "value", "budget", "AMT", "SORDER", "DEPARTMENT", "UACS_DPT_DSC",
    "AGENCY", "UACS_AGY_DSC", "PREXC_FPAP_ID", "PREXC_LEVEL", "DSC", "OPERUNIT",
    "UACS_OPER_DSC", "UACS_REG_ID", "UACS_OPERDIV_ID", "UACS_DIV_DSC",
    "FUNDCD", "UACS_FUNDSUBCAT_DSC", "UACS_EXP_CD", "UACS_EXP_DSC",
    "UACS_SOBJ_CD", "UACS_SOBJ_DSC", "region"
  ];

  const filtered: Record<string, string | number> = {}
  Object.entries(payload).forEach(([key, value]) => {
    if (allowedKeys.includes(key)) filtered[key] =
      typeof value === "number" ? value : String(value)
  })

  if (Object.keys(filtered).length === 0) return
  setModalData(filtered)
  setModalTitle(title)
  setShowModal(true)
}, [])


  useEffect(() => {
    setIsLoading(true)

    // Simplified mock data logic for demonstration
    const getAgencyExpenseBreakdown = (agencyName: string): Expense[] => {
        if (agencyName === "DepEd") return [
            { name: "Salaries & Wages", value: 60000, AMT: 60000 },
            { name: "Maintenance", value: 30000, AMT: 30000 },
            { name: "Capital Outlay", value: 10000, AMT: 10000 },
        ];
        if (agencyName === "DOH") return [
            { name: "Salaries & Wages", value: 40000, AMT: 40000 },
            { name: "Medical Supplies", value: 30000, AMT: 30000 },
            { name: "Programs", value: 10000, AMT: 10000 },
        ];
        // Add more agency breakdowns as needed...
        return [{ name: "General Expenses", value: 50000, AMT: 50000 }];
    };


    const mockData: DashboardData = {
      sectors: [
        {
          name: "Education", value: 150000,
          SORDER: 1, DEPARTMENT: "DepEd", UACS_DPT_DSC: "Department of Education",
          AGENCY: "DepEd", UACS_AGY_DSC: "DepEd Main Agency",
          PREXC_FPAP_ID: "FPAP001", PREXC_LEVEL: "National",
          DSC: "DSC001", OPERUNIT: "OU001", UACS_OPER_DSC: "Education Operations",
          UACS_REG_ID: "R01", UACS_OPERDIV_ID: "DIV01", UACS_DIV_DSC: "Division 1",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP001", UACS_EXP_DSC: "Salaries",
          UACS_SOBJ_CD: "SOBJ001", UACS_SOBJ_DSC: "Personnel Services",
          AMT: 150000
        } as Sector, // Added casting here just to suppress potential TS errors if types weren't fixed, but the interface fix is the real solution.
        {
          name: "Health", value: 90000,
          SORDER: 2, DEPARTMENT: "DOH", UACS_DPT_DSC: "Department of Health",
          AGENCY: "DOH", UACS_AGY_DSC: "DOH Main Agency",
          PREXC_FPAP_ID: "FPAP002", PREXC_LEVEL: "National",
          DSC: "DSC002", OPERUNIT: "OU002", UACS_OPER_DSC: "Health Operations",
          UACS_REG_ID: "R02", UACS_OPERDIV_ID: "DIV02", UACS_DIV_DSC: "Division 2",
          FUNDCD: "SF", UACS_FUNDSUBCAT_DSC: "Special Fund",
          UACS_EXP_CD: "EXP002", UACS_EXP_DSC: "Medical Supplies",
          UACS_SOBJ_CD: "SOBJ002", UACS_SOBJ_DSC: "MOOE",
          AMT: 90000
        } as Sector,
        {
          name: "Infrastructure", value: 120000,
          SORDER: 3, DEPARTMENT: "DPWH", UACS_DPT_DSC: "Department of Public Works and Highways",
          AGENCY: "DPWH", UACS_AGY_DSC: "DPWH Main Agency",
          PREXC_FPAP_ID: "FPAP003", PREXC_LEVEL: "National",
          DSC: "DSC003", OPERUNIT: "OU003", UACS_OPER_DSC: "Infra Operations",
          UACS_REG_ID: "R03", UACS_OPERDIV_ID: "DIV03", UACS_DIV_DSC: "Division 3",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP003", UACS_EXP_DSC: "Road Construction",
          UACS_SOBJ_CD: "SOBJ003", UACS_SOBJ_DSC: "Capital Outlays",
          AMT: 120000
        } as Sector,
        {
          name: "Defense", value: 50000,
          SORDER: 4, DEPARTMENT: "DND", UACS_DPT_DSC: "Department of National Defense",
          AGENCY: "DND", UACS_AGY_DSC: "DND Main Agency",
          PREXC_FPAP_ID: "FPAP004", PREXC_LEVEL: "National",
          DSC: "DSC004", OPERUNIT: "OU004", UACS_OPER_DSC: "Defense Operations",
          UACS_REG_ID: "R04", UACS_OPERDIV_ID: "DIV04", UACS_DIV_DSC: "Division 4",
          FUNDCD: "SF", UACS_FUNDSUBCAT_DSC: "Special Fund",
          UACS_EXP_CD: "EXP004", UACS_EXP_DSC: "Equipment",
          UACS_SOBJ_CD: "SOBJ004", UACS_SOBJ_DSC: "Capital Outlays",
          AMT: 50000
        } as Sector,
        {
          name: "Social Welfare", value: 80000,
          SORDER: 5, DEPARTMENT: "DSWD", UACS_DPT_DSC: "Department of Social Welfare and Development",
          AGENCY: "DSWD", UACS_AGY_DSC: "DSWD Main Agency",
          PREXC_FPAP_ID: "FPAP005", PREXC_LEVEL: "National",
          DSC: "DSC005", OPERUNIT: "OU005", UACS_OPER_DSC: "Welfare Operations",
          UACS_REG_ID: "R05", UACS_OPERDIV_ID: "DIV05", UACS_DIV_DSC: "Division 5",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP005", UACS_EXP_DSC: "Grants",
          UACS_SOBJ_CD: "SOBJ005", UACS_SOBJ_DSC: "MOOE",
          AMT: 80000
        } as Sector
      ],
      agencies: [
        {
          name: "DepEd", budget: 100000,
          SORDER: 1, DEPARTMENT: "DepEd", UACS_DPT_DSC: "Department of Education",
          AGENCY: "DepEd", UACS_AGY_DSC: "DepEd Main Agency",
          PREXC_FPAP_ID: "FPAP001", PREXC_LEVEL: "National",
          DSC: "DSC001", OPERUNIT: "OU001", UACS_OPER_DSC: "Education Operations",
          UACS_REG_ID: "R01", UACS_OPERDIV_ID: "DIV01", UACS_DIV_DSC: "Division 1",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP001", UACS_EXP_DSC: "Salaries",
          UACS_SOBJ_CD: "SOBJ001", UACS_SOBJ_DSC: "Personnel Services",
          AMT: 100000
        } as Agency,
        {
          name: "DOH", budget: 80000,
          SORDER: 2, DEPARTMENT: "DOH", UACS_DPT_DSC: "Department of Health",
          AGENCY: "DOH", UACS_AGY_DSC: "DOH Main Agency",
          PREXC_FPAP_ID: "FPAP002", PREXC_LEVEL: "National",
          DSC: "DSC002", OPERUNIT: "OU002", UACS_OPER_DSC: "Health Operations",
          UACS_REG_ID: "R02", UACS_OPERDIV_ID: "DIV02", UACS_DIV_DSC: "Division 2",
          FUNDCD: "SF", UACS_FUNDSUBCAT_DSC: "Special Fund",
          UACS_EXP_CD: "EXP002", UACS_EXP_DSC: "Medical Supplies",
          UACS_SOBJ_CD: "SOBJ002", UACS_SOBJ_DSC: "MOOE",
          AMT: 80000
        } as Agency,
        {
          name: "DPWH", budget: 90000,
          SORDER: 3, DEPARTMENT: "DPWH", UACS_DPT_DSC: "Department of Public Works and Highways",
          AGENCY: "DPWH", UACS_AGY_DSC: "DPWH Main Agency",
          PREXC_FPAP_ID: "FPAP003", PREXC_LEVEL: "National",
          DSC: "DSC003", OPERUNIT: "OU003", UACS_OPER_DSC: "Infra Operations",
          UACS_REG_ID: "R03", UACS_OPERDIV_ID: "DIV03", UACS_DIV_DSC: "Division 3",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP003", UACS_EXP_DSC: "Road Construction",
          UACS_SOBJ_CD: "SOBJ003", UACS_SOBJ_DSC: "Capital Outlays",
          AMT: 90000
        } as Agency,
        {
          name: "DSWD", budget: 70000,
          SORDER: 4, DEPARTMENT: "DSWD", UACS_DPT_DSC: "Department of Social Welfare and Development",
          AGENCY: "DSWD", UACS_AGY_DSC: "DSWD Main Agency",
          PREXC_FPAP_ID: "FPAP005", PREXC_LEVEL: "National",
          DSC: "DSC005", OPERUNIT: "OU005", UACS_OPER_DSC: "Welfare Operations",
          UACS_REG_ID: "R05", UACS_OPERDIV_ID: "DIV05", UACS_DIV_DSC: "Division 5",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP005", UACS_EXP_DSC: "Grants",
          UACS_SOBJ_CD: "SOBJ005", UACS_SOBJ_DSC: "MOOE",
          AMT: 70000
        } as Agency,
        {
          name: "DND", budget: 50000,
          SORDER: 5, DEPARTMENT: "DND", UACS_DPT_DSC: "Department of National Defense",
          AGENCY: "DND", UACS_AGY_DSC: "DND Main Agency",
          PREXC_FPAP_ID: "FPAP004", PREXC_LEVEL: "National",
          DSC: "DSC004", OPERUNIT: "OU004", UACS_OPER_DSC: "Defense Operations",
          UACS_REG_ID: "R04", UACS_OPERDIV_ID: "DIV04", UACS_DIV_DSC: "Division 4",
          FUNDCD: "SF", UACS_FUNDSUBCAT_DSC: "Special Fund",
          UACS_EXP_CD: "EXP004", UACS_EXP_DSC: "Equipment",
          UACS_SOBJ_CD: "SOBJ004", UACS_SOBJ_DSC: "Capital Outlays",
          AMT: 50000
        } as Agency
      ].sort((a, b) => b.budget - a.budget),

      expenses: [
        {
          name: "Personnel Services", value: 300000,
          SORDER: 1, DEPARTMENT: "All", UACS_DPT_DSC: "All Departments",
          AGENCY: "All", UACS_AGY_DSC: "All Agencies",
          PREXC_FPAP_ID: "FPAP000", PREXC_LEVEL: "National",
          DSC: "DSC000", OPERUNIT: "OU000", UACS_OPER_DSC: "General Operations",
          UACS_REG_ID: "R00", UACS_OPERDIV_ID: "DIV00", UACS_DIV_DSC: "All Divisions",
          FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
          UACS_EXP_CD: "EXP000", UACS_EXP_DSC: "Personnel Services",
          UACS_SOBJ_CD: "SOBJ000", UACS_SOBJ_DSC: "Salaries",
          AMT: 300000,
          children: [
            {
              name: "Salaries", value: 200000, AMT: 200000,
              SORDER: 1, DEPARTMENT: "All", UACS_DPT_DSC: "All Departments",
              AGENCY: "All", UACS_AGY_DSC: "All Agencies",
              PREXC_FPAP_ID: "FPAP000", PREXC_LEVEL: "National",
              DSC: "DSC000", OPERUNIT: "OU000", UACS_OPER_DSC: "General Operations",
              UACS_REG_ID: "R00", UACS_OPERDIV_ID: "DIV00", UACS_DIV_DSC: "All Divisions",
              FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
              UACS_EXP_CD: "EXP001", UACS_EXP_DSC: "Salaries",
              UACS_SOBJ_CD: "SOBJ001", UACS_SOBJ_DSC: "Personnel Services"
            },
            {
              name: "Benefits", value: 100000, AMT: 100000,
              SORDER: 2, DEPARTMENT: "All", UACS_DPT_DSC: "All Departments",
              AGENCY: "All", UACS_AGY_DSC: "All Agencies",
              PREXC_FPAP_ID: "FPAP000", PREXC_LEVEL: "National",
              DSC: "DSC000", OPERUNIT: "OU000", UACS_OPER_DSC: "General Operations",
              UACS_REG_ID: "R00", UACS_OPERDIV_ID: "DIV00", UACS_DIV_DSC: "All Divisions",
              FUNDCD: "GF", UACS_FUNDSUBCAT_DSC: "General Fund",
              UACS_EXP_CD: "EXP002", UACS_EXP_DSC: "Benefits",
              UACS_SOBJ_CD: "SOBJ002", UACS_SOBJ_DSC: "Personnel Services"
            }
          ]
        },
        { name: "MOOE", value: 200000, AMT: 200000 },
        { name: "Capital Outlays", value: 100000, AMT: 100000 }
      ],
      fundSources: [
        { name: "General Fund", value: 800000, AMT: 800000 },
        { name: "Special Funds", value: 200000, AMT: 200000 }
      ],
      regions: [
        { region: "NCR", value: 200000, AMT: 200000 } as Region,
        { region: "Region IV-A", value: 150000, AMT: 150000 } as Region,
        { region: "Region III", value: 120000, AMT: 120000 } as Region,
        { region: "Region VII", value: 100000, AMT: 100000 } as Region
      ]
    }

    setDashboardData(mockData)
    // Set a default selected agency to show the initial breakdown
    if (mockData.agencies.length > 0) {
        setSelectedAgency(mockData.agencies[0].name)
    }

    setIsLoading(false)
  }, [])

  // --- Agency Detail ---
  useEffect(() => {
    if (!dashboardData || !selectedAgency) {
      setAgencyDetail(null)
      return
    }

    // This is where you would fetch or calculate the specific breakdown for selectedAgency.
    // For this mock data, we'll use a simple function to simulate the data.
    const getAgencyExpenseBreakdown = (agencyName: string): Expense[] => {
        if (agencyName === "DepEd") return [
            { name: "Salaries & Wages", value: 60000, AMT: 60000 },
            { name: "Maintenance", value: 30000, AMT: 30000 },
            { name: "Capital Outlay", value: 10000, AMT: 10000 },
        ];
        if (agencyName === "DOH") return [
            { name: "Salaries & Wages", value: 40000, AMT: 40000 },
            { name: "Medical Supplies", value: 30000, AMT: 30000 },
            { name: "Programs", value: 10000, AMT: 10000 },
        ];
        if (agencyName === "DPWH") return [
            { name: "Civil Works", value: 70000, AMT: 70000 },
            { name: "Personnel", value: 20000, AMT: 20000 },
        ];
        // etc...
        return [{ name: "General Expenses", value: 50000, AMT: 50000 }];
    };

    const agencyExpenses = getAgencyExpenseBreakdown(selectedAgency);

    setAgencyDetail({
        agency: selectedAgency,
        expenses: agencyExpenses.length > 0 ? agencyExpenses : [{ name: "No Detail", value: 1, AMT: 1 }]
    })
  }, [selectedAgency, dashboardData])


  const topAgencies = dashboardData?.agencies.slice(0, 5) || []
  const bottomAgencies = dashboardData?.agencies.slice(-5) || []

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
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                  {t("Transparency Dashboard", "Dashboard ng Transparency")}
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  {t(
                    "Explore how the national budget is allocated and spent, visualized for everyone.",
                    "Alamin kung paano inilaan at ginastos ang pambansang badyet, iprinisenta sa madaling paraan."
                  )}
                </p>
              </div>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025">FY 2025</SelectItem>
                  <SelectItem value="2024">FY 2024</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="overview">{t("Overview", "Pangkalahatang-ideya")}</TabsTrigger>
              <TabsTrigger value="regions">{t("By Region", "Ayon sa Rehiyon")}</TabsTrigger>
              <TabsTrigger value="agencies">{t("By Agency", "Ayon sa Ahensya")}</TabsTrigger>
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview" className="space-y-8">
              <motion.div className="grid gap-6 md:grid-cols-2">
                <ChartPanel title="Top Departments" isLoading={isLoading} description={t("Click a bar for details.", "Pindutin ang bar para sa detalye.")}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dashboardData?.sectors}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={v => `${v / 1000}K`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar
                        dataKey="value"
                        fill="#4F46E5"
                        onClick={(data) => handleChartItemClick(data, `Department: ${data.name}`)}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Expense Distribution" isLoading={isLoading} description={t("Click a block for details.", "Pindutin ang bloke para sa detalye.")}>
                  <ReResponsiveContainer width="100%" height={300}>
                    <Treemap
                      data={dashboardData?.expenses || []}
                      dataKey="value"
                      stroke="#fff"
                      fill="#4F46E5"
                      isAnimationActive={false}
                      onClick={(data) => {
                        if (data && data.name) handleChartItemClick(data, `Expense: ${data.name}`)
                      }}
                      content={({ depth, x, y, width, height, name }) => (
                        <g cursor="pointer">
                          <rect x={x} y={y} width={width} height={height} style={{ fill: `hsl(${depth * 50},60%,50%)`, stroke: "#fff" }} />
                          {width > 50 && height > 20 && <text x={x + 4} y={y + 20} fill="#fff" fontSize={12} fontWeight="bold">{name}</text>}
                        </g>
                      )}
                    >
                      <ReTooltip content={<ChartTooltip />} />
                    </Treemap>
                  </ReResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Budget by Fund Source" isLoading={isLoading} description={t("Click a slice for details.", "Pindutin ang hiwa para sa detalye.")}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dashboardData?.fundSources || []}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(1)}%`}
                        onClick={(data) => handleChartItemClick(data, `Fund Source: ${data.name}`)}
                        cursor="pointer"
                      >
                        {dashboardData?.fundSources?.map((entry, i) => <Cell key={i} fill={`hsl(${i * 50},50%,50%)`} />)}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Top 5 Agencies" isLoading={isLoading} description={t("Click a bar for details.", "Pindutin ang bar para sa detalye.")}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={topAgencies}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar
                        dataKey="budget"
                        fill="#10B981"
                        onClick={(data) => handleChartItemClick(data, `Agency: ${data.name}`)}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartPanel>

                <ChartPanel title="Bottom 5 Agencies" isLoading={isLoading} description={t("Click a bar for details.", "Pindutin ang bar para sa detalye.")}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={bottomAgencies}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar
                        dataKey="budget"
                        fill="#EF4444"
                        onClick={(data) => handleChartItemClick(data, `Agency: ${data.name}`)}
                        cursor="pointer"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartPanel>
              </motion.div>
            </TabsContent>

            {/* Regions */}
            <TabsContent value="regions">
              <ChartPanel title={t("Budget by Region", "Badyet ayon sa Rehiyon")} isLoading={isLoading}>
                <MapView regions={dashboardData?.regions || []} />
              </ChartPanel>
            </TabsContent>

            {/* Agencies */}
            <TabsContent value="agencies">
              <div className="space-y-8">
                <ByAgency
                  agencies={dashboardData?.agencies || []}
                  selectedAgency={selectedAgency}
                  setSelectedAgency={setSelectedAgency}
                  handleChartItemClick={handleChartItemClick}
                  isLoading={isLoading}
                />

                {agencyDetail && (
                  <ChartPanel title={`${agencyDetail.agency} - Expense Breakdown`} isLoading={isLoading}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={agencyDetail.expenses}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(1)}%`}
                          onClick={(data) => handleChartItemClick(data, `Expense: ${data.name}`)}
                          cursor="pointer"
                        >
                          {agencyDetail.expenses.map((e, i) => <Cell key={i} fill={`hsl(${i * 50},60%,50%)`} />)}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartPanel>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />

      {modalData && (
        <DataModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={modalTitle}
          data={modalData}
        />
      )}
    </div>
  )
}