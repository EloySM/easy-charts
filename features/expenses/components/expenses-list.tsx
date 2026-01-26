"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import ExpenseCard from "./expense-card"

// Definimos el tipo exactamente como tú lo quieres: con OBJETO, no array
export type ExpenseRowData = {
  id: string
  description: string
  amount: number
  date: string
  additional_notes: string | null
  categories: { name: string } | null // Sin corchetes []
}

export function ExpenseList() {
  const [expenses, setExpenses] = useState<ExpenseRowData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadExpenses() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("expenses")
        .select(`
          id,
          description,
          amount,
          date,
          additional_notes,
          categories(name)
        `)
        .order("date", { ascending: false })

      if (error) {
        setLoading(false)
        console.error(error)
        return
      }

      // Ahora sí, TypeScript acepta transformedData como ExpenseRowData[]
      setExpenses((data as unknown) as ExpenseRowData[])
      setLoading(false)
    }

    loadExpenses()
  }, [])

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading expenses…</p>
  }

  if (expenses.length === 0) {
    return <p className="p-6 text-muted-foreground">No expenses yet</p>
  }

  return (
    <div className="@container/main mx-auto w-full max-w-screen-2xl">
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {expenses.map((e) => (
          <ExpenseCard
            key={e.id}
            expense={e}
          />
        ))}
      </div>
    </div>
  )
}