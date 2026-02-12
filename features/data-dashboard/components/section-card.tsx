import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import getTotalExpensesThisYear from "../services/get-total-expenses-this-year"
import getNumberOfExpensesThisYear from "../services/get-number-of-expenses-this-year"
import getNumberOfCategoriesThisYear from "../services/get-number-of-categories-this-year"
import getExpensesGrowthRate from "../services/get-expenses-growthRate"

export async function SectionCards() {
  const [totalExpenses, numberOfExpenses, numberOfCategories, expensesGrowthRate] = await Promise.all(
    [getTotalExpensesThisYear(), getNumberOfExpensesThisYear(), getNumberOfCategoriesThisYear(), getExpensesGrowthRate()])
  
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @lg/main:grid-cols-2 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense This Year</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalExpenses.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Visitors for the last 6 months
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>New Expenses This Year</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfExpenses.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown />
              -20%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Acquisition needs attention
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Categories</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {numberOfCategories.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expenses Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {expensesGrowthRate.toLocaleString()}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {expensesGrowthRate.toLocaleString()}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  )
}
