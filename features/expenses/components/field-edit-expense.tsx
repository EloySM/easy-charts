import { FieldSet, FieldGroup, Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupInput } from "@/components/ui/input-group";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar22 } from "./calendar22";
import { supabaseServer } from "@/lib/supabase/server";
import editExpense from "../services/edit-expense";
import { Button } from "@/components/ui/button";

// 1. Definimos la interfaz con los nombres exactos que vienen de la URL
interface FieldEditExpenseProps {
  id: string;
  initialData: {
    amount: string;
    category: string;
    description: string;
    date_time: string; // Cambiado de 'date' a 'date_time' para coincidir con la URL
    additional_notes?: string; // Cambiado para coincidir con el Link
  };
}

export default async function FieldEditExpense({ id, initialData }: FieldEditExpenseProps) {
  const supabase = await supabaseServer();

  const { data: categories, error } = await supabase
    .from("categories")
    .select("id, name")
    .is("deleted_at", null)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form action={editExpense}>
        <input type="hidden" name="expense-id" value={id} />
        
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel>Amount</FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>$</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="expense-amount"
                  name="expense-amount"
                  type="number"
                  // IMPORTANTE: defaultValue hace que el dato ya esté cargado para enviarse
                  defaultValue={initialData.amount}
                  inputMode="decimal"
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>USD</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Field>

            <Field>
              <FieldLabel>Category</FieldLabel>
              {/* defaultValue en el select selecciona automáticamente la opción correcta */}
              <NativeSelect 
                required 
                name="expense-category" 
                defaultValue={initialData.category}
              >
                <NativeSelectOption value="">Select category</NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption key={category.id} value={category.id}>
                    {category.name.replace(/_/g, ' ')}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Input 
                name="expense-description" // No olvides el name para la Server Action
                defaultValue={initialData.description.replace(/_/g, ' ')}
              />
            </Field>

            <Field>
              {/* Pasamos la fecha inicial al calendario si este acepta props */}
              <Calendar22 initialDate={initialData.date_time} />
            </Field>

            <Field>
              <FieldLabel>Additional notes</FieldLabel>
              <Textarea
                id="expense-comment"
                name="expense-comment"
                defaultValue={initialData.additional_notes}
                className="resize-none min-h-[100px]"
                maxLength={500}
              />
            </Field>

            <Button type="submit">
              Update
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </div>
  );
}