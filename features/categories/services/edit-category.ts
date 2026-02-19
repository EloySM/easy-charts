import { supabaseServer } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function editCategory(formData: FormData) {
  'use server'

  const supabase = await supabaseServer()

  const id = formData.get('category-id')
  const rawName = formData.get('category-name')
  if (typeof rawName !== 'string' || rawName.trim() === '') {
    throw new Error('Invalid category name')
  }
  const rawBudget = Number(formData.get('category-budget')) ?? 0

  const name = rawName
  const budget = rawBudget || 0

  const { error: catError } = await supabase
  .from('categories')
  .update({ name: name.trim().replace(/\s+/g, '_') })
  .eq('id', id)

  if(catError) throw new Error(`Error updating category's name: ${catError}`)

  const { error: budError } = await supabase
  .from('budgets')
  .update({ monthly_limit: Number(budget) })
  .eq('category_id', id)

  if(budError) throw new Error(`Error updating category's budget: ${budError.message}`)

  revalidatePath('/categories')
  redirect('/categories')
}