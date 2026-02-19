'use server'

import { supabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export default async function deleteExpense(formData: FormData) {

  const id = formData.get('category-id')
  const currentDate = new Date().toISOString()

  const supabase = await supabaseServer()

  const { error } = await supabase
  .from('categories')
  .update({ deleted_at: currentDate })
  .eq('id', id)

  if(error) throw new Error(`Error deleting a category: ${error.message}`)

  revalidatePath('/expenses')
}