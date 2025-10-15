// ByAgency.tsx

"use client"

import { FC, Dispatch, SetStateAction } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { ChartPanel } from "@/components/charts/chart-panel" // Assuming you have this component
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
// import { useLanguage } from "@/context/language-context" // Assuming you have this hook/context

// --- DUMMY DATA SETUP ---

// Mock the useLanguage hook for isolated testing/running
const useLanguage = () => ({
  t: (english: string, tagalog: string) => english, // Simple mock: always return English
})

// Mock the ChartPanel and UI components for full file execution
const ChartPanel: FC<{ title: string; isLoading: boolean; children: React.ReactNode }> = ({ title, isLoading, children }) => (
    <div className="border rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold mb-3">{title} {isLoading ? "(Loading...)" : ""}</h3>
        {children}
    </div>
)
const Select: FC<any> = ({ value, onValueChange, children }) => (
    <div className="p-2 border rounded">
        <label className="mr-2 text-sm text-gray-500">Select Agency:</label>
        <select value={value} onChange={(e) => onValueChange(e.target.value)} className="border p-1 rounded">
            {children}
        </select>
    </div>
)
const SelectTrigger: FC<any> = ({ children }) => <>{children}</>
const SelectValue: FC<any> = ({ placeholder }) => <>{placeholder}</>
const SelectContent: FC<any> = ({ children }) => <>{children}</>
const SelectItem: FC<any> = ({ value, children }) => <option value={value}>{children}</option>
// End of Mock Components

// --- INTERFACES (From original code) ---
interface Expense {
  name: string
  value: number
  AMT?: number
  children?: Expense[]
  SORDER?: string
  DEPARTMENT?: string
  UACS_DPT_DSC?: string
  AGENCY?: string
  UACS_AGY_DSC?: string
  PREXC_FPAP_ID?: string
  PREXC_LEVEL?: string
  DSC?: string
  OPERUNIT?: string
  UACS_OPER_DSC?: string
  UACS_REG_ID?: string
  UACS_OPERDIV_ID?: string
  UACS_DIV_DSC?: string
  FUNDCD?: string
  UACS_FUNDSUBCAT_DSC?: string
  UACS_EXP_CD?: string
  UACS_EXP_DSC?: string
  UACS_SOBJ_CD?: string
  UACS_SOBJ_DSC?: string
  [key: string]: any
}

interface Agency {
  name: string
  budget: number
  [key: string]: any
}

interface AgencyDetail {
  agency: string
  expenses: Expense[]
}

interface ByAgencyProps {
  agencies: Agency[]
  selectedAgency: string
  setSelectedAgency: Dispatch<SetStateAction<string>>
  handleChartItemClick: (data: any, title: string) => void
  isLoading?: boolean
  expenses?: Expense[]
}

// --- DUMMY DATA (from previous response) ---

export const DUMMY_SELECTED_AGENCY: string = "Dept. of Health (DOH)"

export const DUMMY_AGENCIES: Agency[] = [
  { name: "Dept. of Health (DOH)", budget: 130000000000, region: "National" },
  { name: "Dept. of Education (DepEd)", budget: 50000000000, region: "National" },
  { name: "Dept. of Public Works and Highways (DPWH)", budget: 80000000000, region: "National" },
  { name: "National Treasury (BTr)", budget: 500000000, region: "National" },
]

