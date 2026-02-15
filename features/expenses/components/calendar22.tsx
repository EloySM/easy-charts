"use client"

import * as React from "react"
import { ChevronDownIcon, Clock2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CardFooter } from "@/components/ui/card"
import { Field } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

// 1. Añadimos la interfaz para recibir la fecha inicial
interface Calendar22Props {
  initialDate?: string; 
}

export function Calendar22({ initialDate }: Calendar22Props) {
  // 2. Lógica para inicializar: Si hay initialDate, la usamos; si no, usamos "ahora"
  const baseDate = React.useMemo(() => initialDate ? new Date(initialDate) : new Date(), [initialDate])

  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(baseDate)
  
  const [time, setTime] = React.useState<string>(() => {
    const h = baseDate.getHours().toString().padStart(2, '0')
    const m = baseDate.getMinutes().toString().padStart(2, '0')
    const s = baseDate.getSeconds().toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  })

  const dateTime = React.useMemo(() => {
    if (!date) return ""
    const [hours, minutes, seconds] = time.split(":")
    const combined = new Date(date)
    combined.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || '0'))
    return combined.toISOString()
  }, [date, time])

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="expense-date" value={dateTime} />  

      <Label htmlFor="date" className="px-1 text-sm font-medium">
        Date & Time
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal" // Cambiado a w-full para mejor diseño
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}
            captionLayout="dropdown"  // Con esto conseguimos seleccionar meses y años por separados
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
          <div className="p-3 border-t bg-muted/20">
            <Field>
              <InputGroup>
                <InputGroupInput
                  id="time"
                  type="time"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <InputGroupAddon>
                  <Clock2Icon className="size-4 text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        </PopoverContent>
      </Popover>

      {date && (
        <p className="text-xs text-muted-foreground px-1">
          {new Date(dateTime).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
      )}
    </div>
  )
}