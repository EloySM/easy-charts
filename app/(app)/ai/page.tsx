"use client"
import { useState, useEffect } from "react"
import { getDetailedStatsForAI } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsPeriod {
  total: number;
  tx_count: number;
}

interface DashboardData {
  s7: StatsPeriod | null;
  s30: StatsPeriod | null;
  s90: StatsPeriod | null;
}

interface AIAdvice {
  analisis_7d: string;
  analisis_30d: string;
  analisis_90d: string;
  comparativa: string;
  consejo_urgente: string;
}

export default function DashboardPro() {
  const [data, setData] = useState<DashboardData>({ s7: null, s30: null, s90: null })
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [r7, r30, r90] = await Promise.all([
          getDetailedStatsForAI(7),
          getDetailedStatsForAI(30),
          getDetailedStatsForAI(90)
        ])
        
        setData({ s7: r7, s30: r30, s90: r90 })

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            stats: { period_7: r7, period_30: r30, period_90: r90 },
            currency: "USD" // Le indicamos a la IA que queremos dólares
          })
        })
        const advice = await res.json()
        setAiAdvice(advice)
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return (
    <div className="p-10 text-zinc-900 dark:text-zinc-100 animate-pulse font-medium text-center">
      Analyzing your financial data in USD...
    </div>
  )

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Smart Summary</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Insights driven by your spending habits</p>
      </header>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PeriodSection 
          title="Weekly (7d)" 
          stats={data.s7} 
          advice={aiAdvice?.analisis_7d} 
          accentClass="blue" 
        />
        <PeriodSection 
          title="Monthly (30d)" 
          stats={data.s30} 
          advice={aiAdvice?.analisis_30d} 
          accentClass="indigo" 
        />
        <PeriodSection 
          title="Quarterly (90d)" 
          stats={data.s90} 
          advice={aiAdvice?.analisis_90d} 
          accentClass="emerald" 
        />
      </div>

      {/* CONCLUSIÓN FINAL */}
      {aiAdvice && (
        <Card className="border-none bg-zinc-100 dark:bg-zinc-900 shadow-none">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-amber-600 dark:text-yellow-500 font-bold text-xs uppercase tracking-widest">
                Overall Conclusion
              </h3>
              <p className="text-xl md:text-2xl text-zinc-800 dark:text-zinc-100 font-semibold leading-tight">
                {aiAdvice.comparativa}
              </p>
            </div>
            
            <div className="flex gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-yellow-200">
                <span className="text-2xl">💡</span>
                <div>
                  <strong className="block text-sm">Immediate Action Plan</strong>
                  <p className="text-sm opacity-90 mt-1">{aiAdvice.consejo_urgente}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Componente interno para manejar las secciones con Cards que se adaptan
function PeriodSection({ title, stats, advice, accentClass }: { title: string, stats: StatsPeriod | null, advice?: string, accentClass: "blue" | "indigo" | "emerald" }) {
  const themes = {
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/5 border-blue-500/10",
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 border-indigo-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
  }

  const total = stats?.total || 0
  const avg = Math.round(total / (stats?.tx_count || 1))

  return (
    <div className="flex flex-col gap-4 h-full">
      <Card className="flex-none border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-tighter font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-4xl font-black ${themes[accentClass].split(' ')[0]}`}>
            ${total.toLocaleString('en-US')}
          </div>
          <div className="mt-4 flex justify-between text-[10px] uppercase font-bold text-zinc-400 border-t border-zinc-100 dark:border-zinc-900 pt-4">
            <span>{stats?.tx_count || 0} Tx</span>
            <span>Avg: ${avg}</span>
          </div>
        </CardContent>
      </Card>

      {/* Este Card se adapta automáticamente al alto del texto de la IA */}
      <Card className={`flex-1 border-none ${themes[accentClass].split(' ').slice(2).join(' ')}`}>
        <CardContent className="p-4">
          <header className="flex items-center gap-2 mb-2">
            <div className={`w-1.5 h-1.5 rounded-full ${themes[accentClass].split(' ')[0].replace('text', 'bg')}`} />
            <span className="text-[10px] font-bold uppercase opacity-60 dark:text-zinc-100">AI Insight</span>
          </header>
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            {advice || "Generating insights..."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}