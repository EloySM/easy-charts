// features/categories/types.ts
export type Category = {
  id: string;
  user_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
};

// features/categories/types.ts
export type CreateCategoryInput = {
  name: string;
};

export type CategoryIdRow = {
  id: string
}
