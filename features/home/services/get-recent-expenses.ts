import { supabaseServer } from "@/lib/supabase/server"

export async function getRecentExpenses() {
  const supabase = await supabaseServer()

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      description,
      amount,
      date_time,
      categories ( name )  
    `)
    .order('date', { ascending: false })
    .limit(20)

  if (error || !data) { 
    console.log('Datos recibidos:', data)
    return []
  }

  // La "limpieza" está aquí: definimos el tipo de la fila al vuelo
  return data.map((item) => {
    // Le decimos a TS: "Esto tiene una propiedad categories que puede ser un objeto o un array"
    const cat = item.categories as { name: string } | { name: string }[] | null

    return {
      id: item.id,
      name: item.description,
      amount: item.amount,
      date: item.date_time,
      category: Array.isArray(cat) 
        ? cat[0]?.name 
        : cat?.name ?? 'Sin categoría'
    }
  })
}