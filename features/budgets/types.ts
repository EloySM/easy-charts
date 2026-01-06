export type Budget = {
  id: string,
  user_id: string,
  category_id: string,
  monthly_limit: number,
  month: number,
  year: number,
  created_at: string,
}

export type CreateBudgetInput = {
  category_id: string,
  monthly_limit: number,
  month: number,
  year: number
}