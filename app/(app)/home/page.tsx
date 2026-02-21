import { ChartPieDonutText } from '@/features/home/components/chart-pie-donut-text'
import { DataTableDemo } from '@/features/home/components/data-table'
import getTopCategoriesWithOthers from '@/features/home/services/get-expenseive-categories'
import { getRecentExpenses } from '@/features/home/services/get-recent-expenses'

export default async function Page() {
// Disparamos las dos consultas a la vez
  const [dataMensual, dataAnual, recentExpenses] = await Promise.all([
    getTopCategoriesWithOthers(5, 'month'),
    getTopCategoriesWithOthers(5, 'year'),
    getRecentExpenses()
  ])

  return (
  <div
    className='flex flex-col items-center'
  >
    <div
       className='w-full grid md:grid-cols-2 gap-10 grid-cols-1'
      >
        <ChartPieDonutText data={dataAnual} period={'year'} />
        <ChartPieDonutText data={dataMensual} period={'month'} />
    </div>

    <DataTableDemo data={recentExpenses}/>    
    
  </div>
  )
}
