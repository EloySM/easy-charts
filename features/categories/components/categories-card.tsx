import {
  IconWallet,
  IconCash,
  IconTrendingDown,
  IconTrendingUp,
  IconEdit,
} from "@tabler/icons-react"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CategoriesCards() {
  const categories = [
    {
      id: "1",
      name: "Food & Dining",
      limit: 500,
      spent: 320,
    },
    {
      id: "2",
      name: "Transport",
      limit: 120,
      spent: 80,
    },
    {
      id: "3",
      name: "Entertainment",
      limit: 200,
      spent: 240,
    },
    {
      id: "4",
      name: "Shopping",
      limit: 300,
      spent: 150,
    },
  ]

  return (
    <div className="@container/main mx-auto w-full max-w-screen-2xl">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @4xl/main:grid-cols-3">
        {categories.map((c) => {
          const remaining = c.limit - c.spent
          const over = remaining < 0

          return (

            <Card
              key={c.id}
              className="@container/card transition-all hover:shadow-md"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconWallet className="size-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {c.name}
                      </CardTitle>
                      <CardDescription>
                        Monthly category budget
                      </CardDescription>
                    </div>
                  </div>

                  <CardAction>
                    <Badge variant="outline" className="gap-1">
                      {over ? (
                        <>
                          <IconTrendingDown className="size-3" />
                          Over
                        </>
                      ) : (
                        <>
                          <IconTrendingUp className="size-3" />
                          On track
                        </>
                      )}
                    </Badge>
                  </CardAction>
                </div>
              </CardHeader>

              <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <IconWallet className="size-4" />
                    Budget
                  </span>
                  <span className="font-medium">${c.limit}</span>
                </div>

                <div className="flex w-full justify-between">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <IconCash className="size-4" />
                    Spent
                  </span>
                  <span className="font-medium">${c.spent}</span>
                </div>

                <div className="flex w-full justify-between">
                  <span className="text-muted-foreground">
                    Remaining
                  </span>
                  <span
                    className={`font-semibold ${
                      over ? "text-destructive" : "text-emerald-600"
                    }`}
                  >
                    ${remaining}
                  </span>
                </div>

                <Link
                  href="#"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <IconEdit className="size-4" />
                  Edit category
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
