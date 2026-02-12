// app/(app)/data-dashboard/actions.ts
'use server'

import getExpensesComparison from '@/features/data-dashboard/services/get-expenses-comparison'

/**
 * Server Action que se ejecuta cuando el usuario cambia el selector
 * 
 * POR QUÉ: Permite llamar código del servidor desde un Client Component
 * sin exponer credenciales o lógica sensible al navegador
 */
export async function getExpensesData(days: number) {
  return await getExpensesComparison(days)
}