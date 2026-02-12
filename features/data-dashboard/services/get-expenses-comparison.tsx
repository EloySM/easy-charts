import { supabaseServer } from "@/lib/supabase/server"

/**
 * Interfaz para los datos que vienen directamente de la RPC en Postgres
 */
export interface RPCExpenseComparison {
  chart_date: string
  current_amount: number
  previous_amount: number
}

/**
 * Interfaz para los datos ya formateados para el gráfico de Shadcn
 */
export interface ChartDataPoint {
  date_time: string
  currentYear: number
  lastYear: number
}

/**
 * Obtiene la comparativa de gastos entre el periodo actual y el año pasado
 * @param days Número de días hacia atrás (7, 30, 90)
 */
export default async function getExpensesComparison(days: number): Promise<ChartDataPoint[]> {
  const supabase = await supabaseServer()
  
  // 1. Validamos sesión del usuario
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // 2. Llamamos a la función RPC que creamos en Supabase
  const { data, error } = await supabase.rpc('get_expenses_comparison', {
    p_user_id: user.id,
    p_days: days
  })

  if (error) {
    console.error("❌ Error en RPC get_expenses_comparison:", error.message)
    return []
  }

  // 3. Transformamos los datos (Mapeo)
  // Convertimos los nombres de SQL (snake_case) a los que usa tu componente (camelCase)
  const formattedData: ChartDataPoint[] = (data as RPCExpenseComparison[]).map((item) => ({
    date_time: item.chart_date,        // Ejemplo: "11 Feb"
    currentYear: Number(item.current_amount),
    lastYear: Number(item.previous_amount),
  }))

  return formattedData
}