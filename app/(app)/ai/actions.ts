"use server"

import { supabaseServer } from "@/lib/supabase/server"

export async function getDetailedStatsForAI(days: number = 30) {
  const supabase = await supabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  // Llamamos a tu RPC enviando los parámetros necesarios
  const { data, error } = await supabase.rpc('get_expense_window_summary', {
    p_user_id: user.id,
    p_days: days,
    // p_tz: 'UTC', // O el timezone del usuario
    // p_top_categories: 5,
    // p_top_descriptions: 10,
    // p_top_peak_days: 3
  })

  if (error) {
    console.error("Error en RPC:", error)
    return null
  }

  return data; // Esto ya devuelve el JSON estructurado que definiste en el SQL
}