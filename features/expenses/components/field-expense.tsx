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
import { Textarea } from "@/components/ui/textarea"
import { Calendar22 } from "../../../components/calendar-22"
import Link from "next/link"
import { redirect } from "next/navigation"
import { NativeSelect, NativeSelectOption } from "../../../components/ui/native-select"

async function createExpense(formData: FormData) {
  "use server"
  
  const data = {
    amount: formData.get('expense-amount'),
    category: formData.get('expense-category'),
    name: formData.get('expense-name'),
    date: formData.get('expense-date'),
    comment: formData.get('expense-comment')
  }
  
  console.log(data)
  
  // Aquí iría tu lógica de guardado
  // await db.expense.create({ data })
  
  redirect('/')
}

export function FieldExpense() {
  // Aquí deberías obtener las categorías de tu base de datos
  // const categories = await db.category.findMany()
  

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={createExpense}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="expense-amount">
                  Amount
                </FieldLabel>
                <FieldDescription>
                  Enter the total amount spent
                </FieldDescription>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="expense-amount"
                    name="expense-amount"
                    type="number"
                    placeholder="0.00"
                    inputMode="decimal"
                    // min="0"
                    // step="20"
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupText>USD</InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="expense-category">
                  Category
                </FieldLabel>
                <FieldDescription>
                  Select a spending category
                </FieldDescription>

                <NativeSelect>
                  <NativeSelectOption value="">Select status</NativeSelectOption>
                  <NativeSelectOption value="todo">Todo</NativeSelectOption>
                  <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
                  <NativeSelectOption value="done">Done</NativeSelectOption>
                  <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
                </NativeSelect>

              </Field>

              <Field>
                <FieldLabel htmlFor="expense-name">
                  Description
                </FieldLabel>
                <FieldDescription>
                  Brief description of the expense
                </FieldDescription>
                <Input
                  id="expense-name"
                  name="expense-name"
                  placeholder="Lunch at restaurant"
                  required
                  autoComplete="off"
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Calendar22 />

          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="expense-comment">
                  Additional Notes (Optional)
                </FieldLabel>
                <FieldDescription>
                  Add any relevant details or context
                </FieldDescription>
                <Textarea
                  id="expense-comment"
                  name="expense-comment"
                  placeholder="E.g., Business meeting, team lunch, client dinner..."
                  className="resize-none min-h-[100px]"
                  maxLength={500}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <FieldSeparator />

          <Field orientation="vertical">
            <Button className="w-full" type="submit">
              Add Expense
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