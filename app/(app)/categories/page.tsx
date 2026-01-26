import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import CategoriesList from "@/features/categories/components/category-list";

export default function Page() {

  return (
    <div className='flex flex-col items-center m-8'>
      Categories

      <Link 
      href='/categories/new-category' 
      className='w-full flex justify-end'>
        <Button
        variant="default"
        size="sm"
        className="font-semibold px-4"
        >
          <CirclePlus />
          Create category
        </Button>
      </Link>

      <CategoriesList />
    </div>
  )
}