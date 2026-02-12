"use client"
import { useState } from "react"
import { getDetailedStatsForAI } from "@/app/(app)/ai/actions"

export default function AIPage() {
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState("")

  const handleAskIA = async () => {
    setLoading(true)
    
    // 1. Obtener datos de Supabase (vía Server Action)
    const stats = await getDetailedStatsForAI(30)
    
    // 2. Enviar a nuestra API que habla con DeepSeek
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ stats, userQuestion: "¿En qué estoy gastando más y cómo puedo reducirlo?" })
    })
    
    const result = await res.json()
    setAnswer(result.text)
    setLoading(false)
  }

  return (
    <div className="p-8">
      <button onClick={handleAskIA} disabled={loading}>
        {loading ? "Analizando..." : "Preguntar a la IA sobre mis gastos"}
      </button>
      {answer && <div className="mt-4 p-4 border rounded">{answer}</div>}
    </div>
  )
}