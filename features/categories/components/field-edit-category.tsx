import { Button } from "@/components/ui/button";
import { FieldSet, FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import editCategory from "../services/edit-category";

interface FieldEditCategoryProps{
  id: string
  initialData: {
    name: string
    budget: number
  }
}

export default function FieldEditCategory({ id, initialData }: FieldEditCategoryProps) {

  return(
    <div className="w-full max-w-md mx-auto">
      <form action={editCategory}>
        <input type="hidden" name="category-id" value={id}/>

        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input name="category-name" defaultValue={initialData.name.replace(/_/g, ' ')}/>
            </Field>
            <Field>
              <FieldLabel>Budget</FieldLabel>
              <Input name="category-budget" type="number" defaultValue={`${initialData.budget}`}/>
            </Field>
            <Button type="submit">Update</Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}