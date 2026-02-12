import { supabaseServer } from "@/lib/supabase/server"

export default async function getTotalExpensesThisYear() {
  const supabase = await supabaseServer()
  
  // 1. Obtener el usuario actual para filtrar (Seguridad)
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return { totalExpenses: 0 }

  const thisYear = new Date().getFullYear()

  // 2. Query filtrando por usuario y rango de fechas
  const { data, error } = await supabase
  .rpc('get_total_expenses', { 
    p_user_id: user.id, 
    p_year: thisYear 
  });

  if (error) {
    console.error("Error fetching expenses:", error)
    return { totalExpenses: 0 }
  }

  // 4. Retornamos el objeto que espera tu componente
  return data
}