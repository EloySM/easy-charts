import { supabaseServer } from "@/lib/supabase/server";

export default async function getExpensesGrowthRate() {
  const supabase = await supabaseServer()

  const { data: { user } } = await supabase.auth.getUser()
  if(!user) return 0

  const { data, error } = await supabase.rpc('get_expenses_growth_rate', {
    p_user_id: user.id
  })

  if(error) {
    console.log(error.message)
  }

  return data || 0

}