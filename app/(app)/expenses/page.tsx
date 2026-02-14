import { Button } from "@/components/ui/button";
import { Plus, Lock } from "lucide-react";
import Link from "next/link";
import { ExpenseList } from "@/features/expenses/components/expenses-list";
import CheckMonthlyLimit from "@/features/expenses/services/check-monthly-limit";

export default async function Page() {

  const expensesCount = await CheckMonthlyLimit()

  const LIMIT = 30

  const isLimitReached = expensesCount >= LIMIT

  return (
    <div className=''>

    <div className="flex w-full justify-end mb-6">
      {!isLimitReached ? (
      <Link 
        href='/expenses/new-expense' 
      >
        <Button
          variant="default"
          size="sm"
          className="font-semibold px-4 hover: cursor-pointer"
        >
          <Plus className='' />
            Add expense
        </Button>
      </Link>
      ) : (
        <Button 
          variant='outline' 
          className="font-semibold px-4 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-50 cursor-not-allowed"
          disabled
        >
          <Lock className="w-4 h-4 mr-2" />
          Limit reached ({expensesCount}/{LIMIT})
        </Button>
      )
      }
    </div>

    <ExpenseList />
    </div>
  )
}