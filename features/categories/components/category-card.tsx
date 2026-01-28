import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCash, IconEdit, IconAlertTriangle, IconCircleCheck, IconTargetArrow } from "@tabler/icons-react";
import Link from "next/link";
import { CategoryCardData } from "../types";
import { Separator } from "@/components/ui/separator"

interface CategoryCardProps {
  category: CategoryCardData
}

export default function CategoryCard({ category } : CategoryCardProps) {
  const remaining = category.monthly_limit - category.spent
  const over = remaining < 0  // Si el el dinero restante es menor que 0
  const exact = remaining === 0 // Si el dinero restante es igual a 0

  return (
    <Card className="flex flex-col justify-between transition hover:shadow-md">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold capitalize">
              {category.name.replace(/_/g, " ")}
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <Badge 
                variant="secondary" 
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  exact ? "bg-blue-100 text-blue-700" : 
                  over ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {exact ? "Perfect Match" : over ? "Over Limit" : "On Track"}
              </Badge>
            </CardDescription>
          </div>

          <div className="text-right">
            <span className="text-lg font-bold text-foreground">
              ${category.monthly_limit.toFixed(2)}
            </span>
            <p className="text-[10px] uppercase text-muted-foreground font-medium">Budget</p>
          </div>
        </div>
      </CardHeader>

      <div className="px-6 pb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <IconCash className="size-4" /> Spent
          </span>
          <span className="font-medium text-foreground">${category.spent.toFixed(2)}</span>
        </div>
        
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div 
            className={`h-full transition-all ${
              exact ? "bg-blue-500" : over ? "bg-red-500" : "bg-emerald-500"
            }`} 
            style={{ width: `${Math.min((category.spent / category.monthly_limit) * 100, 100)}%` }}   // Se pone Math.min y al final ,100 porque si lo gastado se sale del presupuesto entonces solo mostrará la barra llena y no se saldrá del div
          />
        </div>
      </div>

      <Separator />
      <CardFooter className="py-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2 font-medium">
          {exact ? (
            <>
              <IconTargetArrow className="size-4 text-blue-500" />
              <span className="text-blue-600 italic">Exactly on the limit!</span>
            </>
          ) : over ? (
            <>
              <IconAlertTriangle className="size-4 text-red-500" />
              <span className="text-red-600">${Math.abs(remaining).toFixed(2)} over</span>  {/* Para que no salga en negativo*/}
            </>
          ) : (
            <>
              <IconCircleCheck className="size-4 text-emerald-600" />
              <span className="text-emerald-600">${remaining.toFixed(2)} left</span>
            </>
          )}
        </div>

        <Link
          href={`/categories/${category.id}/edit`}
          className="flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <IconEdit className="size-3.5" />
          Edit
        </Link>
      </CardFooter>
    </Card>
  )
}