import { supabaseServer } from "@/lib/supabase/server"

export default async function getTotalExpensesThisYear() {
  const supabase = await supabaseServer()
  
  // 1. Obtener el usuario actual para filtrar (Seguridad)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { totalExpenses: 0 }

  const thisYear = new Date().getFullYear()
  const startOfYear = `${thisYear}-01-01`
  const endOfYear = `${thisYear}-12-31T23:59:59`

  // 2. Query filtrando por usuario y rango de fechas
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', user.id) // ¡Importante para que no sume lo de otros!
    .gte('date', startOfYear)
    .lte('date', endOfYear)

  if (expError) {
    console.error("Error fetching expenses:", expError)
    return { totalExpenses: 0 }
  }

  // 4. Retornamos el objeto que espera tu componente
  return expenses?.reduce((sum, exp) => sum + (exp.amount || 0), 0) || 0
}