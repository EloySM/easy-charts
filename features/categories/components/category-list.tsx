"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import CategoryCard from "./category-card"
import { CategoryCardData, CategoryRowData } from "../types"

const PAGE_SIZE = 15  // Cada carga traerá 15 nuevas categorias

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0) // Coge el año, el mes, el dia 1, 0 horas, 0 minnutos, 0 segundos, 0 milisegundos
}
function startOfNextMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 1, 0, 0, 0, 0) //  + 1 para el mes siguiente
}

export default function CategoriesList() {
  const [items, setItems] = useState<CategoryCardData[]>([])  // Se utiliza para meter las targetas de todas la categorias utilizando los tipos de CategoryCard
  const [page, setPage] = useState(0)  // Es la primera pagina en donde se mostraran las primeras 15 tarjetas 
  const [loading, setLoading] = useState(false) // Indica si se estan cargando datos
  const [hasMore, setHasMore] = useState(true)  // Indica si quedan más categorias por cargar

  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Esta funcion se utiliza para cargar la siguiente pagina
  const loadMore = useCallback(async () => {  // useCallback memoriza la funcion para volver a ser llamada
    if (loading || !hasMore) return     /* Si ya esta cargando o no hay más cosas que cargar entonces no hace nada */
    setLoading(true)  /* De lo contrario ponemos el loading en true */

    const supabase = createClient() // Crear cliente de supabase

    // Esto es un indice pagina 0 -> de 0 a 14 son 15 categorias que se cargan
    // pagina 1 -> de 15 a 29 son 15 nuevas categorias que se cargan
    const from = page * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // 1) Traer categorías (paginadas)
    const { data: categories, error: catErr } = await supabase  // categories -> se guardan las categorias y catErr -> error si ocurrio en la consulta
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("name", { ascending: true })
      .range(from, to)

    if (catErr) {
      console.error(catErr)
      setLoading(false)
      return
    }

    const batch = (categories ?? []) as CategoryRowData[] // Si categories es null o undefined, entonces categories se vuelve un array vacio con los tipos de CategoryRow
    if (batch.length === 0) { // Si no hay categorias, se deja de cargar y se indica que no quedan más categorias por cargar
      setHasMore(false)
      setLoading(false)
      return
    }

    if (batch.length < PAGE_SIZE) setHasMore(false) // Si vinieron menos de 15 nuevas categorias, entonces es la ultima página en cargar

    const categoryIds = batch.map((c) => c.id)  // En esta variabnle se guardan todos los ids de las categorias

    // Mes/año actuales
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()

    // Rango de fechas para gastos del mes actual
    const fromDate = startOfMonth(now).toISOString()
    const toDate = startOfNextMonth(now).toISOString()

    // 2) Traer budgets del mes actual para esas categorías
    //    (puede que alguna categoría no tenga budget todavía -> la tratamos como 0)
    const budgetsPromise = supabase
      .from("budgets")
      .select("category_id, monthly_limit")
      .eq("month", month)
      .eq("year", year)
      .in("category_id", categoryIds)

    // 3) Traer gastos del mes actual para esas categorías
    //    y luego sumarlos por category_id en el cliente
    const expensesPromise = supabase
      .from("expenses")
      .select("category_id, amount")
      .gte("date", fromDate)
      .lt("date", toDate)
      .in("category_id", categoryIds)

    const [
      { data: budgets, error: budErr },
      { data: expenses, error: expErr },
    ] = await Promise.all([budgetsPromise, expensesPromise])  // Lanza las dos queries al mismo tiempo

    if (budErr) {
      console.error(budErr)
      setLoading(false)
      return
    }
    if (expErr) {
      console.error(expErr)
      setLoading(false)
      return
    }

    // Map presupuesto por category_id
    const budgetByCat = new Map<string, number>() // El objeto Map está diseñado para guardar parejas, como la clave(uuid) y el valor(limite mensual)
    for (const c of budgets ?? []) {
      budgetByCat.set(c.category_id as string, Number(c.monthly_limit) || 0)
    }

    // Sumatorio de gastos por category_id
    const spentByCat = new Map<string, number>()
    for (const e of expenses ?? []) {
      const id = e.category_id as string  // Para cada expense lee su category_id
      const amt = Number(e.amount) || 0 // Obtenemos el precio de cada expense
      spentByCat.set(id, (spentByCat.get(id) ?? 0) + amt) // Ahora asignamos a cada categoria los gastado en cada una de ellas si aparece un nuevo gasto con una categoria ya utilizada, entonces en el respectivo id de la categoria sumamos el nuevo gasto pero si es el primer gasto que encuentra entonces le ponemos 0
    }

    // 4) Construir cards finales
    const newItems: CategoryCardData[] = batch.map((c) => ({
      id: c.id,
      name: c.name,
      monthly_limit: budgetByCat.get(c.id) ?? 0,
      spent: spentByCat.get(c.id) ?? 0,
    }))

    setItems((prev) => [...prev, ...newItems])  // Añadimos newItems a items
    setPage((p) => p + 1) // Avanza de pagina
    setLoading(false) // Paramos la carga
  }, [page, loading, hasMore])

  // Observer (carga inicial + siguientes)
  useEffect(() => {
    const el = loaderRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      { rootMargin: "300px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="@container/main mx-auto w-full max-w-screen-2xl">
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {items.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      
      </div>

      <div
        ref={loaderRef}
        className="flex h-16 items-center justify-center text-sm text-muted-foreground"
      >
        {loading && "Loading more categories…"}
        {!loading && !hasMore && items.length > 0 && "No more categories"}
        {!loading && items.length === 0 && "Loading categories…"}
      </div>
    </div>
  )
}
