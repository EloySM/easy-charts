import { useCallback, useEffect, useRef, useState } from "react";
import { ExpenseCardData, ExpenseRowData } from "../types";
import { createClient } from "@/lib/supabase/client";

const PAGE_SIZE = 15

export default function useExpenseInfinite() {
  const [items, setItems] = useState<ExpenseCardData[]>([])
  const [page, setPage] = useState(0)  // Es la primera pagina en donde se mostraran las primeras 15 tarjetas 
  const [loading, setLoading] = useState(false) // Indica si se estan cargando datos
  const [hasMore, setHasMore] = useState(true)

  const loaderRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if(loading || !hasMore) return

    setLoading(true)

    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    const supabase = createClient()

    const {data: expenses, error: expError} = await supabase
    .from('expenses')
    .select('id, description, amount, date, additional_notes, categories(name)')
    .order('date', {ascending: false})
    .range(from, to)

    if(expError) {
      console.log(expError)
      setLoading(false)
      return
    }

    const batch = (expenses as unknown ?? []) as ExpenseRowData[]
    if(batch.length === 0) {
      setLoading(false)
      setHasMore(false)
    }

    if(batch.length < PAGE_SIZE) {
      setHasMore(false)
    }

    const newItems: ExpenseCardData[] = batch.map((c) => ({
      id: c.id,
      description: c.description,
      amount: c.amount,
      date: c.date,
      categories: c.categories
    }))

    setItems((prev) => [...prev, ...newItems])
    setPage((p) => p + 1)
    setLoading(false)

  }, [page, loading, hasMore])

  useEffect(() => {
    const el = loaderRef.current
    if(!el) return

    const observer = new IntersectionObserver(
      (entities) => {
        if(entities[0]?.isIntersecting) loadMore()
      },
      { rootMargin: '300px'}
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  return {items, loading, hasMore, loaderRef}

}