export type Expense = {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
  updated_at: string | null;
  additional_notes: string | null;
};

export type CreateExpenseInput = {
  category_id: string;
  amount: number;
  description: string;
  date: string;
  additional_notes?: string;
};

export type ExpenseRowData = {
  id: string
  description: string
  amount: number
  date: string
  additional_notes: string  | null
  categories: { name: string} | null
}