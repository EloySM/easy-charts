import { FieldNewCategory } from '@/features/categories/components/field-new-category'
import { Card } from '@/components/ui/card'

export default function Page() {

  return (
    <div className=''>
      <Card className=''>
        <h1 className='flex text-2xl font-medium justify-center'>
          New Category
        </h1>

        <FieldNewCategory/>

      </Card>
    </div>
  )
}