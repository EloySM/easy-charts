'use server'

import { supabaseServer } from "@/lib/supabase/server"

type PieRow = {label: string; value: number}
type TopCategoryRow = {
  label: string
  value: number
}

export default async function getTopCategoriesWithOthers(top = 5, period: 'month' | 'year' = 'month'): Promise<PieRow[]> {

  const supabase = await supabaseServer()
  const date = new Date()

  // Si pedimos 'year', enviamos un 0 al p_month de la base de datos
  // Lógica: Si el periodo es 'year', mandamos 0 (que en SQL tratará como "todos los meses")
  // Si es 'month', mandamos el mes actual (1-12)
  const month = period === 'month' ? date.getMonth() + 1 : 0  
  const year = date.getFullYear()

  const { data, error } = await supabase.rpc('get_top_categories_with_others', {
    p_month: month,
    p_year: year,
    p_top: top,
  })

  if (error) throw new Error(error.message)

  return (data ?? []).map((r: TopCategoryRow) => ({
    label: String(r.label),
    value: Number(r.value) || 0
  }))

}