'use server'

import { supabaseServer } from "@/lib/supabase/server"

export default async function CheckMonthlyLimit() {

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const supabase = await supabaseServer()

  const {data: authData, error: authError} = await supabase.auth.getUser()
  if(authError || !authData) throw new Error('Not authenticated')

  const {data, error} = await supabase.rpc('check_monthly_limit', {
    p_user_id: authData.user.id,
    p_timezone: userTimezone
  })

  if(error) console.log(`Error in rpc check_monthly_limit: ${error}`)

  return data
}