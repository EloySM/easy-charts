import { FieldCategory } from '@/features/categories/components/field-category'
import { Card } from '@/components/ui/card'

export default function Page() {

  return (
    <div className=''>
      <Card className=''>
        <h1 className='flex text-2xl font-medium justify-center'>
          New Category
        </h1>

        <FieldCategory/>

      </Card>
    </div>
  )
}