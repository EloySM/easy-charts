import { supabaseServer } from "@/lib/supabase/server"

export default async function getNumberOfExpensesThisYear() {
  const supabase = await supabaseServer()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const thisYear = new Date().getFullYear()

  const { data, error } = await supabase.rpc('count_user_categories_by_year', {
    p_user_id: user.id,
    p_year: thisYear
  })

  if(error) {
    console.log(error.message)
    return 0
  }

  return data || 0

}