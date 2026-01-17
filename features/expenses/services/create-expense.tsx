import { supabaseServer } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function createExpense(formData: FormData) {
  'use server'

  const rawAmount = formData.get('expense-amount')
  const categoryId = formData.get('expense-category')
  const description = formData.get('expense-description')
  const rawDate = formData.get('expense-date')
  const comment = formData.get('expense-comment')

  if(
    typeof rawAmount !== 'string' ||
    rawAmount.trim() === '' ||
    isNaN(Number(rawAmount)) ||
    typeof categoryId !== 'string' ||
    categoryId.trim() === '' ||
    typeof description !== 'string' ||
    description.trim() === ''
  ) { throw new Error('Invalid expense data') }

  const amount = Number(rawAmount)

  const date = 
    typeof rawDate === 'string' && rawDate.trim() !== ''
      ? new Date(rawDate).toISOString()
      : new Date().toISOString()

  const supabase = await supabaseServer()

  // usuario autenticado
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: authData.user.id,
    category_id: categoryId,
    amount,
    description: description.trim(),
    date,
    additional_notes: typeof comment === 'string' && comment.trim() !== '' ? comment : null
  })

  if (error) {
    throw new Error(error.message)
  }

  redirect('/expenses')
}