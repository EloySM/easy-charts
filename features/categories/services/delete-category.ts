'use server'

import { supabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export default async function deleteExpense(formData: FormData) {

  const id = formData.get('category-id')
  const currentDate = new Date().toISOString()

  const supabase = await supabaseServer()

  const { error: expError } = await supabase
  .from('expenses')
  .update({ deleted_at: currentDate })
  .eq('category_id', id)
  .is('deleted_at', null)

  if(expError) throw new Error(`Error deleting: ${expError.message}`)

  const { error: catError } = await supabase
  .from('categories')
  .update({ deleted_at: currentDate })
  .eq('id', id)

  if(catError) throw new Error(`Error deleting a category: ${catError.message}`)

  revalidatePath('/expenses')
}