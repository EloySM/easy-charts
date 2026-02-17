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
    .select('id, description, amount, date_time, category_id, additional_notes, categories(name)')
    .order('date_time', {ascending: false})
    .is('deleted_at', null)
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
      amount: c.amount,
      description: c.description,
      category_id: c.category_id,
      date_time: c.date_time,
      additional_notes: c.additional_notes,
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

  /**
 * Elimina un gasto del estado local de forma optimista.
 * 1. useCallback: Memoriza la función para evitar re-renders innecesarios en las cards.
 * 2. setItems: Usa el estado previo (prev) para garantizar la integridad de los datos.
 * 3. filter: Crea un nuevo array excluyendo el ID borrado, lo que dispara la 
 * actualización visual inmediata sin esperar al servidor o recargar la página.
 */
  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));  // Si el id es diferente al que quiero eliminar entonces no se añade
  }, []);

  return {items, loading, hasMore, loaderRef, removeItem}

}