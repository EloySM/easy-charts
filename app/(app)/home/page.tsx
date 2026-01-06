import { ChartPieDonutText } from '@/components/chart-pie-donut-text'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { DataTableDemo } from '@/components/data-table'
import Link from 'next/link'

// import { Card } from '@/components/ui/card'

export default function Page() {
  return (
  <div
    className='flex flex-col items-center m-8'
  >
   {/* <form action="/api/auth/logout" method='post'>
    <Button variant="destructive">Log out</Button>
   </form>  */}

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

      <div
        className='w-full grid md:grid-cols-2 gap-10 mt-8 grid-cols-1'
      >
        <ChartPieDonutText/>
        <ChartPieDonutText/>
      </div>
        <DataTableDemo/>    

    <div className='w-full flex justify-end'>
      <ModeToggle/>
    </div>

    <form action="/api/auth/logout" method='post'>
      <Button variant="destructive">Log out</Button>
    </form> 
    
  </div>
  )
}
