import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCalendar, IconEdit } from "@tabler/icons-react"
import Link from "next/link"
import { ExpenseRowData } from "../types" // Importamos el tipo del padre

export default function ExpenseCard({ expense }: { expense: ExpenseRowData }) {
  // 1. Extraemos el nombre entrando en el primer elemento del array [0]
  // Usamos el "?" para que no rompa la web si el array viene vacío
  const categoryName = expense.categories?.name || "Sin categoría"
  console.log(expense)

  return (
    <Card className="transition hover:shadow-md">
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              {expense.description.replace(/_/g, ' ')}
            </CardTitle>
            {/* 2. Mostramos el nombre procesado */}
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              {categoryName.replace(/_/g, ' ')}
            </Badge>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-foreground">
              ${expense.amount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardFooter className="border-t bg-muted/30 py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <IconCalendar className="size-3.5" />
          {new Date(expense.date).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        <Link
          href={`/expenses/${expense.id}/edit`}
          className="flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <IconEdit className="size-3.5" />
          Edit
        </Link>
      </CardFooter>
    </Card>
  )
}