"use client"
import { useState, useEffect } from "react"
import { getDetailedStatsForAI } from "./actions"

// Estructura que devuelve getDetailedStatsForAI
interface StatsPeriod {
  total: number;
  tx_count: number;
}

// Estructura que guarda el estado 'data'
interface DashboardData {
  s7: StatsPeriod | null;
  s30: StatsPeriod | null;
  s90: StatsPeriod | null;
}

// Estructura que devuelve tu API de IA
interface AIAdvice {
  analisis_7d: string;
  analisis_30d: string;
  analisis_90d: string;
  comparativa: string;
  consejo_urgente: string;
}

// 3. Tipamos las props de StatCard
interface StatCardProps {
  title: string;
  data: StatsPeriod | null;
  color: string;
}

export default function DashboardPro() {
  const [data, setData] = useState<DashboardData>({ s7: null, s30: null, s90: null })
  const [aiAdvice, setAiAdvice] = useState<AIAdvice | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        // 1. Ejecutamos los 3 RPCs en paralelo
        const [r7, r30, r90] = await Promise.all([
          getDetailedStatsForAI(7),
          getDetailedStatsForAI(30),
          getDetailedStatsForAI(90)
        ])
        
        setData({ s7: r7, s30: r30, s90: r90 })

        // 2. Enviamos el PAQUETE COMPLETO a la IA para que pueda comparar
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            stats: {
              period_7: r7,
              period_30: r30,
              period_90: r90
            } 
          })
        })
        const advice = await res.json()
        setAiAdvice(advice)
      } catch (error) {
        console.error("Error cargando dashboard:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="p-10 text-white animate-pulse">Consultando base de datos y preparando análisis...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Resumen Inteligente</h1>
        <p className="text-zinc-500">Análisis comparativo de tus gastos</p>
      </header>

      {/* BLOQUES DE RESUMEN CON ANÁLISIS INDIVIDUAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4">
          <StatCard title="Semanal (7d)" data={data.s7} color="text-blue-400" />
          <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl text-xs text-blue-200 min-h-[80px]">
            <span className="font-bold block mb-1">IA 7 Días:</span>
            {aiAdvice?.analisis_7d || "Generando..."}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <StatCard title="Mensual (30d)" data={data.s30} color="text-indigo-400" />
          <div className="bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-xl text-xs text-indigo-200 min-h-[80px]">
            <span className="font-bold block mb-1">IA 30 Días:</span>
            {aiAdvice?.analisis_30d || "Generando..."}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <StatCard title="Trimestral (90d)" data={data.s90} color="text-emerald-400" />
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl text-xs text-emerald-200 min-h-[80px]">
            <span className="font-bold block mb-1">IA 90 Días:</span>
            {aiAdvice?.analisis_90d || "Generando..."}
          </div>
        </div>
      </div>

      {/* COMPARATIVA Y ACCIÓN FINAL */}
      {aiAdvice && (
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl p-8">
            <h3 className="text-yellow-500 font-bold text-sm uppercase mb-4 tracking-widest">Conclusión General</h3>
            <p className="text-xl text-zinc-100 mb-6">{aiAdvice.comparativa}</p>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl text-yellow-200">
                <strong>💡 Acción inmediata:</strong> {aiAdvice.consejo_urgente}
            </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ title, data, color }: StatCardProps) {
  const total = data?.total || 0
  const txCount = data?.tx_count || 1
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors h-full">
      <p className="text-zinc-500 text-sm font-semibold">{title}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className={`text-4xl font-black ${color}`}>{total}€</span>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-xs text-zinc-500">
        <span>{data?.tx_count || 0} operaciones</span>
        <span>Media: {Math.round(total / txCount)}€</span>
      </div>
    </div>
  )
}