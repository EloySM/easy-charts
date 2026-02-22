// features/data-dashboard/components/chart-area-interactive.tsx
"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { getExpensesData } from '@/app/(app)/data-dashboard/actions'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartConfig = {
  expenses: {
    label: 'Expense'
  },
  currentYear: {
    label: "This Year",
    color: "#3b82f6", 
  },
  lastYear: {
    label: "Last Year",
    color: "#10b981",
  },
} satisfies ChartConfig

export interface ChartDataPoint {
  date_time: string
  currentYear: number
  lastYear: number
}

/**
 * Client Component con interactividad (Select)
 * 
 * POR QUÉ "use client": 
 * - Necesita useState para manejar estado local
 * - Necesita useEffect para reaccionar a cambios
 * - Recharts solo funciona en el cliente
 */
export function ChartAreaInteractive({initialData}: {initialData: ChartDataPoint[]}) {
  // Estado: rango seleccionado (7, 30, o 90)
  const [timeRange, setTimeRange] = React.useState("90")
  
  // Estado: datos del gráfico
  const [data, setData] = React.useState(initialData)
  
  // Estado: indicador de carga
  const [isLoading, setIsLoading] = React.useState(false)

  /**
   * Effect que se ejecuta cuando cambia timeRange
   * 
   * POR QUÉ useEffect:
   * - Necesitamos reaccionar a cambios del Select
   * - Llamar Server Action de forma asíncrona
   * - Actualizar estado con nuevos datos
   */
  React.useEffect(() => {
  const updateData = async () => {
    setIsLoading(true)
    try {
      const days = parseInt(timeRange)
      const newData = await getExpensesData(days)
      
      // 🔍 DEBUG: Verifica los datos
      console.log('📊 Datos recibidos:', newData)
      console.log('📊 Primer item:', newData[0])
      
      setData(newData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  updateData()
}, [timeRange])// ← Se ejecuta cuando timeRange cambia

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Expenses Comparison</CardTitle>
          <CardDescription>
            Compare your expenses with last year
          </CardDescription>
        </div>
        
        {/* Select controlado por estado */}
        <Select 
          value={timeRange} 
          onValueChange={setTimeRange}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[160px] rounded-lg">
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {/* Indicador de carga */}
        {isLoading && (
          <div className="flex items-center justify-center h-[250px]">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading data...</p>
            </div>
          </div>
        )}
        
        {/* Gráfico */}
        {!isLoading && (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={data}>
              <defs>
                {/* Gradiente para año actual */}
                <linearGradient id="fillCurrentYear" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-currentYear)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-currentYear)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                
                {/* Gradiente para año pasado */}
                <linearGradient id="fillLastYear" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-lastYear)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-lastYear)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              
              <CartesianGrid vertical={false} />
              
              <XAxis
                dataKey="date_time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })
              }}
              />
              
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent labelFormatter={(value) => {
                  return new Date(value).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                })
                }}
                indicator="dot" />}
              />
              
              {/* Área del año actual (arriba) */}
              <Area
                dataKey="currentYear"
                type="natural"
                fill="url(#fillCurrentYear)"
                stroke="var(--color-currentYear)"
                stackId="b"
              />
              
              {/* Área del año pasado (abajo) */}
              <Area
                dataKey="lastYear"
                type="natural"
                fill="url(#fillLastYear)"
                stroke="var(--color-lastYear)"
                stackId="a"
              />
              
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
// ```

// **Cambios:**
// 1. ✅ **Import de Server Action**: `import { getExpensesData } from '@/app/(app)/data-dashboard/actions'`
// 2. ✅ **Estado `isLoading`**: Para mostrar feedback al usuario
// 3. ✅ **useEffect activado**: Llama `getExpensesData()` cuando cambia el selector
// 4. ✅ **Select values sin 'd'**: `"90"` en lugar de `"90d"`
// 5. ✅ **dataKey actualizados**: `currentYear` y `lastYear` (antes `desktop` y `mobile`)
// 6. ✅ **Gradientes renombrados**: `fillCurrentYear` y `fillLastYear`
// 7. ✅ **UI de loading**: Spinner mientras carga
// 8. ✅ **Select deshabilitado**: `disabled={isLoading}` evita clicks durante la carga

// **Por qué:**
// - **useState**: Necesario para estado reactivo (Select y datos)
// - **useEffect**: Ejecuta código cuando cambia el estado
// - **getExpensesData**: Llama al servidor sin recargar la página
// - **isLoading**: Mejora UX mostrando que algo está pasando
// - **dataKey**: Deben coincidir con los campos de tus datos

// ---

// ## 🔄 Flujo completo de ejecución:
// ```
// 1. Usuario entra a /data-dashboard
//    ↓
// 2. page.tsx (servidor) ejecuta:
//    const initialData = await getExpensesComparison(90)
//    ↓
// 3. Renderiza <ChartAreaInteractive initialData={[...]} />
//    ↓
// 4. Componente se monta con useState(initialData)
//    ↓
// 5. Usuario cambia Select de "90" → "30"
//    ↓
// 6. setTimeRange("30") actualiza el estado
//    ↓
// 7. useEffect detecta cambio en timeRange
//    ↓
// 8. Ejecuta:
//    setIsLoading(true)
//    const newData = await getExpensesData(30)  ← LLAMADA AL SERVIDOR
//    setData(newData)
//    setIsLoading(false)
//    ↓
// 9. React re-renderiza con nuevos datos
//    ↓
// 10. Gráfico se actualiza suavemente ✨