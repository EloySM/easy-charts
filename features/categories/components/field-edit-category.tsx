import { Button } from "@/components/ui/button";
import { FieldSet, FieldGroup, Field, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import editCategory from "../services/edit-category";
import Link from "next/link";

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

            <FieldSeparator/>
            
            <Field>
              <Button type="submit">Update</Button>
              <Link href="/categories">
              <Button className="w-full" variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            </Field>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  )
}