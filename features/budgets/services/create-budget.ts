// 'use server'

// import { redirect } from "next/dist/server/api-utils"
// import { supabaseServer } from "@/lib/supabase/server"
// import type { CreateBudgetInput } from "../types"

// export async function createBudget(formData: FormData) {

//   const date = new Date()
//   const rawMonthlyLimit = formData.get('category-amount')

//   // Validaciones
//   if (typeof rawMonthlyLimit !== 'string') throw new Error('Invalid category')

//   const data: CreateBudgetInput = {
//     category_id: ,
//     month: date.getMonth() + 1, // Se pone +1 porque va desede 0 a 11
//     year: date.getFullYear(),
//     monthly_limit: Number(rawMonthlyLimit)
//   }
  
//   const supabase = await supabaseServer()

//   const { data: authData } = await supabase.auth.getUser()

//   if (!authData?.user) throw new Error('Not authenticated')

//   const { error } = await supabase.from('budget').insert({
//     user_id: authData.user.id,
//     ...data
//   })

//   if ( error ) throw new Error(error.message)

//   redirect('/categories')
// }