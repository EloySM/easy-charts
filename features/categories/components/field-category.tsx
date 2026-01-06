import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import Link from "next/link"
import { createCategory } from "../services/create-category"

export function FieldCategory() {
  return (
    <div className="w-full max-w-md mx-auto">
      <form action={createCategory}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="category-name">
                  Category Name
                </FieldLabel>
                <FieldDescription>
                  Enter a descriptive name for this category
                </FieldDescription>
                <Input
                  id="category-name"
                  name="category-name"
                  placeholder="Food & Dining"
                  required
                  autoComplete="off"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="category-amount">
                  Monthly Budget Limit
                </FieldLabel>
                <FieldDescription>
                  Set a spending limit for this category
                </FieldDescription>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="category-amount"
                    name="category-amount"
                    type="number"
                    placeholder="500.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <Field orientation="vertical">
            <Button className="w-full" type="submit">
              Create Category
            </Button>
            <Link href="/">
              <Button className="w-full" variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}