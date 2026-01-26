import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExpenseList } from "@/features/expenses/components/expenses-list";

export default function Page() {

  return (
    <div className='flex flex-col items-center m-8'>
      Expenses

      <Link 
      href='/expenses/new-expense' 
      className='w-full flex justify-end'>
      <Button
        variant="default"
        size="sm"
        className="font-semibold px-4"
      >
        <Plus className='' />
          Add expense
      </Button>
    </Link>

    <ExpenseList />
    </div>
  )
}