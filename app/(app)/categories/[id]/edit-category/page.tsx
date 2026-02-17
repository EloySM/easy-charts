import { Card } from "@/components/ui/card";
import FieldEditCategory from "@/features/categories/components/field-edit-category";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string }>}) {
  const { id } = await params
  const data = await searchParams

  return(
    <Card>
      <h1 className="flex text-2xl font-medium justify-center">
        Edit Category
      </h1>

      <FieldEditCategory id={id} initialData={{
        name: data.name,
        budget: Number(data.budget)
      }}/>
    </Card>
  )
}