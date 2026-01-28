"use client"

import CategoryCard from "./category-card"
import useCategoriesInfinite from "../services/use-categories-infinite"

export default function CategoriesList() {
  const { items, loading, hasMore, loaderRef } = useCategoriesInfinite()

  return (
    <div className="@container/main mx-auto w-full max-w-screen-2xl">
      <div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {items.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      <div
        ref={loaderRef}
        className="flex h-16 items-center justify-center text-sm text-muted-foreground"
      >
        {loading && "Loading more categories…"}
        {!loading && !hasMore && items.length > 0 && "No more categories"}
        {!loading && items.length === 0 && "Loading categories…"}
      </div>
    </div>
  )
}