export const DUMMY_EXPENSES: Expense[] = [
  {
    name: "Dept. of Health (DOH) Total",
    value: 130000000000,
    AMT: 130000000000,
    AGENCY: "1002",
    UACS_AGY_DSC: "Department of Health",
    children: [
      {
        name: "Procurement of Vaccines",
        value: 55000000000,
        AMT: 55000000000,
        UACS_EXP_DSC: "Capital Outlays",
        UACS_SOBJ_DSC: "Medical and Dental Supplies",
        DSC: "Public Health Program",
      },
      {
        name: "Operations of Regional Hospitals",
        value: 40000000000,
        AMT: 40000000000,
        UACS_EXP_DSC: "Maintenance and Other Operating Expenses",
        UACS_SOBJ_DSC: "Utility Expenses",
        DSC: "Hospital Services",
      },
      {
        name: "Personnel Services",
        value: 30000000000,
        AMT: 30000000000,
        UACS_EXP_DSC: "Personnel Services",
        UACS_SOBJ_DSC: "Salaries and Wages",
        DSC: "Administrative Services",
      },
      {
        name: "Miscellaneous/Uncategorized",
        value: 5000000000,
        AMT: 5000000000,
        UACS_EXP_DSC: "Financial Expenses",
        UACS_SOBJ_DSC: "Other Financial Charges",
        DSC: "General Administration",
      },
    ],
  },
  {
    name: "Dept. of Education (DepEd) Total",
    value: 50000000000,
    AMT: 50000000000,
    AGENCY: "1003",
    UACS_AGY_DSC: "Department of Education",
    children: [
      {
        name: "Basic Education Program",
        value: 35000000000,
        AMT: 35000000000,
        UACS_EXP_DSC: "Maintenance and Other Operating Expenses",
        UACS_SOBJ_DSC: "Training Expenses",
        DSC: "Teaching and Learning Support",
      },
      {
        name: "School Infrastructure",
        value: 15000000000,
        AMT: 15000000000,
        UACS_EXP_DSC: "Capital Outlays",
        UACS_SOBJ_DSC: "Construction of School Buildings",
        DSC: "Infrastructure Development",
      },
    ],
  },
  {
    name: "National Treasury (BTr) Total",
    value: 500000000,
    AMT: 500000000,
    AGENCY: "9001",
    UACS_AGY_DSC: "Bureau of the Treasury",
    children: [],
  },
  {
    name: "Dept. of Public Works and Highways (DPWH) Total",
    value: 80000000000,
    AMT: 80000000000,
    AGENCY: "1004",
    UACS_AGY_DSC: "Department of Public Works and Highways",
    children: [
        {
            name: "Road Network Development",
            value: 65000000000,
            AMT: 65000000000,
            UACS_EXP_DSC: "Capital Outlays",
            UACS_SOBJ_DSC: "Land Improvement Outlay",
            DSC: "Infrastructure Program",
        },
        {
            name: "Flood Control",
            value: 15000000000,
            AMT: 15000000000,
            UACS_EXP_DSC: "Maintenance and Other Operating Expenses",
            UACS_SOBJ_DSC: "General Services",
            DSC: "Disaster Risk Management",
        },
    ]
  }
]

