import { Card } from "@/components/ui/card";
import FieldEditExpense from "@/features/expenses/components/field-edit-expense";

export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ [key: string]: string}> }) {  // Pongo promise porque si no me da error el motor de typeScript al no saber si es asyncona la consulta
  const { id } = await params // Cogemos el id de params porque Nextjs por defecto guarda el nombre de la carpeta y al ser [id] que es una ruta dinamica, guarda el id del gasto
  const data = await searchParams // Aqui se reciben los datos de la card
  
  return(
    <Card>
      <h1 className="flex text-2xl font-medium justify-center">
        Edit expense
      </h1>

      <FieldEditExpense id={id} initialData={{
        amount: data.amount.toString(),
        category: data.category_id, // Asegúrate que el componente espere 'category' y no 'category_id'
        description: data.description,
        date_time: data.date_time,
        additional_notes: data.additional_notes ?? undefined // Convierte null a undefined si es necesario
        }}
      />
    </Card>
  )
}