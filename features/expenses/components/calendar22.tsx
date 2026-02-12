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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

export function Calendar22() {
  const now = new Date()
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(now)  // ← CAMBIO: undefined → now
  const [time, setTime] = React.useState<string>(() => {
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    const s = now.getSeconds().toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  })

  const dateTime = React.useMemo(() => {
    if (!date) return ""
    
    const [hours, minutes, seconds] = time.split(":")
    console.log('🕐 Time value:', time)  // ← DEBUG
    console.log('🕐 Split:', { hours, minutes, seconds })  // ← DEBUG
    
    const combined = new Date(date)
    combined.setHours(parseInt(hours), parseInt(minutes), parseInt(seconds || '0'))
    
    console.log('📅 DateTime final:', combined.toISOString())  // ← DEBUG
    return combined.toISOString()
  }, [date, time])

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden input con dateTime combinado */}
      <input type="hidden" name="expense-date" value={dateTime} />  
      {/* ↑ CAMBIO: Usa dateTime en lugar de date.toISOString() */}

      <Label htmlFor="date" className="px-1">
        Date & Time
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden pb-6" align="start">
          <Calendar
            mode="single"
            selected={date}
            defaultMonth={date}  /* ← AÑADIDO: Abre en el mes actual */
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date)
              setOpen(false)
            }}
          />
          <CardFooter className="bg-card border-t">
            <Field>
              <FieldLabel htmlFor="time">Time</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="time"
                  type="time"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
                <InputGroupAddon>
                  <Clock2Icon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </CardFooter>
        </PopoverContent>
      </Popover>

      {/* Vista previa opcional */}
      {date && (
        <p className="text-xs text-muted-foreground px-1">
          {new Date(dateTime).toLocaleString('es-ES', {
            dateStyle: 'medium',
            timeStyle: 'short'
          })}
        </p>
      )}
    </div>
  )
}