// --- CUSTOM TOOLTIP COMPONENT ---

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload || payload.length === 0) return null
  const data = payload[0].payload

  const allowedKeys = [
    "SORDER", "DEPARTMENT", "UACS_DPT_DSC", "AGENCY", "UACS_AGY_DSC", "PREXC_FPAP_ID", "PREXC_LEVEL",
    "DSC", "OPERUNIT", "UACS_OPER_DSC", "UACS_REG_ID", "UACS_OPERDIV_ID", "UACS_DIV_DSC", "FUNDCD",
    "UACS_FUNDSUBCAT_DSC", "UACS_EXP_CD", "UACS_EXP_DSC", "UACS_SOBJ_CD", "UACS_SOBJ_DSC", "AMT",
    "name", "value", "budget", "region"
  ]

  const fields = Object.entries(data)
    .filter(([k]) => allowedKeys.includes(k))
    .map(([k, v]) => {
      let val = v
      if (k === "value" || k === "budget" || k === "AMT") {
        val = `₱${Number(v).toLocaleString()}`
      }
      return { key: k, value: val }
    })

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 max-w-sm">
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {fields.map(({ key, value }) => (
          <div key={key} className="flex justify-between gap-4 text-xs">
            <span className="font-medium text-gray-600">{key}:</span>
            <span className="text-gray-900 text-right break-words">{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- MAIN COMPONENT ---

const ByAgency: FC<ByAgencyProps> = ({
  agencies,
  selectedAgency,
  setSelectedAgency,
  handleChartItemClick,
  isLoading = false,
  expenses = [],
}) => {
  const { t } = useLanguage()

  let agencyDetail: AgencyDetail | null = null

  if (selectedAgency) {
    // 1. Find all top-level expenses matching the selected agency name
    const filteredExpenses = expenses.filter(e => e.name?.startsWith(selectedAgency))

    // 2. Flatten the 'children' for the pie chart breakdown
    let breakdownExpenses: Expense[] = filteredExpenses.flatMap(e => e.children || [])

    // 3. Fallback logic: Ensure the chart always receives data
    if (breakdownExpenses.length === 0) {
        const totalValue = filteredExpenses.reduce((sum, e) => sum + e.value, 0)

        if (totalValue > 0) {
            // Case 1: Has total value but no breakdown (show as one slice with dummy data)
            breakdownExpenses = [{
              name: t("Uncategorized Total", "Kabuuang Walang Kategorya"),
              value: totalValue,
              AMT: totalValue,
              SORDER: filteredExpenses[0]?.SORDER || "001",
              DEPARTMENT: filteredExpenses[0]?.DEPARTMENT || "10",
              UACS_DPT_DSC: filteredExpenses[0]?.UACS_DPT_DSC || "Office of the President",
              AGENCY: selectedAgency,
              UACS_AGY_DSC: filteredExpenses[0]?.UACS_AGY_DSC || "Presidential Management Staff",
              PREXC_FPAP_ID: filteredExpenses[0]?.PREXC_FPAP_ID || "1001",
              PREXC_LEVEL: filteredExpenses[0]?.PREXC_LEVEL || "3",
              DSC: filteredExpenses[0]?.DSC || "General Administration and Support Services",
              OPERUNIT: filteredExpenses[0]?.OPERUNIT || "1000000",
              UACS_OPER_DSC: filteredExpenses[0]?.UACS_OPER_DSC || "Central Office",
              UACS_REG_ID: filteredExpenses[0]?.UACS_REG_ID || "130000000",
              UACS_OPERDIV_ID: filteredExpenses[0]?.UACS_OPERDIV_ID || "1300000000",
              UACS_DIV_DSC: filteredExpenses[0]?.UACS_DIV_DSC || "NCR - National Capital Region",
              FUNDCD: filteredExpenses[0]?.FUNDCD || "101",
              UACS_FUNDSUBCAT_DSC: filteredExpenses[0]?.UACS_FUNDSUBCAT_DSC || "Regular Agency Fund",
              UACS_EXP_CD: filteredExpenses[0]?.UACS_EXP_CD || "5020000000",
              UACS_EXP_DSC: filteredExpenses[0]?.UACS_EXP_DSC || "Maintenance and Other Operating Expenses",
              UACS_SOBJ_CD: filteredExpenses[0]?.UACS_SOBJ_CD || "5020301001",
              UACS_SOBJ_DSC: filteredExpenses[0]?.UACS_SOBJ_DSC || "Supplies and Materials Expenses",
            }]
        } else {
            // Case 2: No data at all (show minimal slice with dummy data)
            breakdownExpenses = [{
              name: t("No Detail", "Walang Detalye"),
              value: 1,
              AMT: 0,
              SORDER: "999",
              DEPARTMENT: "00",
              UACS_DPT_DSC: "No Department",
              AGENCY: "No Agency",
              UACS_AGY_DSC: "No Agency Description",
              PREXC_FPAP_ID: "0000",
              PREXC_LEVEL: "0",
              DSC: "No Description",
              OPERUNIT: "0000000",
              UACS_OPER_DSC: "No Operating Unit",
              UACS_REG_ID: "000000000",
              UACS_OPERDIV_ID: "0000000000",
              UACS_DIV_DSC: "No Division",
              FUNDCD: "000",
              UACS_FUNDSUBCAT_DSC: "No Fund",
              UACS_EXP_CD: "0000000000",
              UACS_EXP_DSC: "No Expense Category",
              UACS_SOBJ_CD: "0000000000",
              UACS_SOBJ_DSC: "No Sub-Object",
            }]
        }
    }

    agencyDetail = {
      agency: selectedAgency,
      expenses: breakdownExpenses,
    }
  }

  return (
    <div className="space-y-6">
      {/* Agency Dropdown */}
      <Select value={selectedAgency} onValueChange={setSelectedAgency}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder={t("Select Agency", "Piliin ang Ahensya")} />
        </SelectTrigger>
        <SelectContent>
          {agencies.map(a => (
            <SelectItem key={a.name} value={a.name}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Pie chart for agency expenses */}
      {agencyDetail && (
        <ChartPanel
          title={`${agencyDetail.agency} - ${t("Expense Breakdown", "Pagkakahati ng Gastos")}`}
          isLoading={isLoading}
        >
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
                {agencyDetail.expenses.map((e, i) => (
                  <Cell key={i} fill={`hsl(${i * 50},60%,50%)`} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartPanel>
      )}
    </div>
  )
}

export default ByAgency