"use client"

import ExpenseCard from "./expense-card"
import useExpenseInfinite from "../services/use-expense-infinite"

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

  const { items, loading, hasMore, loaderRef } = useExpenseInfinite()

  return (
    <div className="@container/main mx-auto w-full max-w-screen-2xl">
      <div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {items.map((e) => (
          <ExpenseCard
            key={e.id}
            expense={e}
          />
        ))}
      </div>

      <div
        ref={loaderRef}
        className="flex h-16 items-center justify-center text-sm text-muted-foreground"
      >
        {loading && "Loading more expenses…"}
        {!loading && !hasMore && items.length > 0 && "No more expenses"}
        {!loading && items.length === 0 && "Loading expenses..."}
      </div>
    </div>
  )
}