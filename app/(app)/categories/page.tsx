import { Button } from "@/components/ui/button";
import { CirclePlus, Lock } from "lucide-react";
import Link from "next/link";
import CategoriesList from "@/features/categories/components/category-list";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Page() {

  const supabase = await supabaseServer()
  const { data: authData } = await supabase.auth.getUser()

  const { count } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true})
    .eq('user_id', authData.user?.id)
    .is('deleted_at', null)

  const LIMIT = 15
  const isLimitReached = (count ?? 0) >= LIMIT

  return (
    <div className='flex flex-col items-center'>

      <div className='w-full flex justify-end mb-6'>
        {isLimitReached ? (
          // Botón bloqueado si llegó al límite
          <Button
            variant="outline"
            size="sm"
            className="font-semibold px-4 text-amber-600 border-amber-200 bg-amber-50 hover:bg-amber-50 cursor-not-allowed"
            disabled
          >
            <Lock className="w-4 h-4 mr-2" />
            Limit reached ({count}/{LIMIT})
          </Button>
        ) : (
          // Botón normal si tiene espacio
          <Link href='/categories/new-category'>
            <Button
              variant="default"
              size="sm"
              className="font-semibold px-4"
            >
              <CirclePlus className="w-4 h-4 mr-2" />
              Create category
            </Button>
          </Link>
        )}
      </div>

      {isLimitReached && (
        <p className="text-xs text-muted-foreground mb-4">
          You have reached the limit of 15 categories for the free plan.
        </p>
      )}

      <CategoriesList />
    </div>
  )
}