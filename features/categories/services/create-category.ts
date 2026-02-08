'use server'  // Esto es para hacer todo el archivo server action

import { redirect } from "next/navigation"
import { supabaseServer } from "@/lib/supabase/server"
import type { CreateCategoryInput, CategoryIdRow } from "../types"
import type { CreateBudgetInput } from "@/features/budgets/types"

export async function createCategory(formData: FormData) {
  // Validar nombre
  const rawName = formData.get('category-name')
  if (typeof rawName !== 'string' || rawName.trim() === '') {
    throw new Error('Invalid category name')
  }

  const categoryData: CreateCategoryInput = {
    name: rawName.trim().replace(/\s+/g, '_')
  }

  // Supabase + user
  const supabase = await supabaseServer()
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData.user) throw new Error('Not authenticated')

  const { count, error: countError } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', authData.user.id)
    .eq('is_active', true)

  if (countError) throw new Error('Error checking category limit')

  const LIMIT = 15
  if (count !== null && count >= LIMIT) throw new Error(`Limit reached: You can only have up to ${LIMIT} categories on the free plan.`)

  // Insert category y obtener id
  const { data: categoryRow, error: categoryError } = await supabase
  .from('categories')
  .insert({
    user_id: authData.user.id,
    ...categoryData
  })
  .select('id')
  .single<CategoryIdRow>(); // .single = convierte el array en objeto

  if (categoryError || !categoryRow) {
    throw new Error(categoryError?.message ?? 'Failed to create category')
  }

  const rawMonthlyLimit = formData.get('category-amount')
  if (typeof rawMonthlyLimit !== 'string' || isNaN(Number(rawMonthlyLimit))) {
    throw new Error('Invalid monthly limit')
  }

  const monthlyLimit = Number(rawMonthlyLimit)

  const budgetData: CreateBudgetInput = {
    category_id: categoryRow.id,
    monthly_limit: monthlyLimit
  }

  // Insert budget
  const { error: budgetError } = await supabase.from('budgets').insert({
    user_id: authData.user.id,
    ...budgetData
  })

  if (budgetError) throw new Error(budgetError.message)

  redirect('/categories')
}
