import { FieldCategory } from '@/features/categories/components/field-category'
import { Card } from '@/components/ui/card'
import { Suspense } from 'react'

export default function Page() {

  return (
    <div className=''>
      <Card className=''>
        <h1 className='flex text-2xl font-medium justify-center'>
          New Category
        </h1>

        <Suspense fallback={<div>Cargando</div>}>
          <FieldCategory/>
        </Suspense>

      </Card>
    </div>
  )
}