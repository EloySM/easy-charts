import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCalendar, IconEdit,IconTrash } from "@tabler/icons-react"
import Link from "next/link"
import { ExpenseCardData } from "../types" // Importamos el tipo del padre
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Eye, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import deleteExpense from "../services/delete-expense"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

export default function ExpenseCard({ expense, onDelete }: { expense: ExpenseCardData, onDelete?: (id: string) => void }) {
  // 1. Extraemos el nombre entrando en el primer elemento del array [0]
  // Usamos el "?" para que no rompa la web si el array viene vacío
  const categoryName = expense.categories?.name || "Sin categoría"
  // 1. Creamos los parámetros de búsqueda de forma segura
  const params = new URLSearchParams({
    amount: expense.amount.toString(),
    category: expense.category_id,
    description: expense.description,
    date_time: expense.date_time,
    additional_notes: expense.additional_notes ?? ''})  // Porque no necesarioamente hay notas adicionales

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    // 1. Creamos el FormData manualmente
    const formData = new FormData()
    formData.append('expense-id', expense.id)

    // 2. Ejecutamos la acción dentro de startTransition
    startTransition(async () => {
      await deleteExpense(formData)
      if(onDelete) onDelete(expense.id)
      router.refresh() 
    })
  }

  return (
    <Card className="group transition hover:shadow-md">
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
          {new Date(expense.date_time).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>

        {/* <Link
          href={`/expenses/${expense.id}/edit-expense?${params.toString()}`}
          className="flex items-center gap-1 font-medium text-primary hover:text-primary/80  transition-all duration-300 opacity-0 group-hover:opacity-100"
        >
          <IconEdit className="size-3.5" />
          Edit
        </Link> */}
        <div className="transition-all duration-300 opacity-0 group-hover:opacity-100 has-[button[data-state=open]]:opacity-100"> {/* Con has lo que se haces es hacer referencia un elemento hijo */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuItem>
              <Eye className="mr-1"/>
              <span>View</span>
            </DropdownMenuItem> */}
            <Link
            href={`/expenses/${expense.id}/edit-expense?${params.toString()}`}>
              <DropdownMenuItem>
                <IconEdit className="mr-1"/>
                <span>Edit</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator/>
            <DropdownMenuItem 
              variant='destructive'
              onSelect={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isPending}
              className="cursor-pointer"
            >
              <IconTrash/>
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  )
}