import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExpenseList } from "@/features/expenses/components/expenses-list";

export default function Page() {

  return (
    <div className=''>

    <div className="flex w-full justify-end mb-6">
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
    </div>

    <ExpenseList />
    </div>
  )
}