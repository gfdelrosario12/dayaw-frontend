"use client"

import { FC, Dispatch, SetStateAction } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartPanel } from "@/components/charts/chart-panel"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { useLanguage } from "@/context/language-context"

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

// Custom Tooltip Component
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
    const filteredExpenses = expenses.filter(e => e.name.startsWith(selectedAgency))
    
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